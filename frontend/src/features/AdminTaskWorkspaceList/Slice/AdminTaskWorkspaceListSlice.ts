import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';

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


export const taskAdminFormData = createAsyncThunk(
  'form/taskAdminFormData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/show-all-task-data/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
  }}
)



interface TaskTableState {
  loading: boolean;
  taskdata: any[];
  error: string | null;
}

const initialState: TaskTableState = {
  loading: false,
  taskdata: [],
  error: null,
};

const AdminTaskData = createSlice({
  name: 'taskAdminFormtable',
  initialState,
  reducers: {
    clearAdminTableData(state) {
      state.taskdata = []; // Clear data by setting it to null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(taskAdminFormData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(taskAdminFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.taskdata = action.payload;
        state.error = null; // Clear any previous errors
      })
      .addCase(taskAdminFormData.rejected, (state, action) => {
        state.loading = false;
        state.taskdata = [];
        state.error = action.error.message || 'Unknown error';
      });
  },
});



export const deleteAdminTaskWorkspaceTableData = createAsyncThunk(
  'data/deleteAdminTaskWorkspaceTableData',
  async (id: number, { rejectWithValue }) => {
      try {
          const response = await axiosInstance.delete(`/tasks/delete/${id}/`);
          return response.data;
      } catch (error: any) {
          return rejectWithValue(
              error.response?.data || 'Failed to fetch Opportunity data'
          );
      }
  }
);



interface DeleteTaskTableState {
    loading: boolean;
    delteData: any[];
    response: { message: string };
    error: string | null;
}

const initialDeleteTaskTableState: DeleteTaskTableState = {
    loading: false,
    delteData: [],
    error: null,
    response: { message: '' },
};

const AdminDeleteTaskWorkspaceTableData = createSlice({
    name: 'AdminDeleteTaskWorkspaceTableData',
    initialState: initialDeleteTaskTableState,
    reducers: { clearResponse(state) {
        state.response = { message: '' }; // Reset the data
      },},
    extraReducers: (builder) => {
        builder
            .addCase(deleteAdminTaskWorkspaceTableData.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminTaskWorkspaceTableData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.loading = false;
                state.response = { message: action.payload.message };
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminTaskWorkspaceTableData.rejected, (state, action) => {
                // console.error('Error fetching Opportunity data:', action.error.message);
                state.loading = false;
                state.response = { message: 'failed' };
                state.error = action.error.message || 'Unknown error';
            });
    },
});


export const { clearAdminTableData } = AdminTaskData.actions;
// export default AdminTaskData.reducer;
export const {clearResponse} = AdminDeleteTaskWorkspaceTableData.actions;

export const { reducer: deleteAdminTaskWorkspaceTableDataReducer } = AdminDeleteTaskWorkspaceTableData;
export const { reducer: fetchAdminTaskDataReducer } = AdminTaskData;
