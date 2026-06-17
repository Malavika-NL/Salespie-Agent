

import { createAsyncThunk, createSlice ,type PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "../../../app/axiosInstance";
// import { error } from "console";
import type { RootState } from "../../../app/store";


interface FormData {
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
    hardware_amount: number;  // If it's a number, change to `number`
    software_amount: number;  // If it's a number, change to `number`
    consumables_amount: number;  // If it's a number, change to `number`
    automation_amount: number;  // If it's a number, change to `number`
    solution_amount: number;  // If it's a number, change to `number`
    maintenance_amount: number;  // If it's a number, change to `number`
    others_amount: number;  // If it's a number, change to `number`
    total_amount: number;  // If it's a number, change to `number`
    assigned_to:string;
}


export const getUserDetails = createAsyncThunk(
  'users/getUserDetails',
  async ( _, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/');

      console.log(response);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const leadForm = createAsyncThunk(
    'form/leadForm',
    async (formData: FormData,{ rejectWithValue, getState }) => {
        
        try {
            const state = getState() as RootState;
            const tokenData = state.userLoginAuth.user.tokens;
            // console.log(tokenData)
            if (!tokenData.access) {
              throw new Error('No access token available');
            }
          //   console.log(tokenData.access)
            const response = await axiosInstance.post('/lead-data/', formData);
            console.log(response)
            return response.data; // Assuming your response data structure here
          } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to submit form');
          }
        
    })





interface InitialStateData {
    loading: boolean,
    error: string | null,
    users: any[];
    data: { message: string };
}





const initialState: InitialStateData = {
    users: [],
    loading: false,
    error: null,
    data: { message: '' },
};

interface InitialGetUserStateData {
  loading: boolean,
  error: string | null,
  userData: any[];
  data: { message: string };
}





const initialGetUserState: InitialGetUserStateData = {
  userData: [],
  loading: false,
  error: null,
  data: { message: '' },
};



const LeadForm = createSlice({
    name: 'form',
    initialState,
    reducers: {
      clearLeadData(state) {
        state.data = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
        builder
      
          .addCase(leadForm.pending, state => {
        state.loading = true;
        // state.users = null;
        state.error = null;
      })
      .addCase(leadForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
       
        state.error = null;
        state.data = { message: action.payload.message }; // Set message from payload
      })
      .addCase(leadForm.rejected, (state, action) => {
        state.loading = false;
        // state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data = { message: '' }; // Reset message on failure
      });

    },
})

const GetUserData = createSlice({
  name: 'shift',
  initialState : initialGetUserState ,
  reducers: {
    clearLeadData(state) {
      state.data = { message: '' }; // Reset the data
    },
  },
  extraReducers : (builder) =>{
     builder 
      
     .addCase(getUserDetails.pending, (state) => {
      state.loading = true;
      // state.users = null;
      state.error = null;
  })
  .addCase(getUserDetails.fulfilled, (state, action :PayloadAction<any>) => {
      state.loading = false;
      state.userData = action.payload;
      state.error = null;
  })
  .addCase(getUserDetails.rejected, (state, action) => {
      if (action.payload) {
          // Handle rejected action with payload
          state.loading = false;
          // state.users = null;
          state.error = action.payload.toString();
        } else {
          // Handle rejected action without payload
          state.loading = false;
          // state.users = null;
          state.error = 'Failed to submit form';
        }
  })

 
  },
})

export const { clearLeadData } = LeadForm.actions;
export const { reducer: leadFormReducer } = LeadForm;
export const { reducer: getUserDataReducer } = GetUserData;
// export default LeadForm.reducer;
