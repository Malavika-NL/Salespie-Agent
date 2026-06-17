

import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes'



interface FormData {
    id:string;
    account_holder: string;
    account_name: string;
    department: string;
    opportunity: string;
    make: string | null;
    sub_make: string | null;
    sub_make_brand: string | null;
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
    qty: string;
    values: string;
    exp_closure_date: string;
    exp_po_date: string;
    remarks?: string | null;
    stage: string;
    lost_reason?: string | null;
    hardware_amount: string;
    software_amount: string;
    consumables_amount: string;
    automation_amount: string;
    solution_amount: string;
    maintenance_amount: string;
    others_amount: string;
    total_amount: string;
    assigned_to:string;
}


interface UserState {
  data: any[];
  User: FormData | null;
  loading: boolean;
  error: string | null;
  response: { message: string };
}

const initialEditUserState: UserState = {
  data: [],
  User: null,
  loading: false,
  error: null,
  response: { message: '' },
};

interface InitialFetchUserById {
  data: any[];
  selectedUser: FormData | null;
  loading: boolean;
  error: string | null;
  // response: { message: string };
}





const initialFetchUserByIdState: InitialFetchUserById = {
  data: [],
  selectedUser: null,
  loading: false,
  error: null,
  // response: { message: '' },
};

  
  export const fetchLeadUserById = createAsyncThunk(
    'users/fetchLeadUserById',
    async (id: string, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        // Make the GET request with the Authorization header
        const response = await axios.get(`/lead-data/${id}`, {
          headers: {
            Authorization: `Bearer ${tokenData}`,
          },
        });
  
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
  
  export const editLeadUser = createAsyncThunk(
    'users/editLeadUser',
    async ({  formData }: {  formData: FormData }, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
  
        // Make the PUT request with the Authorization header
        const response = await axios.put(`/lead-data/${formData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${tokenData}`,
          },
        });
        console.log(response)
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  const LeadEditForm = createSlice({
    name: 'users',
    initialState : initialEditUserState,
    reducers: {
      clearleadEditData(state) {
        state.response = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
      builder
        // .addCase(fetchLeadUserById.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(fetchLeadUserById.fulfilled, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.selectedUser = action.payload;
        // })
        // .addCase(fetchLeadUserById.rejected, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.error = action.payload;
        // })
        // .addCase(editLeadUser.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(editLeadUser.fulfilled, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   const index = state.data.findIndex(user => user.id === action.payload.id);
        //   if (index !== -1) {
        //     state.data[index] = action.payload;
        //   }
        // })
        // .addCase(editLeadUser.rejected, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.error = action.payload;
        // });
        .addCase(editLeadUser.pending, state => {
          state.loading = true;
          // state.users = null;
          state.error = null;
        })
        .addCase(editLeadUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
          state.loading = false;
        // If users should also be updated, adjust accordingly
          state.error = null;
          state.response = { message: action.payload.message }; // Set message from payload
        })
        .addCase(editLeadUser.rejected, (state, action) => {
          state.loading = false;
          // state.users = null;
          state.error = action.payload?.toString() || 'Failed to submit form';
          state.response = { message: (action.payload as { message?: string })?.message || 'Failed to submit form' }; // Set response as an object
        });
    },
  });

  const LeadFetchUserByID= createSlice({
    name: 'users',
    initialState: initialFetchUserByIdState,
    reducers: {
      // clearAccountData(state) {
      //   state.response = { message: '' }; // Reset the data
      // },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchLeadUserById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchLeadUserById.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.selectedUser = action.payload;
        })
        .addCase(fetchLeadUserById.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })
        
    },
  });
  
  export default LeadEditForm.reducer;
  export const { clearleadEditData } = LeadEditForm.actions;
export const { reducer: leadFormEditReducer } = LeadEditForm;
export const { reducer: leadFetchUserByidReducer } = LeadFetchUserByID;
