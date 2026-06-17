import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../../app/store';



export const fetchTaskAssignedByMeDetails = createAsyncThunk<any[], void>(
  'data/fetchTaskAssignedByMeDetails',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      // console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/tasks/assigned-by-me/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log( 'task assigned by me', response)
      const data: any[] = await response.json();
      // console.log(data)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);




interface TaskAssignedByMeDetailsState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: TaskAssignedByMeDetailsState = {
  loading: false,
  data: [],
  error: null,
};

const taskAssignedByMe = createSlice({
  name: 'TaskAssignedByMeDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskAssignedByMeDetails.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchTaskAssignedByMeDetails.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchTaskAssignedByMeDetails.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default taskAssignedByMe.reducer;
