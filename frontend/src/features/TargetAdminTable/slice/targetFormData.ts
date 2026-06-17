import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

// Define the TargetForm interface
interface TargetForm {
  id:string;
  account_holder: string;
  account_name: string;
  department: string;
  vertical: string;
  vertical_sub: string;
  pic: string;
  designation: string;
  business: string;
  activity: string;
  activity_date: string;
  next_action: string;
  remarks: string;
  next_action_date: string;
  region: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  acct_created_date: string;
}

// Create async thunk for fetching data
export const adminTargetFormData = createAsyncThunk<TargetForm[], void>(
  'data/fetchData',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/show-all-target-data/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log(response)
      const data: TargetForm[] = await response.json();
      console.log(data)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);

// Define initial state interface
interface TargetTableState {
  loading: boolean;
  data: TargetForm[];
  error: string | null;
}

// Initial state
const initialState: TargetTableState = {
  loading: false,
  data: [],
  error: null,
};

// Create slice for targetData
const adminTargetData = createSlice({
  name: 'targetTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminTargetFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminTargetFormData.fulfilled, (state, action: PayloadAction<TargetForm[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(adminTargetFormData.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default adminTargetData.reducer;
