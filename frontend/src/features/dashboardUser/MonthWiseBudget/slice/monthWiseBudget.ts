// src/features/dataSlice.ts

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
// export const fetchMonthWiseBudgetData = createAsyncThunk(
//   'budgetdata/fetchMonthWiseBudgetData',
//   async (_, { rejectWithValue , getState}) => {
//     try {
//       const state = getState() as RootState;
//             const tokenData = state.userLoginAuth.user.tokens;
      
//             if (!tokenData.access) {
//               throw new Error('No access token available');
//             }
//       const response = await axios.get('http://localhost:8000/monthly-total-amount/', {
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });
//       // console.log('budget data ',response.data)
//       return response.data; // Assuming the data is in response.data
//     } catch (error: any) {
//       // Handle error and return a rejected value
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// // Data slice
// const MonthWiseBudgetData = createSlice({
//   name: 'budgetdata',
//   initialState,
//   reducers: {
//     // Action to clear the data
//     clearMonthWiseBudgetData: (state) => {
//       state.budgetdata = []; // Reset data to an empty array
//     },
//   },  // No synchronous actions are defined here
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMonthWiseBudgetData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMonthWiseBudgetData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.budgetdata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchMonthWiseBudgetData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearMonthWiseBudgetData } = MonthWiseBudgetData.actions;
// // Export the reducer to include it in the store
// export default MonthWiseBudgetData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface BudgetEntry {
//   month_number: number;
//   month_name: string;
//   total_amount: number;
// }

// interface MonthWiseBudgetDataState {
//   budgetdata: BudgetEntry[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: MonthWiseBudgetDataState = {
//   budgetdata: [],
//   loading: false,
//   error: null,
// };

// export const fetchMonthWiseBudgetData = createAsyncThunk(
//   'budgetdata/fetchMonthWiseBudgetData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }

//       const response = await axios.get('http://localhost:8000/monthly-total-amount/', {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });

//       const payload = response.data;

//       // ✅ Normalize API response to always return an array
//       if (Array.isArray(payload))          return payload;
//       if (Array.isArray(payload?.results)) return payload.results;
//       if (Array.isArray(payload?.data))    return payload.data;

//       return [];
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// const MonthWiseBudgetData = createSlice({
//   name: 'budgetdata',
//   initialState,
//   reducers: {
//     clearMonthWiseBudgetData: (state) => {
//       state.budgetdata = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMonthWiseBudgetData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchMonthWiseBudgetData.fulfilled,
//         (state, action: PayloadAction<BudgetEntry[]>) => {
//           state.budgetdata = action.payload; // ✅ Always an array now
//           state.loading = false;
//         }
//       )
//       .addCase(
//         fetchMonthWiseBudgetData.rejected,
//         (state, action: PayloadAction<any>) => {
//           state.loading = false;
//           state.error = action.payload as string;
//           state.budgetdata = []; // ✅ Stay an array on failure
//         }
//       );
//   },
// });

// export const { clearMonthWiseBudgetData } = MonthWiseBudgetData.actions;
// export default MonthWiseBudgetData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface BudgetEntry {
//   month_number: number;
//   month_name:   string;
//   total_amount: number;
// }

// interface MonthWiseBudgetDataState {
//   budgetdata: BudgetEntry[];
//   loading:    boolean;
//   error:      string | null;
// }

// const initialState: MonthWiseBudgetDataState = {
//   budgetdata: [],
//   loading:    false,
//   error:      null,
// };

// export const fetchMonthWiseBudgetData = createAsyncThunk(
//   'budgetdata/fetchMonthWiseBudgetData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       // ── Read globalFilter — only year (shows full FY) ───────
//       const { selectedYear } = state.globalFilter;

//       const response = await axios.get(
//         `/api/monthly-total-amount/?year=${selectedYear}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token.access}`,
//           },
//         }
//       );

//       const payload = response.data;
//       if (Array.isArray(payload))          return payload;
//       if (Array.isArray(payload?.results)) return payload.results;
//       if (Array.isArray(payload?.data))    return payload.data;
//       return [];

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// const MonthWiseBudgetData = createSlice({
//   name: 'budgetdata',
//   initialState,
//   reducers: {
//     clearMonthWiseBudgetData: (state) => { state.budgetdata = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMonthWiseBudgetData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchMonthWiseBudgetData.fulfilled, (state, action: PayloadAction<BudgetEntry[]>) => {
//         state.budgetdata = action.payload;
//         state.loading    = false;
//       })
//       .addCase(fetchMonthWiseBudgetData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading    = false;
//         state.error      = action.payload as string;
//         state.budgetdata = [];
//       });
//   },
// });

