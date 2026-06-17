import  { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes';

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
  last_update: string | null;
  contacts: Contact[];  // Update to include contacts array
  finance: Finance[];   // Update to include finance array
  company: Company[];   // Update to include company array
}

interface AccountFormState {
  loading: boolean;
  users: any; // Adjust as per your response structure
  error: string | null;
  data: { message: string };
}

const initialState: AccountFormState = {
  loading: false,
  users: null,
  error: null,
  data: { message: '' },
};

export const accountForm = createAsyncThunk(
  'form/accountForm',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;

      if (!tokenData.access) {
        throw new Error('No access token available');
      }

      const response = await axios.post('/account-data/', formData, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });

      return response.data; // Assuming your response data structure here
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      return rejectWithValue(error.response?.data || 'Failed to submit form');
    }
  }
);

const AccountForm = createSlice({
  name: 'accountForm',
  initialState,
  reducers: {
    clearAccountData(state) {
      state.data = { message: '' }; // Reset the data
    },
  },
  extraReducers: builder => {
    builder
      .addCase(accountForm.pending, state => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(accountForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.users = action.payload; // If users should also be updated, adjust accordingly
        state.error = null;
        state.data = { message: action.payload.message }; // Set message from payload
      })
      .addCase(accountForm.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data.message = (action.payload as { message?: string })?.message || 'Failed to submit form'; // Set message from error payload
      });
  },
});

export const { clearAccountData } = AccountForm.actions;

export default AccountForm.reducer;
