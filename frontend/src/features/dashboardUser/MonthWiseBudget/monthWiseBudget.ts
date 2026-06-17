// src/features/dataSlice.ts

import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the data structure you're expecting
interface  MonthWiseBudgetDataState {
  budgetdata: any; // Change `any` to a specific type if you know the structure of the data
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MonthWiseBudgetDataState = {
    budgetdata: [],
  loading: false,
  error: null,
};

// Thunk to fetch data from an API
export const fetchMonthWiseBudgetData = createAsyncThunk(
  'budgetdata/fetchMonthWiseBudgetData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/monthly-total-amount/');
      // console.log('budget data ',response.data)
      return response.data; // Assuming the data is in response.data
    } catch (error: any) {
      // Handle error and return a rejected value
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

// Data slice
const MonthWiseBudgetData = createSlice({
  name: 'budgetdata',
  initialState,
  reducers: {
    // Action to clear the data
    clearMonthWiseBudgetData: (state) => {
      state.budgetdata = []; // Reset data to an empty array
    },
  },  // No synchronous actions are defined here
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthWiseBudgetData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthWiseBudgetData.fulfilled, (state, action: PayloadAction<any>) => {
        state.budgetdata = action.payload;
        state.loading = false;
      })
      .addCase(fetchMonthWiseBudgetData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMonthWiseBudgetData } = MonthWiseBudgetData.actions;
// Export the reducer to include it in the store
export default MonthWiseBudgetData.reducer;
