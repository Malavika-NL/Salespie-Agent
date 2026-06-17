// // src/features/dataSlice.ts

// import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// // Define the data structure you're expecting
// interface  MonthWiseBudgetDataState {
//   budgetdata: any; // Change `any` to a specific type if you know the structure of the data
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: MonthWiseBudgetDataState = {
//     budgetdata: [],
//   loading: false,
//   error: null,
// };

// // Thunk to fetch data from an API
// export const fetchAdminMonthWiseBudgetData = createAsyncThunk(
//   'budgetdata/fetchAdminMonthWiseBudgetData',
//   async (_, { rejectWithValue , getState}) => {
//     try {
//       const state = getState() as RootState;
//             const tokenData = state.userLoginAuth.user.tokens;
      
//             if (!tokenData.access) {
//               throw new Error('No access token available');
//             }
//       const response = await axios.get('/admin_monthly-total-amount/', {
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });
//       console.log('budget data ',response.data)
//       return response.data; // Assuming the data is in response.data
//     } catch (error: any) {
//       // Handle error and return a rejected value
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// // Data slice
// const AdminMonthWiseBudgetData = createSlice({
//   name: 'AdminMonthWiseBudgetData',
//   initialState,
//   reducers: {
//     // Action to clear the data
//     clearMonthWiseBudgetData: (state) => {
//       state.budgetdata = []; // Reset data to an empty array
//     },
//   },  // No synchronous actions are defined here
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminMonthWiseBudgetData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminMonthWiseBudgetData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.budgetdata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAdminMonthWiseBudgetData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearMonthWiseBudgetData } = AdminMonthWiseBudgetData.actions;
// // Export the reducer to include it in the store
// export default AdminMonthWiseBudgetData.reducer;

// src/features/AdminMonthWiseBudget/Slice/AdminMonthWiseBudgetSlice.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// const FY_MONTH_LIST = [
//   'April','May','June','July','August','September',
//   'October','November','December','January','February','March',
// ];

// const MONTH_NUM_TO_NAME: Record<number, string> = {
//   1:'January', 2:'February', 3:'March', 4:'April',
//   5:'May', 6:'June', 7:'July', 8:'August',
//   9:'September', 10:'October', 11:'November', 12:'December',
// };

// interface MonthWiseBudgetDataState {
//   budgetdata: any[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: MonthWiseBudgetDataState = {
//   budgetdata: [],
//   loading: false,
//   error: null,
// };

// export const fetchAdminMonthWiseBudgetData = createAsyncThunk(
//   'budgetdata/fetchAdminMonthWiseBudgetData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }

//       const headers = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${tokenData.access}`,
//       };

//       // Determine current FY
//       const now = new Date();
//       const currentMonth = now.getMonth() + 1;
//       const fyStartYear = currentMonth >= 4 ? now.getFullYear() : now.getFullYear() - 1;
//       const fyEndYear = currentMonth >= 4 ? now.getFullYear() + 1 : now.getFullYear();
//       const fyStart = new Date(fyStartYear, 3, 1);
//       const fyEnd = new Date(fyEndYear, 2, 31);

//       // Fetch both APIs in parallel
//       const [rankARes, budgetsRes] = await Promise.all([
//         axios.get('/api/admin_monthly-total-amount/', { headers }),
//         axios.get('/api/budgets/', { headers }),
//       ]);

//       const rankAData: any[] = rankARes.data || [];
//       const budgetsData: any[] = budgetsRes.data || [];

//       // Build achieved map
//       const achievedMap: Record<string, number> = {};
//       FY_MONTH_LIST.forEach(m => { achievedMap[m] = 0; });

//       rankAData.forEach((item: any) => {
//         const mName = MONTH_NUM_TO_NAME[item.month_number];
//         if (mName && achievedMap[mName] !== undefined) {
//           achievedMap[mName] += item.total_amount || 0;
//         }
//       });

//       // Build target map (FY filtered)
//       const targetMap: Record<string, number> = {};
//       FY_MONTH_LIST.forEach(m => { targetMap[m] = 0; });

//       budgetsData.forEach((b: any) => {
//         const createdAt = b.created_at ? new Date(b.created_at) : null;
//         if (createdAt && (createdAt < fyStart || createdAt > fyEnd)) return;