// export const { clearMonthWiseBudgetData } = MonthWiseBudgetData.actions;
// export default MonthWiseBudgetData.reducer;


// src/features/dashboardUser/MonthWiseBudget/slice/monthWiseBudget.ts
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

interface BudgetEntry {
  month_number: number;
  month_name:   string;
  total_amount: number;
  Expected:     number;
}

interface MonthWiseBudgetDataState {
  budgetdata: BudgetEntry[];
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

export const fetchMonthWiseBudgetData = createAsyncThunk(
  'budgetdata/fetchMonthWiseBudgetData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { selectedYear, selectedMonth, filterType } = state.globalFilter;

      // ── FY date range ──────────────────────────────────────
      const fyStart = new Date(selectedYear,     3, 1);
      const fyEnd   = new Date(selectedYear + 1, 2, 31);

      // ── Build rank A params ────────────────────────────────
      const rankAParams = new URLSearchParams();
      rankAParams.set('year', String(selectedYear));
      if (filterType === 'monthly') {
        rankAParams.set('month', selectedMonth);
      }

      // ✅ Fetch rank A data + budget data in parallel
      const [rankARes, budgetsRes] = await Promise.all([
        axiosInstance.get(
          `/monthly-total-amount/?${rankAParams.toString()}`
        ),
        axiosInstance.get('/budgets/'),
      ]);

      const rankAData: any[] = ensureArray(rankARes.data);
      const budgetsData: any[] = ensureArray(budgetsRes.data);

      // ── Build achieved map ─────────────────────────────────
      const achievedMap: Record<string, number> = {};
      FY_MONTH_LIST.forEach(m => { achievedMap[m] = 0; });

      rankAData.forEach((item: any) => {
        const mName = MONTH_NUM_TO_NAME[item.month_number];
        if (mName && achievedMap[mName] !== undefined) {
          achievedMap[mName] += item.total_amount || 0;
        }
      });

      // ── Build target map from budget entries ───────────────
      const targetMap: Record<string, number> = {};
      FY_MONTH_LIST.forEach(m => { targetMap[m] = 0; });

      budgetsData.forEach((b: any) => {
        // ✅ Only include budgets from selected FY
        const createdAt = b.created_at ? new Date(b.created_at) : null;
        if (createdAt && (createdAt < fyStart || createdAt > fyEnd)) return;

        const entries: any[] = Array.isArray(b?.period_entries) ? b.period_entries : [];

        if (entries.length > 0) {
          entries.forEach((pe: any) => {
            if (pe.month && targetMap[pe.month] !== undefined) {
              targetMap[pe.month] += parseFloat(pe.allocated || 0);
            }
          });
        } else if (Array.isArray(b?.categories)) {
          b.categories.forEach((cat: any) => {
            const periodEntries = Array.isArray(cat?.period_entries) ? cat.period_entries : [];
            periodEntries.forEach((pe: any) => {
              if (pe.month && targetMap[pe.month] !== undefined) {
                targetMap[pe.month] += parseFloat(pe.allocated || 0);
              }
            });
          });
        }
      });

      // ── Build final month data ─────────────────────────────
      const monthsToShow = filterType === 'monthly'
        ? [selectedMonth]
        : FY_MONTH_LIST;

      const monthData: BudgetEntry[] = monthsToShow.map(m => ({
        month_name:   m,
        month_number: MONTH_NAME_TO_NUM[m],
        total_amount: Math.round(achievedMap[m] || 0),
        // ✅ Real Expected from budget — not hardcoded
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

const MonthWiseBudgetData = createSlice({
  name: 'budgetdata',
  initialState,
  reducers: {
    clearMonthWiseBudgetData: (state) => { state.budgetdata = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthWiseBudgetData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(
        fetchMonthWiseBudgetData.fulfilled,
        (state, action: PayloadAction<BudgetEntry[]>) => {
          state.budgetdata = action.payload;
          state.loading    = false;
          state.error      = null;
        }
      )
      .addCase(
        fetchMonthWiseBudgetData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading    = false;
          state.error      = action.payload as string;
          state.budgetdata = [];
        }
      );
  },
});

export const { clearMonthWiseBudgetData } = MonthWiseBudgetData.actions;
export default MonthWiseBudgetData.reducer;
