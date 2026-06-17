// src/features/dataSlice.ts

// import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// // Define the data structure you're expecting
// interface  UserPieChartDataState {
//   userpiedata: any; // Change `any` to a specific type if you know the structure of the data
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: UserPieChartDataState = {
//   userpiedata: [],
//   loading: false,
//   error: null,
// };

// // Thunk to fetch data from an API
// export const fetchUserPieChartData = createAsyncThunk(
//   'piedata/fetchUserPieChartData',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//                   const tokenData = state.userLoginAuth.user.tokens;
      
//                   if (!tokenData.access) {
//                       throw new Error('No access token available');
//                   }
      
                  
//       const response = await axios.get('http://localhost:8000/user/opportunities/vertical-summary/', {
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${tokenData.access}`,
//         },
//     });
//       // console.log('pie data ',response.data)
//       return response.data; // Assuming the data is in response.data
//     } catch (error: any) {
//       // Handle error and return a rejected value
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// // Data slice
// const UserPieChartData = createSlice({
//   name: 'UserPieChartData',
//   initialState,
//   reducers: {
//     // Action to clear the data
//     clearPieChartDataData: (state) => {
//       state.userpiedata = []; // Reset data to an empty array
//     },
//   },  // No synchronous actions are defined here
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserPieChartData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserPieChartData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.userpiedata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchUserPieChartData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearPieChartDataData } = UserPieChartData.actions;
// // Export the reducer to include it in the store
// export default UserPieChartData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface PieChartItem {
//   vertical: string;
//   total_vertical_amount: number;
// }

// interface UserPieChartDataState {
//   userpiedata: PieChartItem[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: UserPieChartDataState = {
//   userpiedata: [],
//   loading: false,
//   error: null,
// };

// export const fetchUserPieChartData = createAsyncThunk(
//   'piedata/fetchUserPieChartData',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }

//       const response = await axios.get(
//         'http://localhost:8000/user/opportunities/vertical-summary/',
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${tokenData.access}`,
//           },
//         }
//       );

//       const payload = response.data;

//       // Normalize API response to always return an array
//       if (Array.isArray(payload)) return payload;
//       if (Array.isArray(payload?.results)) return payload.results;
//       if (Array.isArray(payload?.data)) return payload.data;

//       return [];
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// const UserPieChartData = createSlice({
//   name: 'UserPieChartData',
//   initialState,
//   reducers: {
//     clearPieChartDataData: (state) => {
//       state.userpiedata = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserPieChartData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchUserPieChartData.fulfilled,
//         (state, action: PayloadAction<PieChartItem[]>) => {
//           state.userpiedata = action.payload;
//           state.loading = false;
//         }
//       )
//       .addCase(
//         fetchUserPieChartData.rejected,
//         (state, action: PayloadAction<any>) => {
//           state.loading = false;
//           state.error = action.payload as string;
//           state.userpiedata = []; // ensure it stays an array on error
//         }
//       );
//   },
// });

// export const { clearPieChartDataData } = UserPieChartData.actions;
// export default UserPieChartData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface PieChartItem {
//   vertical:              string;
//   total_vertical_amount: number;
// }

// interface UserPieChartDataState {
//   userpiedata: PieChartItem[];
//   loading:     boolean;
//   error:       string | null;
// }

// const initialState: UserPieChartDataState = {
//   userpiedata: [],
//   loading:     false,
//   error:       null,
// };

// export const fetchUserPieChartData = createAsyncThunk(
//   'piedata/fetchUserPieChartData',
//   async (_, { getState, rejectWithValue }) => {
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
//         `/api/user/opportunities/vertical-summary/?${query.toString()}`,
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

// const UserPieChartData = createSlice({
//   name: 'UserPieChartData',
//   initialState,
//   reducers: {
//     clearPieChartDataData: (state) => { state.userpiedata = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserPieChartData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchUserPieChartData.fulfilled, (state, action: PayloadAction<PieChartItem[]>) => {
//         state.userpiedata = action.payload;
//         state.loading     = false;
//       })
//       .addCase(fetchUserPieChartData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading     = false;
//         state.error       = action.payload as string;
//         state.userpiedata = [];
//       });
//   },
// });

// export const { clearPieChartDataData } = UserPieChartData.actions;
// export default UserPieChartData.reducer;


// src/features/dashboardUser/PieChart/slice/piechart.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

interface PieChartItem {
  vertical:              string;
  total_vertical_amount: number;
}

interface UserPieChartDataState {
  userpiedata: PieChartItem[];
  loading:     boolean;
  error:       string | null;
}

const initialState: UserPieChartDataState = {
  userpiedata: [],
  loading:     false,
  error:       null,
};

export const fetchUserPieChartData = createAsyncThunk(
  'piedata/fetchUserPieChartData',
  async (_, { getState, rejectWithValue }) => {
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
        `/user/opportunities/vertical-summary/?${query.toString()}`
      );

      const payload = response.data;
      if (Array.isArray(payload))          return payload;
      if (Array.isArray(payload?.results)) return payload.results;
      if (Array.isArray(payload?.data))    return payload.data;
      return [];

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch data'
      );
    }
  }
);

const UserPieChartData = createSlice({
  name: 'UserPieChartData',
  initialState,
  reducers: {
    clearPieChartDataData: (state) => { state.userpiedata = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPieChartData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(
        fetchUserPieChartData.fulfilled,
        (state, action: PayloadAction<PieChartItem[]>) => {
          state.userpiedata = action.payload;
          state.loading     = false;
          state.error       = null;
        }
      )
      .addCase(
        fetchUserPieChartData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading     = false;
          state.error       = action.payload as string;
          state.userpiedata = [];
        }
      );
  },
});

export const { clearPieChartDataData } = UserPieChartData.actions;
export default UserPieChartData.reducer;