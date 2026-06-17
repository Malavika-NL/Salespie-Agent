

import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes'


interface Contact {
  category: string;
  name: string;
  designation: string;
  mobile_no: string;
  email_id: string;
}

interface Finance {
  turn_over: number;
  account_resumable: number;
  credits: number;
}

interface Company {
  company_type: string;
  account_type: string;
  company_scale: string;
}

interface FormData {
  id:string;
  account_holder: string;
  account_name: string;
  department: string;
  vertical: string;
  vertical_sub: string | null;
  pic: string;
  designation: string;
  business: string;
  region: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  acct_created_date: string | null;
  last_update: string | null;
  contacts: Contact[];  // Update to include contacts array
  finance: Finance[];   // Update to include finance array
  company: Company[];   // Update to include company array
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
    response: { message: string };
  }
  
  
  
  
  
  const initialFetchUserByIdState: InitialFetchUserById = {
    data: [],
    selectedUser: null,
    loading: false,
    error: null,
    response: { message: '' },
  };
  

  
  export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (id: string, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        // Make the GET request with the Authorization header
        const response = await axios.put(`http://localhost:8000/account-data/${id}/`,{}, {
          headers: {
            Authorization: `Bearer ${tokenData}`,
          },
        });
  
        console.log( 'account end point data', response);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const editUser = createAsyncThunk(
    'users/editUser',
    async ({  formData }: {  formData: FormData }, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
  
        // Make the PUT request with the Authorization header
        const response = await axios.put(`http://localhost:8000/account-data/${formData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${tokenData}`,
          },
        });
        console.log(' account user',response)
        console.log(response.data)
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  const AccountEditForm = createSlice({
    name: 'users',
    initialState : initialEditUserState ,
    reducers: {
      clearAccountData(state) {
        state.response = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
      builder
        
     .addCase(editUser.pending, state => {
        state.loading = true;
        // state.users = null;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
      // If users should also be updated, adjust accordingly
        state.error = null;
        state.response = { message: action.payload.message }; // Set message from payload
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        // state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.response = { message: (action.payload as { message?: string })?.message || 'Failed to submit form' }; // Set response as an object
      });
    },
  });

  const AccountFetchUserByID= createSlice({
    name: 'users',
    initialState: initialFetchUserByIdState,
    reducers: {
      // clearAccountData(state) {
      //   state.response = { message: '' }; // Reset the data
      // },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUserById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.selectedUser = action.payload;
        })
        .addCase(fetchUserById.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })
        
    },
  });
  
  // export default AccountEditForm.reducer;
export const { clearAccountData } = AccountEditForm.actions;
export const { reducer: accountFormEditReducer } = AccountEditForm;
export const { reducer: accountFetchUserByidReducer } = AccountFetchUserByID;
