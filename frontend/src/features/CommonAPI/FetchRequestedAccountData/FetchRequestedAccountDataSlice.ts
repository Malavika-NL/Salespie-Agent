import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';



export const fetchRequestedAccountData = createAsyncThunk(
  'data/fetchRequestedAccountData',
  async ({ accountName }: { accountName: string | number }, { getState, rejectWithValue }) => {
    console.log( 'accountName at end point ', accountName)
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      console.log( 'tokens ', tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const encodedAccountName = encodeURIComponent(String(accountName));
      const response = await fetch(`http://localhost:8000/autofill-accounts-data/${encodedAccountName}/details/`, {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log('response from server',response)
      const data: any[] = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);




interface AccountDataState {
  loading: boolean;
  AccountData: any;
  error: string | null;
}

const initialState: AccountDataState = {
  loading: false,
  AccountData: [],
  error: null,
};

const RequestedAccountData = createSlice({
  name: 'RequestedAccountData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestedAccountData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchRequestedAccountData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.AccountData = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchRequestedAccountData.rejected, (state, action) => {
        state.loading = false;
        state.AccountData = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default RequestedAccountData.reducer;
