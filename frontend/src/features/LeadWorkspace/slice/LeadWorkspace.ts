import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../../app/store";
// import { stat } from "fs";

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




interface AccountDetailsValues {
  account_holder: string;
  account_name: string;
  assign_to:string;
  business_type: string;
  lead: string;
  make: string;
  sub_make: string;
  sub_make_brand: string;
  pic: string;
  contact_person: string;
  designation: string;
  department: string;
  mobile_number: string;
  description: string;
  location: string;
  state: string;
  city: string;
  address: string;
  qty: string;
  values: number | null;
  exp_closure_date: string;
  exp_po_date: string;
  remarks?: string | null;
  email_id:string;
  hardware_amount: number | null;
  software_amount: number | null;
  consumables_amount: number | null;
  automation_amount: number | null;
  solution_amount: number | null;
  maintenance_amount: number | null;
  others_amount: number | null;
  total_amount: number | null;
  status: string | null;
  vertical: string | null;

}

interface FormData extends AccountDetailsValues {
  // last_update: string;
  lead_stages: Stage[];
  lead_pic: PicDetails[];

}

export const postLeadWorkspaceForm = createAsyncThunk(
  'form/postLeadWorkspaceForm',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await axios.post('http://localhost:8000/lead-data/', formData, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log('response ', response.data)
      return response.data;
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
    }
  }
)

interface InitialStateData {
  formValues: any;
  loading: boolean;
  error: string | null;
  users: null | string;
  data: { message: string };
  formData: FormData | null;  // Ensure this line exists
}


const initialFormData: FormData = {
  account_holder: '',
  account_name: '',
  assign_to:'',
  business_type: '',
  lead: '',
  make: '',
  sub_make: '',
  sub_make_brand: '',
  pic: '',
  contact_person: '',
  designation: '',
  department: '',
  mobile_number: '',
  description: '',
  location: '',
  state: '',
  city: '',
  address: '',
  qty: '',
  email_id:'',
  values: 0,
  exp_closure_date: '',
  exp_po_date: '',
  hardware_amount: 0,
  software_amount: 0,
  consumables_amount: 0,
  automation_amount: 0,
  solution_amount: 0,
  maintenance_amount: 0,
  others_amount: 0,
  total_amount: 0,
  status: 'new_lead',
  vertical: '',
  // last_update: '',
  lead_stages: [],
  lead_pic: [
    { 
      pic_department: '',
      pic_name: '',
      pic_designation: '',
      pic_email: '',
      pic_phnone: '',
      pic_phntwo: '',
    }
  ],


};

const initialState: InitialStateData = {
  formValues: null,
  users: null,
  loading: false,
  error: null,
  data: { message: '' },
  formData: initialFormData,
};
const LeadWorkspaceForm = createSlice({
  name: 'LeadWorkspaceForm',
  initialState,
  reducers: {
    clearOpportunityData(state) {
      state.data = { message: '' };
    },



    setFormData(state, action: PayloadAction<{ id: string; value: string | number }>) {
      if (!state.formData) {
        console.warn('formData is null or undefined');
        return;
      }
    
      const { id, value } = action.payload;
      console.log('form action', action.payload);  // Check the payload here
    
      state.formData = {
        ...state.formData,
        [id]: value
      };
    
      console.log('form data', state.formData);  // Check the updated formData
    },

    addStage(state, action: PayloadAction<Stage>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          lead_stages: [action.payload]
        };
      }
    },
    addPicDetails(state, action: PayloadAction<PicDetails | PicDetails[]>) {
      if (state.formData) {
        if (Array.isArray(action.payload)) {
          state.formData.lead_pic = action.payload; // Update entire array when editing
        } else {
          state.formData.lead_pic = [...state.formData.lead_pic, action.payload]; // Add new PIC
        }
      }
    },
    



    submitForm(state) {

      if (state.formData) {
        console.log('end point', state.formData)
        postLeadWorkspaceForm(state.formData as any);
      }
    },
    resetFormData(state) {
      // Reset the formData to its initial state
      state.formData = initialFormData;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLeadWorkspaceForm.pending, (state) => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(postLeadWorkspaceForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message };
      })
      .addCase(postLeadWorkspaceForm.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data = { message: '' };
      });
  },
});

export const { clearOpportunityData, setFormData, addStage, addPicDetails, submitForm  ,resetFormData  } = LeadWorkspaceForm.actions;
export default LeadWorkspaceForm.reducer;
