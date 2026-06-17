import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

interface LeadForm {
  id:string;
  account_holder: string;
    account_name: string;
    department: string;
    opportunity: string;
    make: string;
    sub_make: string;
    sub_make_brand: string;
    pic: string;
    contact_person: string;
    designation: string;
    mobile_number: string;
    region: string;
    email_id: string;
    location: string;
    state: string;
    city: string;
    address: string;
    opportunity_description: string;
    qty: string;  // If it's a number, change to `number`
    values: string;  // If it's a number, change to `number`
    exp_closure_date: string;
    exp_po_date: string;
    remarks: string;
    stage: string;
    lost_reason: string;
    hardware_amount: string;  // If it's a number, change to `number`
    software_amount: string;  // If it's a number, change to `number`
    consumables_amount: string;  // If it's a number, change to `number`
    automation_amount: string;  // If it's a number, change to `number`
    solution_amount: string;  // If it's a number, change to `number`
    maintenance_amount: string;  // If it's a number, change to `number`
    others_amount: string;  // If it's a number, change to `number`
    total_amount: string;  // If it's a number, change to `number`
   assigned_to:string;
}


export const leadFormData = createAsyncThunk<LeadForm[], void>(
  'data/leadFormData',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      // console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/show-all-lead-data/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log(response)
      const data: LeadForm[] = await response.json();
      // console.log(data)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);



interface LeadTableState {
  Dataloading: boolean;
  data: LeadForm[];
  dataError: string | null;
}

const initialState: LeadTableState = {
  Dataloading: false,
  data: [],
  dataError: null,
};

const leadData = createSlice({
  name: 'leadTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(leadFormData.pending, (state) => {
        state.Dataloading = true;
        state.dataError = null; // Clear any previous errors
      })
      .addCase(leadFormData.fulfilled, (state, action: PayloadAction<LeadForm[]>) => {
        state.Dataloading = false;
        state.data = action.payload;
        state.dataError = null; // Clear any previous errors
      })
      .addCase(leadFormData.rejected, (state, action) => {
        state.Dataloading = false;
        state.data = [];
        state.dataError = action.error.message || 'Unknown error';
      });
  },
});

export default leadData.reducer;
