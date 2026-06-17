// // src/features/dataSlice.ts

// import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// // Define the data structure you're expecting
// interface SpeedometertUserDataState {
//     TotalAchived: any; // Change `any` to a specific type if you know the structure of the data
//     loading: boolean;
//     error: string | null;
// }

// // Initial state
// const initialState: SpeedometertUserDataState = {
//     TotalAchived: [],
//     loading: false,
//     error: null,
// };

// // Thunk to fetch data from an API
// export const fetchAdminSpeedometerData = createAsyncThunk(
//     'Speedometerdata/fetchAdminSpeedometerData',
//     async (_, { rejectWithValue, getState }) => {
//         try {

//             const state = getState() as RootState;
//             const tokenData = state.userLoginAuth.user.tokens;

//             if (!tokenData.access) {
//                 throw new Error('No access token available');
//             }
            
//             const response = await axios.get('/rank-a-sum/', {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${tokenData.access}`,
//                 },
//             });
//             console.log('speeeeeeeeeeedomter ', response)
//             return response.data; // Assuming the data is in response.data
//         } catch (error: any) {
//             // Handle error and return a rejected value
//             return rejectWithValue(error.response?.data || 'Failed to fetch data');
//         }
//     }
// );

// // Data slice
// const SpeedometertAdminData = createSlice({
//     name: 'SpeedometertAdminData',
//     initialState,
//     reducers: {
//         // Action to clear the data
//         clearEmployeeListData: (state) => {
//             state.TotalAchived = []; // Reset data to an empty array
//         },
//     },  // No synchronous actions are defined here
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchAdminSpeedometerData.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchAdminSpeedometerData.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.TotalAchived = action.payload;
//                 state.loading = false;
//             })
//             .addCase(fetchAdminSpeedometerData.rejected, (state, action: PayloadAction<any>) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });

// export const { clearEmployeeListData } = SpeedometertAdminData.actions;
// // Export the reducer to include it in the store
// export default SpeedometertAdminData.reducer;

// src/features/AdminDashboard/AdminSpeedometer/Slice/AdminSpeedometer.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface SpeedometerState {
//   data: {
//     total_achieved:       number;
//     total_annual_target:  number;
//     fy_deals_closed:      number;
//   } | null;
//   loading: boolean;
//   error:   string | null;
// }

// const initialState: SpeedometerState = {
//   data:    null,
//   loading: false,
//   error:   null,
// };

// export const fetchAdminSpeedometerData = createAsyncThunk(
//   'adminSpeedometer/fetchData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state     = getState() as RootState;
//       const token     = state.userLoginAuth?.user?.tokens?.access;
//       if (!token) throw new Error('No access token');

//       const headers = {
//         'Content-Type': 'application/json',
//         Authorization:  `Bearer ${token}`,
//       };

//       // Fetch both in parallel:
//       // 1. All users Rank A total → /api/admin-budget-summary/
//       //    (already has fy_achieved + total_revenue_target)
//       const res = await axios.get('/api/admin-budget-summary/', { headers });

//       return {
//         total_achieved:      res.data.fy_achieved        || 0,
//         total_annual_target: res.data.total_revenue_target || 0,
//         fy_deals_closed:     res.data.fy_deals_closed    || 0,
//       };

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch');
//     }
//   }
// );

// const adminSpeedometerSlice = createSlice({
//   name: 'adminSpeedometer',
//   initialState,
//   reducers: {
//     clearSpeedometerData: (state) => { state.data = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminSpeedometerData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminSpeedometerData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data    = action.payload;
//       })
//       .addCase(fetchAdminSpeedometerData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearSpeedometerData } = adminSpeedometerSlice.actions;
// export default adminSpeedometerSlice.reducer;


// src/features/SalesAdminDashboard/AdminSpeedometer/Slice/AdminSpeedometer.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface SpeedometerState {
//   data: {
//     total_achieved:      number;
//     total_annual_target: number;
//     fy_deals_closed:     number;
//   } | null;
//   loading: boolean;
//   error:   string | null;
// }

// const initialState: SpeedometerState = {
//   data:    null,
//   loading: false,
//   error:   null,
// };

// export const fetchAdminSpeedometerData = createAsyncThunk(
//   'adminSpeedometer/fetchData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth?.user?.tokens?.access;
//       if (!token) throw new Error('No access token');

//       // ── Read globalFilter ──────────────────────────────────
//       const { selectedYear, selectedMonth, filterType } =
//         state.globalFilter;

//       const query = new URLSearchParams();
//       query.set('year', String(selectedYear));
//       if (filterType === 'monthly') {
//         query.set('month', selectedMonth);
//       }

