import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../../app/store';



export const fetchTodaysTasksData = createAsyncThunk<any[], void>(
  'data/fetchTodaysTasksData',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      console.log( 'tokens ', tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/todaystasks/', {
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




interface TodaysTasksState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: TodaysTasksState = {
  loading: false,
  data: [],
  error: null,
};

const TodaysTasks = createSlice({
  name: 'TodaysTasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaysTasksData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchTodaysTasksData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchTodaysTasksData.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default TodaysTasks.reducer;