//         const entries: any[] = b.period_entries || [];
//         if (entries.length > 0) {
//           entries.forEach((pe: any) => {
//             if (pe.month && targetMap[pe.month] !== undefined) {
//               targetMap[pe.month] += parseFloat(pe.allocated || 0);
//             }
//           });
//         } else if (b.categories) {
//           b.categories.forEach((cat: any) => {
//             (cat.period_entries || []).forEach((pe: any) => {
//               if (pe.month && targetMap[pe.month] !== undefined) {
//                 targetMap[pe.month] += parseFloat(pe.allocated || 0);
//               }
//             });
//           });
//         }
//       });

//       // Build final data in FY order (April → March)
//       const MONTH_NAME_TO_NUM: Record<string, number> = {
//         'January':1,'February':2,'March':3,'April':4,'May':5,'June':6,
//         'July':7,'August':8,'September':9,'October':10,'November':11,'December':12,
//       };

//       const monthData = FY_MONTH_LIST.map(m => ({
//         month_name: m,
//         month_number: MONTH_NAME_TO_NUM[m],
//         total_amount: Math.round(achievedMap[m] || 0),
//         Expected: Math.round(targetMap[m] || 0),
//       }));

//       console.log('budget data', monthData);
//       return monthData;

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// const AdminMonthWiseBudgetData = createSlice({
//   name: 'AdminMonthWiseBudgetData',
//   initialState,
//   reducers: {
//     clearMonthWiseBudgetData: (state) => {
//       state.budgetdata = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminMonthWiseBudgetData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminMonthWiseBudgetData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.budgetdata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAdminMonthWiseBudgetData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearMonthWiseBudgetData } = AdminMonthWiseBudgetData.actions;
// export default AdminMonthWiseBudgetData.reducer;


// src/features/SalesAdminDashboard/MonthWiseBudget/Slice/AdminMonthWiseBudgetSlice.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// const FY_MONTH_LIST = [
//   'April','May','June','July','August','September',
//   'October','November','December','January','February','March',
// ];

// const MONTH_NUM_TO_NAME: Record<number, string> = {
//   1:'January',2:'February',3:'March',4:'April',
//   5:'May',6:'June',7:'July',8:'August',
//   9:'September',10:'October',11:'November',12:'December',
// };

// interface MonthWiseBudgetDataState {
//   budgetdata: any[];
//   loading:    boolean;
//   error:      string | null;
// }

// const initialState: MonthWiseBudgetDataState = {
//   budgetdata: [],
//   loading:    false,
//   error:      null,
// };

// export const fetchAdminMonthWiseBudgetData = createAsyncThunk(
//   'budgetdata/fetchAdminMonthWiseBudgetData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       // ── Read globalFilter ──────────────────────────────────
//       const { selectedYear } = state.globalFilter;

//       // FY date range from selected year
//       const fyStartYear = selectedYear;
//       const fyEndYear   = selectedYear + 1;
//       const fyStart     = new Date(fyStartYear, 3, 1);   // April 1
//       const fyEnd       = new Date(fyEndYear,   2, 31);  // March 31

//       const headers = {
//         'Content-Type': 'application/json',
//         Authorization:  `Bearer ${token.access}`,
//       };

//       // ✅ Pass year param to both APIs
//       const [rankARes, budgetsRes] = await Promise.all([
//         axios.get(
//           `/api/admin_monthly-total-amount/?year=${selectedYear}`,
//           { headers }
//         ),
//         axios.get(
//           `/api/budgets/`,
//           { headers }
//         ),
//       ]);

//       const rankAData:   any[] = rankARes.data   || [];
//       const budgetsData: any[] = budgetsRes.data || [];

//       // Build achieved map
//       const achievedMap: Record<string, number> = {};
//       FY_MONTH_LIST.forEach(m => { achievedMap[m] = 0; });

//       rankAData.forEach((item: any) => {
//         const mName = MONTH_NUM_TO_NAME[item.month_number];
//         if (mName && achievedMap[mName] !== undefined) {
//           achievedMap[mName] += item.total_amount || 0;
//         }
//       });

//       // Build target map — filtered to selected FY
//       const targetMap: Record<string, number> = {};
//       FY_MONTH_LIST.forEach(m => { targetMap[m] = 0; });

//       budgetsData.forEach((b: any) => {
//         // Filter to selected FY
//         const createdAt = b.created_at ? new Date(b.created_at) : null;
//         if (createdAt && (createdAt < fyStart || createdAt > fyEnd)) return;

