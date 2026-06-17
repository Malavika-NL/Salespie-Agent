import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';


export const fetchAdminLeadWorkspaceList = createAsyncThunk<any[], void>(
  'data/fetchAdminLeadWorkspaceList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/show-all-lead/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch account data'
      );
    }
  }
);

interface AdminLeadWorkspaceListState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: AdminLeadWorkspaceListState = {
  loading: false,
  data: [],
  error: null,
};

const AdminLeadWorkspaceListData = createSlice({
  name: 'AdminLeadWorkspaceListData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminLeadWorkspaceList.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAdminLeadWorkspaceList.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAdminLeadWorkspaceList.rejected, (state, action) => {
        console.error('Error fetching account data:', action.error.message);
        state.loading = false;
        state.data = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});



export const deleteAdminLeadWorkspaceTableData = createAsyncThunk(
  'data/deleteAdminLeadWorkspaceTableData',
  async (id: string, { rejectWithValue }) => {
      try {
          const response = await axiosInstance.delete(`/leads/delete/${id}/`);
          return response.data;
      } catch (error: any) {
          return rejectWithValue(
              error.response?.data || 'Failed to fetch Opportunity data'
          );
      }
  }
);



interface DeleteLeadTableState {
    loading: boolean;
    delteData: any[];
    response: { message: string };
    error: string | null;
}

const initialDeleteLeadTableState: DeleteLeadTableState = {
    loading: false,
    delteData: [],
    error: null,
    response: { message: '' },
};

const AdminDeleteLeadWorkspaceTableData = createSlice({
    name: 'AdminDeleteLeadWorkspaceTableData',
    initialState: initialDeleteLeadTableState,
    reducers: { clearResponse(state) {
        state.response = { message: '' }; // Reset the data
      },},
    extraReducers: (builder) => {
        builder
            .addCase(deleteAdminLeadWorkspaceTableData.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminLeadWorkspaceTableData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.loading = false;
                state.response = { message: action.payload.message };
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminLeadWorkspaceTableData.rejected, (state, action) => {
                // console.error('Error fetching Opportunity data:', action.error.message);
                state.loading = false;
                state.response = { message: 'failed' };
                state.error = action.error.message || 'Unknown error';
            });
    },
});

// export default AdminLeadWorkspaceListData.reducer;


export const { clearResponse } = AdminDeleteLeadWorkspaceTableData.actions;

export const { reducer: deleteAdminLeadWorkspaceTableDataReducer } = AdminDeleteLeadWorkspaceTableData;
export const { reducer: fetchAdminLeadWorkspaceListReducer } = AdminLeadWorkspaceListData;
