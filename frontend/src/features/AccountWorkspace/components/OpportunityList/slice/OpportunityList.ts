import  { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../../../app/store';

interface OpportunityListState {
  loading: boolean;
  error: string | null;
  data: any[];
}

const initialState: OpportunityListState = {
  loading: false,
  error: null,
  data: [],
};

export const fetchOpportunityList = createAsyncThunk(
  'form/fetchOpportunityList',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      const username = state.userLoginAuth.user.username;

      if (!tokenData.access) {
        throw new Error('No access token available');
      }

      // Use GET request with query parameters
      const response = await axios.get(
        `http://localhost:8000/fetch-matching-opportunities/`,
        {
          params: { username }, // Pass username as a query parameter
          headers: {
            Authorization: `Bearer ${tokenData.access}`,
          },
        }
      );

      return response.data; // Assuming your response data structure here
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

const OpportunityList = createSlice({
  name: 'opportunityList',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOpportunityList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunityList.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchOpportunityList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.toString() || 'Failed to fetch data';
      });
  },
});

export default OpportunityList.reducer;
