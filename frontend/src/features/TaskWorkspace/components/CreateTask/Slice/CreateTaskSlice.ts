

import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { error } from "console";
import type { RootState } from "../../../../../app/store";



interface FormData {
    task: string;
    description:string;
    start_date:string;
    end_date:string;
    priority:string;
    // status:string;
    // outcome:string;
    assignedto:number;

}






    export const createTask = createAsyncThunk(
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
              const response = await axios.post('/api/task-data/', formData, {
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
    Taskdata: { message: string };
}





const initialState: InitialStateData = {
    users: null,
    loading: false,
    error: null,
    Taskdata: { message: '' },
};



const CreateTask = createSlice({
    name: 'form',
    initialState,
    reducers: {
      clearTaskData(state) {
        state.Taskdata = { message: '' }; // Reset the data
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(createTask.pending, state => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.Taskdata = { message: action.payload.message }; // Set message from payload
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.Taskdata = { message: '' }; // Reset message on failure
      });

    },
})

export const { clearTaskData } = CreateTask.actions;
// export const { reducer: opportunityFormReducer } = opportunityForm;
export default CreateTask.reducer;