//         const entries: any[] = b.period_entries || [];
//         if (entries.length > 0) {
//           entries.forEach((pe: any) => {
//             if (pe.month && targetMap[pe.month] !== undefined) {
//               targetMap[pe.month] += parseFloat(pe.allocated || 0);
//             }
//           });
//         } else if (b.categories) {
//           b.categories.forEach((cat: any) => {
//             (cat.period_entries || []).forEach((pe: any) => {
//               if (pe.month && targetMap[pe.month] !== undefined) {
//                 targetMap[pe.month] += parseFloat(pe.allocated || 0);
//               }
//             });
//           });
//         }
//       });

//       // Month name to number
//       const MONTH_NAME_TO_NUM: Record<string, number> = {
//         'January':1,'February':2,'March':3,'April':4,'May':5,'June':6,
//         'July':7,'August':8,'September':9,'October':10,'November':11,'December':12,
//       };

//       const monthData = FY_MONTH_LIST.map(m => ({
//         month_name:   m,
//         month_number: MONTH_NAME_TO_NUM[m],
//         total_amount: Math.round(achievedMap[m] || 0),
//         Expected:     Math.round(targetMap[m]   || 0),
//       }));

//       return monthData;

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// const AdminMonthWiseBudgetData = createSlice({
//   name: 'AdminMonthWiseBudgetData',
//   initialState,
//   reducers: {
//     clearMonthWiseBudgetData: (state) => { state.budgetdata = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminMonthWiseBudgetData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminMonthWiseBudgetData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.budgetdata = action.payload;
//         state.loading    = false;
//       })
//       .addCase(fetchAdminMonthWiseBudgetData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearMonthWiseBudgetData } = AdminMonthWiseBudgetData.actions;
// export default AdminMonthWiseBudgetData.reducer;


// src/features/SalesAdminDashboard/MonthWiseBudget/Slice/AdminMonthWiseBudgetSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

const FY_MONTH_LIST = [
  'April','May','June','July','August','September',
  'October','November','December','January','February','March',
];

const MONTH_NUM_TO_NAME: Record<number, string> = {
  1:'January',  2:'February',  3:'March',
  4:'April',    5:'May',       6:'June',
  7:'July',     8:'August',    9:'September',
  10:'October', 11:'November', 12:'December',
};

const MONTH_NAME_TO_NUM: Record<string, number> = {
  'January':1,  'February':2,  'March':3,
  'April':4,    'May':5,       'June':6,
  'July':7,     'August':8,    'September':9,
  'October':10, 'November':11, 'December':12,
};

interface MonthWiseBudgetDataState {
  budgetdata: any[];
  loading:    boolean;
  error:      string | null;
}

const ensureArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const initialState: MonthWiseBudgetDataState = {
  budgetdata: [],
  loading:    false,
  error:      null,
};

