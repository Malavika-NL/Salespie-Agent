import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';



export const fetchLeadWorkspaceList = createAsyncThunk<any[], void>(
  'data/fetchLeadWorkspaceList',
  async (_,{getState,rejectWithValue}) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      // console.log(tokenData)
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await fetch('http://localhost:8000/lead-data/', {
        headers: {
            'content-type' : 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log( 'end data ',response)
      const data: any[] = await response.json();
      console.log('end data ',data)
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
);



interface LeadTableState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: LeadTableState = {
  loading: false,
  data: [],
  error: null,
};

const LeadWorkspaceListData = createSlice({
  name: 'leadTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadWorkspaceList.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchLeadWorkspaceList.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchLeadWorkspaceList.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});

export default LeadWorkspaceListData.reducer;
