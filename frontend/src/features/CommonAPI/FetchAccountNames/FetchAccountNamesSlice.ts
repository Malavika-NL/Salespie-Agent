import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';



export const fetchAccountNamesData = createAsyncThunk<any[], void>(
  'data/fetchAccountNamesData',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      console.log( 'tokens ', tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/autofill-accounts-data/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      const data: any[] = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);




interface AllAccountNamesState {
  loading: boolean;
  AllAccountNames: any[];
  error: string | null;
}

const initialState: AllAccountNamesState = {
  loading: false,
  AllAccountNames: [],
  error: null,
};

const AllAccountNamesData = createSlice({
  name: 'AllAccountNamesData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountNamesData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAccountNamesData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.AllAccountNames = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAccountNamesData.rejected, (state, action) => {
        state.loading = false;
        state.AllAccountNames = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default AllAccountNamesData.reducer;
