

import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { error } from "console";
import type { RootState } from "../../../../../app/store";



interface FormData {
  id: any;
 
  status: string;
  outcome: string;
  

}






export const updateTaskWorkspaceStatusData = createAsyncThunk(
  'form/updateTaskWorkspaceStatusData',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      console.log('to be updateed', formData)
      const response = await axios.put(`http://localhost:8000/tasks/${formData.id}/`, formData, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log('updated taskkk : ', response)
      return response.data; // Assuming your response data structure here
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
    }
  }
)





interface InitialStateData {
  formValues: any;
  loading: boolean;
  error: string | null;
  users: null | string;
  data: { message: string };
  formData: FormData | null;  // Ensure this line exists
}

const initialFormData: FormData = {
  id: '',
  status: '',
  outcome: '',
  

}


const initialState: InitialStateData = {
  formValues: null,
  users: null,
  loading: false,
  error: null,
  data: { message: '' },
  formData: initialFormData,
};



const updateTaskWorkspace = createSlice({
  name: 'TaskStatus',
  initialState,
  reducers: {
    updateStatus(state, action: PayloadAction<FormData>) {
      if (state.formData) {
        state.formData = action.payload;
        console.log("Updated Status:", state.formData);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTaskWorkspaceStatusData.pending, (state) => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(updateTaskWorkspaceStatusData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {

        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message };
      })
      .addCase(updateTaskWorkspaceStatusData.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data = { message: '' };
      })

  },
})


// export const { reducer: opportunityFormReducer } = opportunityForm;
export const {updateStatus} = updateTaskWorkspace.actions;
export default updateTaskWorkspace.reducer;
