

import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { error } from "console";
import type { RootState } from "../../../app/store";


interface FormData {
    task: string;
    description:string;
    start_date:string;
    end_date:string;
    assigned_to:string;
    // status:string | null;
    // outcome:string | null;
    // last_update_date:string | null;
}






    export const taskForm = createAsyncThunk(
        'form/taskForm',
        async (formData: FormData, { rejectWithValue, getState }) => {
            try {
              const state = getState() as RootState;
              const tokenData = state.userLoginAuth.user.tokens;
              console.log(tokenData)
              if (!tokenData.access) {
                throw new Error('No access token available');
              }
            //   console.log(tokenData.access)
              const response = await axios.post('http://localhost:8000/task-data/', formData, {
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



const TaskForm = createSlice({
    name: 'form',
    initialState,
    reducers: {
      clearTaskData(state) {
        state.data = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(taskForm.pending, state => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(taskForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message }; // Set message from payload
      })
      .addCase(taskForm.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data = { message: '' }; // Reset message on failure
      });

    },
})

export const { clearTaskData } = TaskForm.actions;
// export const { reducer: opportunityFormReducer } = opportunityForm;
export default TaskForm.reducer;
