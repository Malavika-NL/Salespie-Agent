import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

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
}

export const fetchOpportunityCategoryTotalData = createAsyncThunk<any[], void>(
    'totaldata/opportunityCategoryTotalData',
    async (_, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens;
  
        if (!tokenData.access) {
          throw new Error('No access token available');
        }
  
        const response = await fetch('http://localhost:8000/user-opportunity-category-total/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenData.access}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        // console.log('response:' , response)
        const data = await response.json(); // Parse the response as JSON
        // console.log('data:' , data)
        return data; // Return the parsed data
  
      } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch opportunity category total data');
      }
    }
  );
  



interface OpportunityCategoryTotalState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: OpportunityCategoryTotalState = {
  loading: false,
  data: [],
  error: null,
};

const opportunityCategoryTotalData = createSlice({
  name: 'opportunityTotalData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunityCategoryTotalData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchOpportunityCategoryTotalData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchOpportunityCategoryTotalData.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default opportunityCategoryTotalData.reducer;
