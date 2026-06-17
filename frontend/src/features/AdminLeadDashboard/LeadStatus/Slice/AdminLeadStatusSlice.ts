import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { stat } from "fs";
import type { RootState } from "../../../../app/store";

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
  id:string;
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
  email_id: string;
  exp_closure_date: string;
  exp_po_date: string;
  remarks?: string | null;
  acct_created_date:string;
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

export const postAdminLeadWorkspaceStatus = createAsyncThunk(
  'form/postAdminLeadWorkspaceStatus',
  async ({ id }: { id: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await axios.post(`http://localhost:8000/move-lead/${id}/`,{}, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
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
  id:'',
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
  email_id:'',
  description: '',
  location: '',
  state: '',
  city: '',
  address: '',
  qty: '',
  acct_created_date:'',
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
  status: 'follow_up',
  vertical: '',
  // last_update: '',
  lead_stages: [],
  lead_pic: [],


};


const initialState: InitialStateData = {
  formValues: null,
  users: null,
  loading: false,
  error: null,
  data: { message: '' },
  formData: initialFormData,
};
const AdminLeadWorkspaceStatus = createSlice({
  name: 'AdminLeadWorkspaceStatus',
  initialState,
  reducers: {
    clearEditLeadWorkspaceData(state) {
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
    addPicDetails(state, action: PayloadAction<PicDetails>) {

      if (state.formData) {
        state.formData = {
          ...state.formData,
          lead_pic: [action.payload]
        };
      }
      console.log(state.formData)
    },



    submitForm(state) {

      if (state.formData) {
        console.log('end point', state.formData)
        postAdminLeadWorkspaceStatus(state.formData as any);
      }
    },
    resetFormData(state) {
      // Reset the formData to its initial state
      state.formData = initialFormData;
    },
    
  },
  extraReducers: (builder) => {
    builder
       .addCase(postAdminLeadWorkspaceStatus.pending, (state) => {
              state.loading = true;
              state.users = null;
              state.error = null;
            })
            .addCase(postAdminLeadWorkspaceStatus.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
              
              state.loading = false;
              state.error = null;
              state.data = { message: action.payload.message };
            })
            .addCase(postAdminLeadWorkspaceStatus.rejected, (state, action) => {
              state.loading = false;
              state.users = null;
              state.error = action.payload?.toString() || 'Failed to submit form';
              state.data = { message: '' };
            })
      
            
  },
});

export const { clearEditLeadWorkspaceData, setFormData, addStage, addPicDetails, submitForm  ,resetFormData  } = AdminLeadWorkspaceStatus.actions;
export default AdminLeadWorkspaceStatus.reducer;
