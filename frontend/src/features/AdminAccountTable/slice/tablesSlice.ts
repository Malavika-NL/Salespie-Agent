import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';

interface AccountForm {
  id: string;
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
  acct_created_date: string;
  last_update_date: string;
}

export const adminAccountFormData = createAsyncThunk<any[], void>(
  'data/adminAccountWorkspaceData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/show-all-account-data/');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch account data'
      );
    }
  }
);


export const adminDeleteAccountFormData = createAsyncThunk<any[], void>(
  'data/adminAccountWorkspaceData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/show-all-account-data/');

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch account data'
      );
    }
  }
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

const adminAccountData = createSlice({
  name: 'adminAccountWorkspaceTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminAccountFormData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(adminAccountFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(adminAccountFormData.rejected, (state, action) => {
        console.error('Error fetching account data:', action.error.message);
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});



const adminDeleteAccountData = createSlice({
  name: 'adminDeleteAccountData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminDeleteAccountFormData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(adminDeleteAccountFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(adminDeleteAccountFormData.rejected, (state, action) => {
        console.error('Error fetching account data:', action.error.message);
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default adminAccountData.reducer;

