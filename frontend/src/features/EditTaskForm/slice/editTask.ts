

import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes'



interface FormData {
  id:string;
  task: string;
  description:string;
  start_date:string;
  end_date:string;
  assigned_to:string;
  status:string | null;
  outcome:string | null;
  last_update_date: string | null;

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

  export const fetchTaskUserById = createAsyncThunk(
    'users/fetchLeadUserById',
    async (id: string, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        // Make the GET request with the Authorization header
        const response = await axios.get(`/task-data/${id}`, {
          headers: {
            Authorization: `Bearer ${tokenData}`,
          },
        });
  
        console.log(response.data);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const editTaskUser = createAsyncThunk(
    'users/editLeadUser',
    async ({ formData }: {  formData: FormData }, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        console.log(formData.id)
        // Make the PUT request with the Authorization header
        const response = await axios.put(`/task-data/${formData.id}/`, formData, {
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
  
  const TaskEditForm = createSlice({
    name: 'users',
    initialState : initialEditUserState ,
    reducers: {
      clearTaskEditData(state) {
        state.response = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
      builder
      
      .addCase(editTaskUser.pending, state => {
        state.loading = true;
        // state.users = null;
        state.error = null;
      })
      .addCase(editTaskUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
      // If users should also be updated, adjust accordingly
        state.error = null;
        state.response = { message: action.payload.message }; // Set message from payload
      })
      .addCase(editTaskUser.rejected, (state, action) => {
        state.loading = false;
        // state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.response = { message: (action.payload as { message?: string })?.message || 'Failed to submit form' }; // Set response as an object
      });
    },
  });
  
  const TaskFetchUserById = createSlice({
    name: 'users',
    initialState : initialFetchUserByIdState ,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTaskUserById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTaskUserById.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchTaskUserById.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })
        
    },
  });
  // export default TaskEditForm.reducer;

  export const { clearTaskEditData } = TaskEditForm.actions;
  export const { reducer: taskFormEditReducer } = TaskEditForm;
export const { reducer: taskFetchUserByIdReducer } = TaskFetchUserById;
