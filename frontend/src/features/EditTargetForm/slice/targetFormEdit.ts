

import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes'



interface FormData {
    id: string;
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

  
  export const fetchTargetUserById = createAsyncThunk(
    'users/fetchUserById',
    async (id: string, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        // Make the GET request with the Authorization header
        const response = await axios.get(`http://localhost:8000/target-data/${id}`, {
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
  
  export const editTargetUser = createAsyncThunk(
    'users/editUser',
    async ({  formData }: {  formData: FormData }, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
  
        // Make the PUT request with the Authorization header
        const payload = sanitizeTargetPayload(formData);
        const response = await axios.put(`http://localhost:8000/target-data/${formData.id}/`, payload, {
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
  
  const TargetEditForm = createSlice({
    name: 'users',
    initialState : initialEditUserState,
    reducers: {
      clearTargetEditData(state) {
        state.response = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
      builder
        // .addCase(fetchTargetUserById.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(fetchTargetUserById.fulfilled, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.selectedUser = action.payload;
        // })
        // .addCase(fetchTargetUserById.rejected, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.error = action.payload;
        // })
        // .addCase(editTargetUser.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(editTargetUser.fulfilled, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   const index = state.data.findIndex(user => user.id === action.payload.id);
        //   if (index !== -1) {
        //     state.data[index] = action.payload;
        //   }
        // })
        // .addCase(editTargetUser.rejected, (state, action: PayloadAction<any>) => {
        //   state.loading = false;
        //   state.error = action.payload;
        // });
        .addCase(editTargetUser.pending, state => {
          state.loading = true;
          // state.users = null;
          state.error = null;
        })
        .addCase(editTargetUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
          state.loading = false;
        // If users should also be updated, adjust accordingly
          state.error = null;
          state.response = { message: action.payload.message }; // Set message from payload
        })
        .addCase(editTargetUser.rejected, (state, action) => {
          state.loading = false;
          // state.users = null;
          state.error = action.payload?.toString() || 'Failed to submit form';
          state.response = { message: (action.payload as { message?: string })?.message || 'Failed to submit form' }; // Set response as an object
        });
    },
  });

  const TargetFetchUserByID= createSlice({
    name: 'users',
    initialState: initialFetchUserByIdState,
    reducers: {
      // clearAccountData(state) {
      //   state.response = { message: '' }; // Reset the data
      // },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTargetUserById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTargetUserById.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.selectedUser = action.payload;
        })
        .addCase(fetchTargetUserById.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })
        
    },
  });
  
  export default TargetEditForm.reducer;
  export const { clearTargetEditData } = TargetEditForm.actions;
export const { reducer: targetFormEditReducer } = TargetEditForm;
export const { reducer: targetFetchUserByidReducer } = TargetFetchUserByID;