//       const res = await axios.get(
//         `/api/admin-budget-summary/?${query.toString()}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       return {
//         total_achieved:      res.data.fy_achieved          || 0,
//         total_annual_target: res.data.total_revenue_target  || 0,
//         fy_deals_closed:     res.data.fy_deals_closed       || 0,
//       };

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed');
//     }
//   }
// );

// const adminSpeedometerSlice = createSlice({
//   name: 'adminSpeedometer',
//   initialState,
//   reducers: {
//     clearSpeedometerData: (state) => { state.data = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminSpeedometerData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminSpeedometerData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data    = action.payload;
//       })
//       .addCase(fetchAdminSpeedometerData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearSpeedometerData } = adminSpeedometerSlice.actions;
// export default adminSpeedometerSlice.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface SpeedometerState {
//   data: {
//     total_achieved:      number;
//     total_annual_target: number;
//     fy_deals_closed:     number;
//   } | null;
//   loading: boolean;
//   error:   string | null;
// }

// const initialState: SpeedometerState = {
//   data:    null,
//   loading: false,
//   error:   null,
// };

// export const fetchAdminSpeedometerData = createAsyncThunk(
//   'adminSpeedometer/fetchData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth?.user?.tokens?.access;
//       if (!token) throw new Error('No access token');

//       const { selectedYear, selectedMonth, filterType } = state.globalFilter;

//       const query = new URLSearchParams();
//       query.set('year', String(selectedYear));
//       if (filterType === 'monthly') {
//         query.set('month', selectedMonth);
//       }

//       const res = await axios.get(
//         `/api/admin-budget-summary/?${query.toString()}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization:  `Bearer ${token}`,
//           },
//         }
//       );

//       const isMonthly = filterType === 'monthly';

//       return {
//         // When monthly: show month achieved vs month target
//         // When yearly:  show FY achieved vs FY revenue target
//         total_achieved:      isMonthly
//           ? (res.data.month_achieved         || 0)
//           : (res.data.fy_achieved            || 0),
//         total_annual_target: isMonthly
//           ? (res.data.month_target           || 0)
//           : (res.data.total_revenue_target   || 0),
//         fy_deals_closed:     isMonthly
//           ? (res.data.deals_closed_this_month || 0)
//           : (res.data.fy_deals_closed         || 0),
//       };

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed');
//     }
//   }
// );

// const adminSpeedometerSlice = createSlice({
//   name: 'adminSpeedometer',
//   initialState,
//   reducers: {
//     clearSpeedometerData: (state) => { state.data = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminSpeedometerData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminSpeedometerData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data    = action.payload;
//       })
//       .addCase(fetchAdminSpeedometerData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearSpeedometerData } = adminSpeedometerSlice.actions;
// export default adminSpeedometerSlice.reducer;


// src/features/SalesAdminDashboard/AdminSpeedometer/Slice/AdminSpeedometer.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

interface SpeedometerState {
  data: {
    total_achieved:      number;
    total_annual_target: number;
    fy_deals_closed:     number;
  } | null;
  loading: boolean;
  error:   string | null;
}

const initialState: SpeedometerState = {
  data:    null,
  loading: false,
  error:   null,
};

export const fetchAdminSpeedometerData = createAsyncThunk(
  'adminSpeedometer/fetchData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { selectedYear, selectedMonth, filterType, selectedPic } = state.globalFilter;

      const query = new URLSearchParams();
      query.set('year', String(selectedYear));
      if (filterType === 'monthly') {
        query.set('month', selectedMonth);
      }
      if (selectedPic && selectedPic !== 'all') {
        query.set('pic', selectedPic);
      }

      const res = await axiosInstance.get(
        `/admin-budget-summary/?${query.toString()}`
      );

      const d         = res.data;
      const isMonthly = filterType === 'monthly';

      return {
        total_achieved: isMonthly
          ? (d.month_achieved || 0)
          : (d.fy_achieved    || 0),

        // ✅ Fixed: use fy_total_target not total_revenue_target
        total_annual_target: isMonthly
          ? (d.month_target    || 0)
          : (d.fy_total_target || 0),

        fy_deals_closed: isMonthly
          ? (d.deals_closed_this_month || 0)
          : (d.fy_deals_closed         || 0),
      };

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed'
      );
    }
  }
);

const adminSpeedometerSlice = createSlice({
  name: 'adminSpeedometer',
  initialState,
  reducers: {
    clearSpeedometerData: (state) => { state.data = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSpeedometerData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchAdminSpeedometerData.fulfilled, (state, action) => {
        state.loading = false;
        state.data    = action.payload;
        state.error   = null;
      })
      .addCase(
        fetchAdminSpeedometerData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error   = action.payload as string;
        }
      );
  },
});

export const { clearSpeedometerData } = adminSpeedometerSlice.actions;
export default adminSpeedometerSlice.reducer;
