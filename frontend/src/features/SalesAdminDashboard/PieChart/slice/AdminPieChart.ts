// // src/features/dataSlice.ts

// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Define the data structure you're expecting
// interface  PieChartDataState {
//   piedata: any; // Change `any` to a specific type if you know the structure of the data
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: PieChartDataState = {
//   piedata: [],
//   loading: false,
//   error: null,
// };

// // Thunk to fetch data from an API
// export const fetchAdminPieChartData = createAsyncThunk(
//   'piedata/fetchAdminPieChartData',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('http://localhost:8000/opportunities/vertical-summary/');
//       console.log('pie data ',response.data)
//       return response.data; // Assuming the data is in response.data
//     } catch (error: any) {
//       // Handle error and return a rejected value
//       return rejectWithValue(error.response?.data || 'Failed to fetch data');
//     }
//   }
// );

// // Data slice
// const AdminPieChartData = createSlice({
//   name: 'piedata',
//   initialState,
//   reducers: {
//     // Action to clear the data
//     clearPieChartDataData: (state) => {
//       state.piedata = []; // Reset data to an empty array
//     },
//   },  // No synchronous actions are defined here
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminPieChartData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminPieChartData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.piedata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAdminPieChartData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearPieChartDataData } = AdminPieChartData.actions;
// // Export the reducer to include it in the store
// export default AdminPieChartData.reducer;



// src/features/dataSlice.ts

// import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// // Define the data structure you're expecting
// interface PieChartDataState {
//   userpiedata: any; // Change `any` to a specific type if you know the structure of the data
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: PieChartDataState = {
//   userpiedata: [],
//   loading: false,
//   error: null,
// };

// // Thunk to fetch data from an API
// export const fetchAdminPieChartData = createAsyncThunk(
//   'piedata/fetchAdminPieChartData',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;

//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }


//       const response = await axios.get('http://localhost:8000/opportunities/vertical-summary/', {
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
// const AdminPieChartData = createSlice({
//   name: 'AdminPieChartData',
//   initialState,
//   reducers: {
//     // Action to clear the data
//     clearPieChartDataData: (state) => {
//       state.userpiedata = []; // Reset data to an empty array
//     },
//   },  // No synchronous actions are defined here
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminPieChartData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminPieChartData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.userpiedata = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchAdminPieChartData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearPieChartDataData } = AdminPieChartData.actions;
// // Export the reducer to include it in the store
// export default AdminPieChartData.reducer;


// src/features/SalesAdminDashboard/PieChart/slice/AdminPieChart.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface PieChartDataState {
//   userpiedata: any;
//   loading:     boolean;
//   error:       string | null;
// }

// const initialState: PieChartDataState = {
//   userpiedata: [],
//   loading:     false,
//   error:       null,
// };

// export const fetchAdminPieChartData = createAsyncThunk(
//   'piedata/fetchAdminPieChartData',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       // ── Read globalFilter ──────────────────────────────────
//       const { selectedYear } = state.globalFilter;

//       // ✅ Fixed: removed hardcoded localhost URL
//       const response = await axios.get(
//         `/api/opportunities/vertical-summary/?year=${selectedYear}`,
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

// const AdminPieChartData = createSlice({
//   name: 'AdminPieChartData',
//   initialState,
//   reducers: {
//     clearPieChartDataData: (state) => { state.userpiedata = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminPieChartData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminPieChartData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.userpiedata = action.payload;
//         state.loading     = false;
//       })
//       .addCase(fetchAdminPieChartData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearPieChartDataData } = AdminPieChartData.actions;
// export default AdminPieChartData.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface PieChartDataState {
//   userpiedata: any;
//   loading:     boolean;
//   error:       string | null;
// }

// const initialState: PieChartDataState = {
//   userpiedata: [],
//   loading:     false,
//   error:       null,
// };

// export const fetchAdminPieChartData = createAsyncThunk(
//   'piedata/fetchAdminPieChartData',
//   async (_, { getState, rejectWithValue }) => {
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
//         `/api/opportunities/vertical-summary/?${query.toString()}`,
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

// const AdminPieChartData = createSlice({
//   name: 'AdminPieChartData',
//   initialState,
//   reducers: {
//     clearPieChartDataData: (state) => { state.userpiedata = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminPieChartData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchAdminPieChartData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.userpiedata = action.payload;
//         state.loading     = false;
//       })
//       .addCase(fetchAdminPieChartData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearPieChartDataData } = AdminPieChartData.actions;
// export default AdminPieChartData.reducer;


// src/features/SalesAdminDashboard/PieChart/slice/AdminPieChart.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

interface PieChartDataState {
  userpiedata: any[];
  loading:     boolean;
  error:       string | null;
}

const initialState: PieChartDataState = {
  userpiedata: [],
  loading:     false,
  error:       null,
};

export const fetchAdminPieChartData = createAsyncThunk(
  'piedata/fetchAdminPieChartData',
  async (_, { getState, rejectWithValue }) => {
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
        `/opportunities/vertical-summary/?${query.toString()}`
      );

      return response.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch data'
      );
    }
  }
);

const AdminPieChartData = createSlice({
  name: 'AdminPieChartData',
  initialState,
  reducers: {
    clearPieChartData: (state) => { state.userpiedata = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPieChartData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(
        fetchAdminPieChartData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.userpiedata = action.payload;
          state.loading     = false;
          state.error       = null;
        }
      )
      .addCase(
        fetchAdminPieChartData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading     = false;
          state.userpiedata = [];
          state.error       = action.payload as string;
        }
      );
  },
});

export const { clearPieChartData } = AdminPieChartData.actions;
export default AdminPieChartData.reducer;
