// // src/features/dataSlice.ts

// import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// // Define the data structure you're expecting
// interface ChartDataState {
//   usergraphdata: any; // Change `any` to a specific type if you know the structure of the data
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: ChartDataState = {
//   usergraphdata: [],
//   loading: false,
//   error: null,
// };

// // Thunk to fetch data from an API
// export const fetchFunnelGraphData = createAsyncThunk(
//   'funneldata/fetchFunnelGraphData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }

//       const response = await axios.get('http://localhost:8000/user/opportunities/stage-summary/', {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });
//       console.log('funnel data ', response.data)
//       return response.data; // Assuming the data is in response.data
//     } catch (error: any) {
//       // Handle error and return a rejected value
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// // Data slice
// const FunnelGraphData = createSlice({
//   name: 'FunnelUserGraphData',
//   initialState,
//   reducers: {
//     // Action to clear the data
//     clearFunnelGraphData: (state) => {
//       state.usergraphdata = []; // Reset data to an empty array
//     },
//   },  // No synchronous actions are defined here
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFunnelGraphData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFunnelGraphData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.usergraphdata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchFunnelGraphData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearFunnelGraphData } = FunnelGraphData.actions;
// // Export the reducer to include it in the store
// export default FunnelGraphData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface FunnelEntry {
//   ranks: string;
//   total_stage_amount: number;
// }

// interface ChartDataState {
//   usergraphdata: FunnelEntry[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ChartDataState = {
//   usergraphdata: [],   // ✅ always an array
//   loading: false,
//   error: null,
// };

// export const fetchFunnelGraphData = createAsyncThunk(
//   'funneldata/fetchFunnelGraphData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }

//       const response = await axios.get(
//         'http://localhost:8000/user/opportunities/stage-summary/',
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${tokenData.access}`,
//           },
//         }
//       );

//       console.log('funnel data:', response.data);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// // Helper to normalise any API response shape → always returns FunnelEntry[]
// const normalisePayload = (payload: any): FunnelEntry[] => {
//   if (Array.isArray(payload)) {
//     return payload;                          // already an array
//   }
//   if (Array.isArray(payload?.data)) {
//     return payload.data;                     // { data: [...] }
//   }
//   if (Array.isArray(payload?.results)) {
//     return payload.results;                  // { results: [...] } (DRF pagination)
//   }
//   return [];                                 // unknown shape — safe fallback
// };

// const FunnelGraphData = createSlice({
//   name: 'FunnelUserGraphData',
//   initialState,
//   reducers: {
//     clearFunnelGraphData: (state) => {
//       state.usergraphdata = [];
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFunnelGraphData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFunnelGraphData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.usergraphdata = normalisePayload(action.payload);  // ✅ always array
//       })
//       .addCase(fetchFunnelGraphData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.usergraphdata = [];   // ✅ reset to array on failure, never undefined
//       });
//   },
// });

// export const { clearFunnelGraphData } = FunnelGraphData.actions;
// export default FunnelGraphData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface FunnelEntry {
//   ranks:              string;
//   total_stage_amount: number;
// }

// interface ChartDataState {
//   usergraphdata: FunnelEntry[];
//   loading:       boolean;
//   error:         string | null;
// }

// const initialState: ChartDataState = {
//   usergraphdata: [],
//   loading:       false,
//   error:         null,
// };

// const normalisePayload = (payload: any): FunnelEntry[] => {
//   if (Array.isArray(payload))          return payload;
//   if (Array.isArray(payload?.data))    return payload.data;
//   if (Array.isArray(payload?.results)) return payload.results;
//   return [];
// };

// export const fetchFunnelGraphData = createAsyncThunk(
//   'funneldata/fetchFunnelGraphData',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       // ── Read globalFilter ──────────────────────────────────
//       const { selectedYear, selectedMonth, filterType } = state.globalFilter;

//       const query = new URLSearchParams();
//       query.set('year', String(selectedYear));
//       if (filterType === 'monthly') {
//         query.set('month', selectedMonth);
//       }

//       const response = await axios.get(
//         `/api/user/opportunities/stage-summary/?${query.toString()}`,
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

// const FunnelGraphData = createSlice({
//   name: 'FunnelUserGraphData',
//   initialState,
//   reducers: {
//     clearFunnelGraphData: (state) => {
//       state.usergraphdata = [];
//       state.loading       = false;
//       state.error         = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFunnelGraphData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchFunnelGraphData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading       = false;
//         state.usergraphdata = normalisePayload(action.payload);
//       })
//       .addCase(fetchFunnelGraphData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading       = false;
//         state.error         = action.payload as string;
//         state.usergraphdata = [];
//       });
//   },
// });

// export const { clearFunnelGraphData } = FunnelGraphData.actions;
// export default FunnelGraphData.reducer;


// src/features/dashboardUser/FunnelGraph/slice/funnelgraph.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

interface FunnelEntry {
  ranks:              string;
  total_stage_amount: number;
}

interface ChartDataState {
  usergraphdata: FunnelEntry[];
  loading:       boolean;
  error:         string | null;
}

const initialState: ChartDataState = {
  usergraphdata: [],
  loading:       false,
  error:         null,
};

const normalisePayload = (payload: any): FunnelEntry[] => {
  if (Array.isArray(payload))          return payload;
  if (Array.isArray(payload?.data))    return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

export const fetchFunnelGraphData = createAsyncThunk(
  'funneldata/fetchFunnelGraphData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { selectedYear, selectedMonth, filterType } = state.globalFilter;

      const query = new URLSearchParams();
      query.set('year', String(selectedYear));
      if (filterType === 'monthly') {
        query.set('month', selectedMonth);
      }

      // ✅ Use axiosInstance
      const response = await axiosInstance.get(
        `/user/opportunities/stage-summary/?${query.toString()}`
      );

      return response.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch data'
      );
    }
  }
);

const FunnelGraphData = createSlice({
  name: 'FunnelUserGraphData',
  initialState,
  reducers: {
    clearFunnelGraphData: (state) => {
      state.usergraphdata = [];
      state.loading       = false;
      state.error         = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunnelGraphData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(
        fetchFunnelGraphData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading       = false;
          state.usergraphdata = normalisePayload(action.payload);
          state.error         = null;
        }
      )
      .addCase(
        fetchFunnelGraphData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading       = false;
          state.error         = action.payload as string;
          state.usergraphdata = [];
        }
      );
  },
});

export const { clearFunnelGraphData } = FunnelGraphData.actions;
export default FunnelGraphData.reducer;