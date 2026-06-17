import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';

interface OpportunityForm {
  id:string;
  account_holder: string;
  account_name: string;
  opportunity: string;
  make: string;
  sub_make: string;
  sub_make_brand: string;
  pic: string;
  contact_person: string;
  designation: string;
  department: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  opportunity_description: string;
  qty: string;
  values: string;
  exp_closure_date: string;
  exp_po_date: string;
  remarks?: string | null;
  stage: string;
  lost_reason?: string | null;
  hardware_amount: number;
  software_amount: number;
  consumables_amount: number;
  automation_amount: number;
  solution_amount: number;
  maintenance_amount: number;
  others_amount: number;
  total_amount: number;
  status:string | null;
  vertical:string | null;
}

export const opportunityFormData = createAsyncThunk<any[], void>(
  'data/fetchData',
  async (_,{rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/opportunity-data/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to load opportunity data');
    }
  }
);




interface OpportunityTableState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: OpportunityTableState = {
  loading: false,
  data: [],
  error: null,
};

const opportunityData = createSlice({
  name: 'opportunityTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(opportunityFormData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(opportunityFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(opportunityFormData.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error =
          (typeof action.payload === 'string' && action.payload) ||
          action.error.message ||
          'Unknown error';
      });
  },
});

export default opportunityData.reducer;
