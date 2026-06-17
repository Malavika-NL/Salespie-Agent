// // src/features/dataSlice.ts
// // speedometer/Slice/Userspeedometer.ts
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
// export const fetchUserSpeedometerData = createAsyncThunk(
//     'Speedometerdata/fetchUserSpeedometerData',
//     async (_, { rejectWithValue, getState }) => {
//         try {

//             const state = getState() as RootState;
//             const tokenData = state.userLoginAuth.user.tokens;

//             if (!tokenData.access) {
//                 throw new Error('No access token available');
//             }
            
//             const response = await axios.get('http://localhost:8000/user-rank-a-sum/', {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${tokenData.access}`,
//                 },
//             });
//             // console.log('speeeeeeeeeeedomter ', response)
//             return response.data; // Assuming the data is in response.data
//         } catch (error: any) {
//             // Handle error and return a rejected value
//             return rejectWithValue(error.response?.data || 'Failed to fetch data');
//         }
//     }
// );

// // Data slice
// const SpeedometertUserData = createSlice({
//     name: 'SpeedometertUserData',
//     initialState,
//     reducers: {
//         // Action to clear the data
//         clearEmployeeListData: (state) => {
//             state.TotalAchived = []; // Reset data to an empty array
//         },
//     },  // No synchronous actions are defined here
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchUserSpeedometerData.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchUserSpeedometerData.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.TotalAchived = action.payload;
//                 state.loading = false;
//             })
//             .addCase(fetchUserSpeedometerData.rejected, (state, action: PayloadAction<any>) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });

// export const { clearEmployeeListData } = SpeedometertUserData.actions;
// // Export the reducer to include it in the store
// export default SpeedometertUserData.reducer;

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../../app/store';

// interface SpeedometerUserDataState {
//   TotalAchived: any;
//   loading:      boolean;
//   error:        string | null;
// }

// const initialState: SpeedometerUserDataState = {
//   TotalAchived: [],
//   loading:      false,
//   error:        null,
// };

// export const fetchUserSpeedometerData = createAsyncThunk(
//   'Speedometerdata/fetchUserSpeedometerData',
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
//         `/api/user-rank-a-sum/?${query.toString()}`,
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

// const SpeedometerUserData = createSlice({
//   name: 'SpeedometertUserData',
//   initialState,
//   reducers: {
//     clearEmployeeListData: (state) => { state.TotalAchived = []; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserSpeedometerData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(fetchUserSpeedometerData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.TotalAchived = action.payload;
//         state.loading      = false;
//       })
//       .addCase(fetchUserSpeedometerData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.error   = action.payload as string;
//       });
//   },
// });

// export const { clearEmployeeListData } = SpeedometerUserData.actions;
// export default SpeedometerUserData.reducer;



// src/features/dashboardUser/speedometer/Slice/UserSpeedometer.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

interface SpeedometerUserDataState {
  TotalAchived: any;
  loading:      boolean;
  error:        string | null;
}

const initialState: SpeedometerUserDataState = {
  TotalAchived: null,
  loading:      false,
  error:        null,
};

export const fetchUserSpeedometerData = createAsyncThunk(
  'Speedometerdata/fetchUserSpeedometerData',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { selectedYear, selectedMonth, filterType } = state.globalFilter;

      const query = new URLSearchParams();
      query.set('year', String(selectedYear));
      if (filterType === 'monthly') {
        query.set('month', selectedMonth);
      }

      // ✅ Use axiosInstance — no manual token needed
      const response = await axiosInstance.get(
        `/user-rank-a-sum/?${query.toString()}`
      );

      return response.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch data'
      );
    }
  }
);

const SpeedometerUserData = createSlice({
  name: 'SpeedometertUserData',
  initialState,
  reducers: {
    clearEmployeeListData: (state) => { state.TotalAchived = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSpeedometerData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(
        fetchUserSpeedometerData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.TotalAchived = action.payload;
          state.loading      = false;
          state.error        = null;
        }
      )
      .addCase(
        fetchUserSpeedometerData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading      = false;
          state.TotalAchived = null;
          state.error        = action.payload as string;
        }
      );
  },
});

export const { clearEmployeeListData } = SpeedometerUserData.actions;
export default SpeedometerUserData.reducer;