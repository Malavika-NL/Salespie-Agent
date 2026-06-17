import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';

interface Stage {
    stages: string;
    ranks: string;
    lost_reason?: string;
  }
  
  interface PicDetails {
    pic_department: string;
    pic_name: string;
    pic_designation: string;
    pic_email: string;
    pic_phnone: string;
    pic_phntwo: string;
  }
  
  interface EventDetails {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    event: string;
    remark: string;
  }
  
  interface TaskDetails {
    task: string;
    assign_to: string;
    start_date: string;
    end_date: string;
    status: string;
  }
  
  interface UpdateEventPayload {
    eventIndex: number;
    updatedEvent: EventDetails;
  }
  
  
  interface AccountDetailsValues {
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
    qty: string;
    values: number;
    exp_closure_date: string;
    exp_po_date: string;
    remarks?: string | null;
    hardware_amount: number;
    software_amount: number;
    consumables_amount: number;
    automation_amount: number;
    solution_amount: number;
    maintenance_amount: number;
    others_amount: number;
    total_amount: number;
    status: string | null;
    vertical: string | null;
    vertical_sub:string;
    last_update:string ;
    opportunity_description:string;
  }
  
  interface FormData extends AccountDetailsValues {
    // last_update: string;
    opportunity_stages: Stage[];
    opportunity_pic: PicDetails[];
    opportunity_event: EventDetails[];
    opportunity_task: TaskDetails[];
  }

export const fetchOpportunityWorkspaceTableData = createAsyncThunk<any[], void>(
  'data/fetchOpportunityWorkspaceTableData',
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
  OpportunityData: any[];
  error: string | null;
}

const initialState: OpportunityTableState = {
  loading: false,
  OpportunityData: [],
  error: null,
};

const OpportunityWorkspaceTableData = createSlice({
  name: 'opportunityTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunityWorkspaceTableData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchOpportunityWorkspaceTableData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.OpportunityData = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchOpportunityWorkspaceTableData.rejected, (state, action) => {
        state.loading = false;
        state.OpportunityData = [];
        state.error =
          (typeof action.payload === 'string' && action.payload) ||
          action.error.message ||
          'Unknown error';
      });
  },
});





export default OpportunityWorkspaceTableData.reducer;
