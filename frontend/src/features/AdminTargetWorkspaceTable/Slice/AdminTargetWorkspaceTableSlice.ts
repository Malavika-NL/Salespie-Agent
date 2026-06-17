import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import axios from 'axios';

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

export const fetchAdminTargetWorkspaceFormData = createAsyncThunk<any[], void>(
  'data/fetchAdminTargetWorkspaceFormData',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;    
      const tokenData = state.userLoginAuth.user.tokens;
      // console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('/api/show-all-target-data/', {
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

const TargetAdminWorkspaceFormData = createSlice({
  name: 'TargetAdminWorkspaceFormData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTargetWorkspaceFormData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAdminTargetWorkspaceFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAdminTargetWorkspaceFormData.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});


export const deleteAdminTargetWorkspaceTableData = createAsyncThunk(
  'data/deleteAdminTargetWorkspaceTableData',
  async (id: string, { getState, rejectWithValue }) => {
      try {
          const state = getState() as RootState;
          const tokenData = state.userLoginAuth.user.tokens;

          if (!tokenData.access) {
              throw new Error('No access token available');
          }

          const response = await axios.delete(`/api/show-all-target-data/${id}/`, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokenData.access}`,
              },
          });
          console.log('response', response)

          return response.data; // Axios automatically parses JSON
      } catch (error: any) {
          return rejectWithValue(
              error.response?.data || 'Failed to fetch Target data'
          );
      }
  }
);

interface DeleteTargetTableState {
  loading: boolean;
  delteData: any[];
  response: { message: string };
  error: string | null;
}

const initialDeleteTargetTableState: DeleteTargetTableState = {
  loading: false,
  delteData: [],
  error: null,
  response: { message: '' },
};

const AdminDeleteTargetWorkspaceTableData = createSlice({
  name: 'AdminDeleteTargetWorkspaceTableData',
  initialState: initialDeleteTargetTableState,
  reducers: { clearResponse(state) {
    state.response = { message: '' }; // Reset the data
  },},
  extraReducers: (builder) => {
      builder
          .addCase(deleteAdminTargetWorkspaceTableData.pending, (state) => {
              state.loading = true;
              state.error = null; // Clear any previous errors
          })
          .addCase(deleteAdminTargetWorkspaceTableData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
              state.loading = false;
              state.response = { message: action.payload.message };
              state.error = null; // Clear any previous errors
          })
          .addCase(deleteAdminTargetWorkspaceTableData.rejected, (state, action) => {
              // console.error('Error fetching Target data:', action.error.message);
              state.loading = false;
              state.response = { message: 'failed' };
              state.error = action.error.message || 'Unknown error';
          });
  },
});


// export default TargetAdminWorkspaceFormData.reducer;
export const { clearResponse } = AdminDeleteTargetWorkspaceTableData.actions;


export const { reducer: deleteAdminTargetWorkspaceTableDataReducer } = AdminDeleteTargetWorkspaceTableData;
export const { reducer: fetchAdminTargetWorkspaceFormDataReducer } = TargetAdminWorkspaceFormData;
