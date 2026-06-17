

import { createAsyncThunk, createSlice ,type PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
// import { error } from "console";

import type { RootState } from "../../../app/store";



interface FormData {
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
  



export const opportunityForm = createAsyncThunk(
    'form/opportunityForm',
    async (formData: FormData, { rejectWithValue, getState }) => {
        try {
          const state = getState() as RootState;
          const tokenData = state.userLoginAuth.user.tokens;
          console.log(tokenData)
          if (!tokenData.access) {
            throw new Error('No access token available');
          }
        //   console.log(tokenData.access)
          const response = await axios.post('/opportunity-data/', formData, {
            headers: {
                'content-type' : 'application/json',
              Authorization: `Bearer ${tokenData.access}`,
            },
          });
          console.log(response)
          return response.data; // Assuming your response data structure here
        } catch (error: any) {
          return rejectWithValue(error.response?.data || 'Failed to submit form');
        }
      }
)





interface InitialStateData {
    loading: boolean,
    error: string | null,
    users: null | string;
    data: { message: string };
}





const initialState: InitialStateData = {
    users: null,
    loading: false,
    error: null,
    data: { message: '' },
};



const OpportunityForm = createSlice({
    name: 'form',
    initialState,
    reducers: {
      clearAccountData(state) {
        state.data = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
        builder
            .addCase(opportunityForm.pending, state => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(opportunityForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message }; // Set message from payload
      })
      .addCase(opportunityForm.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data = { message: '' }; // Reset message on failure
      });

    },
})

export const { clearAccountData } = OpportunityForm.actions;
// export const { reducer: opportunityFormReducer } = opportunityForm;
export default OpportunityForm.reducer;
