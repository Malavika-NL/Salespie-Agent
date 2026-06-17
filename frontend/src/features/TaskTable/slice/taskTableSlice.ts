import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';

interface TaskForm {
  id:string;
  task: string;
  description:string;
  start_date:string;
  end_date:string;
  assigned_to:string;
  status:string | null;
  outcome:string | null;
  last_update_date:string | null;
}


export const taskFormData = createAsyncThunk(
  'form/taskForm',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      // console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/show-all-task-data/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log(response)
      const data: TaskForm[] = await response.json();
      console.log(data)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
)



interface TaskTableState {
  loading: boolean;
  totaldata: TaskForm[];
  error: string | null;
}

const initialState: TaskTableState = {
  loading: false,
  totaldata: [],
  error: null,
};

const taskData = createSlice({
  name: 'targetTable',
  initialState,
  reducers: {
    clearTableData(state) {
      state.totaldata = []; // Clear data by setting it to null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(taskFormData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(taskFormData.fulfilled, (state, action: PayloadAction<TaskForm[]>) => {
        state.loading = false;
        state.totaldata = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(taskFormData.rejected, (state, action) => {
        state.loading = false;
        state.totaldata = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});


export const { clearTableData } = taskData.actions;
export default taskData.reducer;