export const fetchAdminMonthWiseBudgetData = createAsyncThunk(
  'budgetdata/fetchAdminMonthWiseBudgetData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;

      // ── Read globalFilter ──────────────────────────────────
      const { selectedYear, selectedMonth, filterType, selectedPic } = state.globalFilter;
      const selectedPicId =
        selectedPic && selectedPic !== 'all'
          ? Number.parseInt(selectedPic, 10)
          : null;

      // ── FY date range ──────────────────────────────────────
      const fyStart = new Date(selectedYear,     3, 1);  // April 1
      const fyEnd   = new Date(selectedYear + 1, 2, 31); // March 31

      // ── Build query params for rank A API ──────────────────
      const rankAParams = new URLSearchParams();
      rankAParams.set('year', String(selectedYear));
      if (filterType === 'monthly') {
        rankAParams.set('month', selectedMonth);
      }
      if (selectedPicId !== null && Number.isFinite(selectedPicId)) {
        rankAParams.set('pic', String(selectedPicId));
      }

      // ── Fetch both APIs in parallel ────────────────────────
      const budgetsParams = new URLSearchParams();
      if (selectedPicId !== null && Number.isFinite(selectedPicId)) {
        budgetsParams.set('pic', String(selectedPicId));
      }

      const [rankARes, budgetsRes] = await Promise.all([
        axiosInstance.get(
          `/admin_monthly-total-amount/?${rankAParams.toString()}`
        ),
        axiosInstance.get(`/budgets/${budgetsParams.toString() ? `?${budgetsParams.toString()}` : ''}`),
      ]);

      const rankAData: any[] = ensureArray(rankARes.data);
      const budgetsData: any[] = ensureArray(budgetsRes.data);

      // ── Build achieved map ─────────────────────────────────
      const achievedMap: Record<string, number> = {};
      FY_MONTH_LIST.forEach(m => { achievedMap[m] = 0; });

      if (filterType === 'monthly') {
        // Monthly mode: only accumulate the selected month
        rankAData.forEach((item: any) => {
          const mName = MONTH_NUM_TO_NAME[item.month_number];
          if (mName === selectedMonth && achievedMap[mName] !== undefined) {
            achievedMap[mName] += item.total_amount || 0;
          }
        });
      } else {
        // Yearly mode: accumulate all months
        rankAData.forEach((item: any) => {
          const mName = MONTH_NUM_TO_NAME[item.month_number];
          if (mName && achievedMap[mName] !== undefined) {
            achievedMap[mName] += item.total_amount || 0;
          }
        });
      }

      // ── Build target map ───────────────────────────────────
      const targetMap: Record<string, number> = {};
      FY_MONTH_LIST.forEach(m => { targetMap[m] = 0; });

      budgetsData.forEach((b: any) => {
        // ✅ Only include budgets from selected FY (strict)
        const rawFiscalYear = b?.fiscal_year;
        const fiscalYearNum = Number.parseInt(String(rawFiscalYear ?? ''), 10);
        const hasValidFiscalYear = Number.isFinite(fiscalYearNum);

        if (hasValidFiscalYear) {
          if (fiscalYearNum !== selectedYear) return;
        } else {
          // Fallback to created_at only when fiscal_year is unavailable.
          // If created_at is missing/invalid, exclude the row instead of leaking data across FYs.
          const createdAt = b?.created_at ? new Date(b.created_at) : null;
          if (!createdAt || Number.isNaN(createdAt.getTime())) return;
          if (createdAt < fyStart || createdAt > fyEnd) return;
        }

        const entries: any[] = b.period_entries || [];
        const entryMatchesPic = (pe: any) => (
          selectedPicId === null ||
          !Number.isFinite(selectedPicId) ||
          Number(pe?.user_id) === selectedPicId
        );

        if (entries.length > 0) {
          entries.forEach((pe: any) => {
            if (!entryMatchesPic(pe)) return;
            if (pe.month && targetMap[pe.month] !== undefined) {
              targetMap[pe.month] += parseFloat(pe.allocated || 0);
            }
          });
        } else if (Array.isArray(b?.categories)) {
          b.categories.forEach((cat: any) => {
            const periodEntries = Array.isArray(cat?.period_entries) ? cat.period_entries : [];
            periodEntries.forEach((pe: any) => {
              if (!entryMatchesPic(pe)) return;
              if (pe.month && targetMap[pe.month] !== undefined) {
                targetMap[pe.month] += parseFloat(pe.allocated || 0);
              }
            });
          });
        }
      });

      // ── Build final month data ─────────────────────────────
      // Monthly mode: return only selected month
      // Yearly mode:  return all 12 FY months
      const monthsToShow = filterType === 'monthly'
        ? [selectedMonth]
        : FY_MONTH_LIST;

      const monthData = monthsToShow.map(m => ({
        month_name:   m,
        month_number: MONTH_NAME_TO_NUM[m],
        total_amount: Math.round(achievedMap[m] || 0),
        Expected:     Math.round(targetMap[m]   || 0),
      }));

      return monthData;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch data'
      );
    }
  }
);

const AdminMonthWiseBudgetData = createSlice({
  name: 'AdminMonthWiseBudgetData',
  initialState,
  reducers: {
    clearMonthWiseBudgetData: (state) => { state.budgetdata = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminMonthWiseBudgetData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(
        fetchAdminMonthWiseBudgetData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.budgetdata = ensureArray(action.payload);
          state.loading    = false;
          state.error      = null;
        }
      )
      .addCase(
        fetchAdminMonthWiseBudgetData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading    = false;
          state.budgetdata = [];
          state.error      = action.payload as string;
        }
      );
  },
});

export const { clearMonthWiseBudgetData } = AdminMonthWiseBudgetData.actions;
export default AdminMonthWiseBudgetData.reducer;
