import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../../app/store';



export const fetchTaskDetails = createAsyncThunk<any[], void>(
  'data/fetchTaskWorkspaceDetails',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      console.log( 'tokens ', tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('/api/task-data/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      // console.log(response)
      const data: any[] = await response.json();
      // console.log(data)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);




interface TaskDetailsState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: TaskDetailsState = {
  loading: false,
  data: [],
  error: null,
};

const taskDetails = createSlice({
  name: 'TaskWorkspaceDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskDetails.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchTaskDetails.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchTaskDetails.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default taskDetails.reducer;
