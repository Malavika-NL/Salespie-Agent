

import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes'

interface FormData {
  id:string;
  account_holder: string;
  account_name: string;
  opportunity: string;
  make: string | null;
  sub_make: string | null;
  sub_make_brand: string | null;
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

  export const fetchOpportunityUserById = createAsyncThunk(
    'users/fetchOpportunityUserById',
    async (id: string, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        // Make the GET request with the Authorization header
        const response = await axios.get(`/opportunity-data/${id}`, {
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
  
  export const editOpportunityUser = createAsyncThunk(
    'users/editOpportunityUser',
    async ({  formData }: {  formData: FormData }, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
  
        // Make the PUT request with the Authorization header
        const response = await axios.put(`/opportunity-data/${formData.id}/`, formData, {
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
  
  const OpportunityEditForm = createSlice({
    name: 'users',
    initialState : initialEditUserState,
    reducers: {
      clearOpportunityEditData(state) {
        state.response = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
      builder
        // .addCase(fetchOpportunityUserById.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(fetchOpportunityUserById.fulfilled, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.selectedUser = action.payload;
        // })
        // .addCase(fetchOpportunityUserById.rejected, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.error = action.payload;
        // })
        .addCase(editOpportunityUser.pending, state => {
          state.loading = true;
          // state.users = null;
          state.error = null;
        })
        .addCase(editOpportunityUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
          state.loading = false;
        // If users should also be updated, adjust accordingly
          state.error = null;
          state.response = { message: action.payload.message }; // Set message from payload
        })
        .addCase(editOpportunityUser.rejected, (state, action) => {
          state.loading = false;
          // state.users = null;
          state.error = action.payload?.toString() || 'Failed to submit form';
          state.response = { message: (action.payload as { message?: string })?.message || 'Failed to submit form' }; // Set response as an object
        });
    },
  });

  const OpportunityFetchUserByID= createSlice({
    name: 'users',
    initialState: initialFetchUserByIdState,
    reducers: {
      // clearAccountData(state) {
      //   state.response = { message: '' }; // Reset the data
      // },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOpportunityUserById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOpportunityUserById.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.selectedUser = action.payload;
        })
        .addCase(fetchOpportunityUserById.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })
        
    },
  });
  
  export default OpportunityEditForm.reducer;
  export const { clearOpportunityEditData } = OpportunityEditForm.actions;
export const { reducer: opportunityFormEditReducer } = OpportunityEditForm;
export const { reducer: opportunityFetchUserByidReducer } = OpportunityFetchUserByID;
