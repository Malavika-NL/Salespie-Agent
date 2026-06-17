// // src/features/dataSlice.ts

// import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// // Define the data structure you're expecting
// interface PieChartDataState {
//   graphdata: any; // Change `any` to a specific type if you know the structure of the data
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: PieChartDataState = {
//   graphdata: [],
//   loading: false,
//   error: null,
// };

// // Thunk to fetch data from an API
// export const fetchAdminFunnelGraphData = createAsyncThunk(
//   'graphdata/fetchAdminFunnelGraphData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }

//       const response = await axios.get('/opportunities/stage-summary/', {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });
//       console.log('pie data ', response.data)
//       return response.data; // Assuming the data is in response.data
//     } catch (error: any) {
//       // Handle error and return a rejected value
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// // Data slice
// const FunnelAdminGraphData = createSlice({
//   name: 'FunnelAdminGraphData',
//   initialState,
//   reducers: {
//     // Action to clear the data
//     clearFunnelGraphData: (state) => {
//       state.graphdata = []; // Reset data to an empty array
//     },
//   },  // No synchronous actions are defined here
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminFunnelGraphData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminFunnelGraphData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.graphdata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAdminFunnelGraphData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearFunnelGraphData } = FunnelAdminGraphData.actions;
// // Export the reducer to include it in the store
// export default FunnelAdminGraphData.reducer;


// src/features/SalesAdminDashboard/FunnelGraph/slice/funnelgraph.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface FunnelGraphState {
//   graphdata: any;
//   loading:   boolean;
//   error:     string | null;
// }

// const initialState: FunnelGraphState = {
//   graphdata: [],
//   loading:   false,
//   error:     null,
// };

// export const fetchAdminFunnelGraphData = createAsyncThunk(
//   'graphdata/fetchAdminFunnelGraphData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       // ── Read globalFilter ──────────────────────────────────
//       const { selectedYear } = state.globalFilter;

//       const response = await axios.get(
//         `/api/opportunities/stage-summary/?year=${selectedYear}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token.access}`,
//           },
//         }
//       );

//       return response.data;

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// const FunnelAdminGraphData = createSlice({
//   name: 'FunnelAdminGraphData',
//   initialState,
//   reducers: {
//     clearFunnelGraphData: (state) => { state.graphdata = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminFunnelGraphData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminFunnelGraphData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.graphdata = action.payload;
//         state.loading   = false;
//       })
//       .addCase(fetchAdminFunnelGraphData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearFunnelGraphData } = FunnelAdminGraphData.actions;
// export default FunnelAdminGraphData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface FunnelGraphState {
//   graphdata: any;
//   loading:   boolean;
//   error:     string | null;
// }

// const initialState: FunnelGraphState = {
//   graphdata: [],
//   loading:   false,
//   error:     null,
// };

// export const fetchAdminFunnelGraphData = createAsyncThunk(
//   'graphdata/fetchAdminFunnelGraphData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       const { selectedYear, selectedMonth, filterType } = state.globalFilter;

//       const query = new URLSearchParams();
//       query.set('year', String(selectedYear));
//       if (filterType === 'monthly') {
//         query.set('month', selectedMonth);
//       }

//       const response = await axios.get(
//         `/api/opportunities/stage-summary/?${query.toString()}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token.access}`,
//           },
//         }
//       );
//       return response.data;

//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// const FunnelAdminGraphData = createSlice({
//   name: 'FunnelAdminGraphData',
//   initialState,
//   reducers: {
//     clearFunnelGraphData: (state) => { state.graphdata = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminFunnelGraphData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminFunnelGraphData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.graphdata = action.payload;
//         state.loading   = false;
//       })
//       .addCase(fetchAdminFunnelGraphData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearFunnelGraphData } = FunnelAdminGraphData.actions;
// export default FunnelAdminGraphData.reducer;


// src/features/SalesAdminDashboard/FunnelGraph/slice/funnelgraph.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

interface FunnelGraphState {
  graphdata: any[];
  loading:   boolean;
  error:     string | null;
}

const ensureArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const initialState: FunnelGraphState = {
  graphdata: [],
  loading:   false,
  error:     null,
};

export const fetchAdminFunnelGraphData = createAsyncThunk(
  'graphdata/fetchAdminFunnelGraphData',
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

      const response = await axiosInstance.get(
        `/opportunities/stage-summary/?${query.toString()}`
      );

      return ensureArray(response.data);

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch data'
      );
    }
  }
);

const FunnelAdminGraphData = createSlice({
  name: 'FunnelAdminGraphData',
  initialState,
  reducers: {
    clearFunnelGraphData: (state) => { state.graphdata = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminFunnelGraphData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(
        fetchAdminFunnelGraphData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.graphdata = ensureArray(action.payload);
          state.loading   = false;
          state.error     = null;
        }
      )
      .addCase(
        fetchAdminFunnelGraphData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading   = false;
          state.graphdata = [];
          state.error     = action.payload as string;
        }
      );
  },
});

export const { clearFunnelGraphData } = FunnelAdminGraphData.actions;
export default FunnelAdminGraphData.reducer;
