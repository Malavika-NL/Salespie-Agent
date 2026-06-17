import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

interface Contact {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
}

interface Finance {
  turn_over: number;
  account_resumable: number;
  credits: number;
}

interface Company {
  company_type: string;
  account_type: string;
  company_scale: string;
}

interface FormData {
  account_holder: string;
  account_name: string;
  department: string;
  vertical: string;
  vertical_sub: string | null;
  pic: string;
  designation: string;
  business: string;
  region: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  acct_created_date: string | null;
  last_update_date: string | null;
  contacts: Contact[];  // Update to include contacts array
  finance: Finance[];   // Update to include finance array
  company: Company[];   // Update to include company array
}

export const accountFormData = createAsyncThunk<any[], void>(
  'data/fetchData',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      // console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/account-data/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log( 'Account Data Response',response)
      const data: any[] = await response.json();
      // console.log(data)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);




interface AccountTableState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: AccountTableState = {
  loading: false,
  data: [],
  error: null,
};

const accountData = createSlice({
  name: 'accountTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(accountFormData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(accountFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(accountFormData.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default accountData.reducer;
