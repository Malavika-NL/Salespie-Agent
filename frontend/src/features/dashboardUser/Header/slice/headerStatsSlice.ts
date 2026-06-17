// // headerStatsSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchHeaderStats = createAsyncThunk(
//   'headerStats/fetch',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get('/header-stats/');
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// interface HeaderStatsState {
//   data: {
//     order:      { new_orders: number; new_funnel: number; new_customers: number };
//     funnel:     { total_funnel: number; total_a_funnel: number; repeat_funnel: number };
//     projection: { projection_pct: number; conversion_ratio: number; repeat_order: number };
//     sales:      { rank_a_total: number; to_be_build: number; repeat_sales: number };
//   } | null;
//   loading: boolean;
//   error: any;
// }

// const initialState: HeaderStatsState = {
//   data: null,
//   loading: false,
//   error: null,
// };

// const headerStatsSlice = createSlice({
//   name: 'headerStats',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchHeaderStats.pending,   (s) => { s.loading = true;  s.error = null; })
//       .addCase(fetchHeaderStats.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
//       .addCase(fetchHeaderStats.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
//   },
// });

// export default headerStatsSlice.reducer;


// headerStatsSlice.ts
// import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface HeaderStatsState {
//   data: {
//     order: {
//       new_orders:    number;
//       new_funnel:    number;
//       new_customers: number;
//     };
//     funnel: {
//       total_funnel:   number;
//       total_a_funnel: number;
//       repeat_funnel:  number;
//     };
//     projection: {
//       projection_pct:   number;
//       conversion_ratio: number;
//       repeat_order:     number;
//     };
//     sales: {
//       rank_a_total: number;
//       to_be_build:  number;
//       repeat_sales: number;
//     };
//   } | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: HeaderStatsState = {
//   data:    null,
//   loading: false,
//   error:   null,
// };

// export const fetchHeaderStats = createAsyncThunk(
//   'fetchHeaderStats/fetch',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       // ── Get token from Redux store (same pattern as other slices) ──
//       const state     = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }

//       const response = await axios.get('http://localhost:8000/header-stats/', {
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });

//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch header stats');
//     }
//   }
// );

// const headerStatsSlice = createSlice({
//   name: 'fetchHeaderStats',
//   initialState,
//   reducers: {
//     clearHeaderStats: (state) => {
//       state.data = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchHeaderStats.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchHeaderStats.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.data    = action.payload;
//       })
//       .addCase(fetchHeaderStats.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearHeaderStats } = headerStatsSlice.actions;
// export default headerStatsSlice.reducer;


import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../../app/axiosInstance'; // ✅ use axiosInstance
import type { RootState } from '../../../../app/store';

interface OrderStats {
  new_orders: number;
  new_funnel: number;
  new_customers: number;
}

interface FunnelStats {
  total_funnel: number;
  total_a_funnel: number;
  repeat_funnel: number;
  rank_a: number;
  rank_b: number;
  rank_c: number;
  rank_d: number;
  rank_abcd_total: number;
}

interface ProjectionStats {
  projection_pct: number;
  conversion_ratio: number;
  repeat_order: number;
}

interface SalesStats {
  rank_a_total: number;
  to_be_build: number;
  repeat_sales: number;
}

interface HeaderStatsData {
  order: OrderStats;
  funnel: FunnelStats;
  projection: ProjectionStats;
  sales: SalesStats;
}

interface HeaderStatsState {
  data: HeaderStatsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: HeaderStatsState = {
  data: null,
  loading: false,
  error: null,
};

// ✅ Using axiosInstance - token handled automatically
export const fetchHeaderStats = createAsyncThunk(
  'fetchHeaderStats/fetch',
  async (_, { rejectWithValue, getState }) => {
    try {
      // ── Read globalFilter from store ──────────────────────
      const state        = getState() as RootState;
      const { selectedYear, selectedMonth, filterType, selectedPic } =
        state.globalFilter;
      const userRole = state.userLoginAuth?.user?.role;

      // Build query params
      const query = new URLSearchParams();
      query.set('year', String(selectedYear));
      if (filterType === 'monthly') {
        query.set('month', selectedMonth);
      }
      if (userRole === 'admin' && selectedPic && selectedPic !== 'all') {
        query.set('pic', selectedPic);
      }

      const url = `/header-stats/?${query.toString()}`;
      const response = await axiosInstance.get(url);
      return response.data;

    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message || 'Failed to fetch header stats');
    }
  }
);

const headerStatsSlice = createSlice({
  name: 'fetchHeaderStats',
  initialState,
  reducers: {
    clearHeaderStats: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeaderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHeaderStats.fulfilled,
        (state, action: PayloadAction<HeaderStatsData>) => {
          state.loading = false;
          state.error = null;
          state.data = action.payload;
          console.log('Header stats saved to Redux:', action.payload);
        }
      )
      .addCase(
        fetchHeaderStats.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = null;
          state.error = action.payload?.toString() || 'Failed to fetch header stats';
        }
      );
  },
});

export const { clearHeaderStats } = headerStatsSlice.actions;
export default headerStatsSlice.reducer;
