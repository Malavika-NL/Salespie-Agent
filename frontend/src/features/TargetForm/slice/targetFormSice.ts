

import { createAsyncThunk, createSlice ,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { error } from "console";
import type { RootState } from "../../../app/store";


interface FormData {
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

const normalizeEmail = (value: string) => {
  const email = (value || '').trim();
  if (!email) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
};

const sanitizeTargetPayload = (formData: FormData) => {
  return {
    account_name: (formData.account_name || '').trim(),
    department: (formData.department || '').trim(),
    vertical: (formData.vertical || '').trim(),
    vertical_sub: (formData.vertical_sub || '').trim(),
    pic: (formData.pic || '').trim(),
    designation: (formData.designation || '').trim(),
    business: (formData.business || '').trim(),
    activity: (formData.activity || '').trim(),
    activity_date: (formData.activity_date || '').trim(),
    next_action: (formData.next_action || '').trim(),
    remarks: (formData.remarks || '').trim(),
    next_action_date: (formData.next_action_date || '').trim(),
    region: (formData.region || '').trim(),
    mobile_number: (formData.mobile_number || '').replace(/\D/g, '').slice(0, 10),
    email_id: normalizeEmail(formData.email_id),
    location: (formData.location || '').trim(),
    state: (formData.state || '').trim(),
    city: (formData.city || '').trim(),
    address: (formData.address || '').trim(),
    acct_created_date: formData.acct_created_date,
  };
};




export const targetForm = createAsyncThunk(
    'form/targetForm',
    async (formData: FormData, { rejectWithValue, getState }) => {
        try {
          const state = getState() as RootState;
          const tokenData = state.userLoginAuth.user.tokens;
          console.log(tokenData)
          if (!tokenData.access) {
            throw new Error('No access token available');
          }
        //   console.log(tokenData.access)
          const payload = sanitizeTargetPayload(formData);
          const response = await axios.post('http://localhost:8000/target-data/', payload, {
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



const TargetForm = createSlice({
    name: 'form',
    initialState,
    reducers: {
      clearTargetData(state) {
        state.data = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(targetForm.pending, state => {
          state.loading = true;
          state.users = null;
          state.error = null;
        })
        .addCase(targetForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
          state.loading = false;
          state.error = null;
          state.data = { message: action.payload.message }; // Set message from payload
        })
        .addCase(targetForm.rejected, (state, action) => {
          state.loading = false;
          state.users = null;
          state.error = action.payload?.toString() || 'Failed to submit form';
          state.data = { message: '' }; // Reset message on failure
        });

    },
})

export const { clearTargetData } = TargetForm.actions;
// export const { reducer: accountFormReducer } = AccountForm;
export default TargetForm.reducer;
