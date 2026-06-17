// src/features/dataSlice.ts

import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the data structure you're expecting
interface  SpeedometertDataState {
  piedata: any; // Change `any` to a specific type if you know the structure of the data
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SpeedometertDataState = {
  piedata: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from an API
export const fetchSpeedometerData = createAsyncThunk(
  'Speedometerdata/fetchSpeedometerData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/rank-a-sum/');
      console.log('pie data ',response.data)
      return response.data; // Assuming the data is in response.data
    } catch (error: any) {
      // Handle error and return a rejected value
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

// Data slice
const SpeedometertData = createSlice({
  name: 'Piedata',
  initialState,
  reducers: {
    // Action to clear the data
    clearEmployeeListData: (state) => {
      state.piedata = []; // Reset data to an empty array
    },
  },  // No synchronous actions are defined here
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpeedometerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpeedometerData.fulfilled, (state, action: PayloadAction<any>) => {
        state.piedata = action.payload;
        state.loading = false;
      })
      .addCase(fetchSpeedometerData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEmployeeListData } = SpeedometertData.actions;
// Export the reducer to include it in the store
export default SpeedometertData.reducer;
