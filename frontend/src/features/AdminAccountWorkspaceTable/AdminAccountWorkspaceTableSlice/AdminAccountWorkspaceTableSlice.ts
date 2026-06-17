import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';


interface AccountTableState {
    loading: boolean;
    data: any[];
    message: { message: string };
    error: string | null;
}

const initialState: AccountTableState = {
    loading: false,
    data: [],
    message: { message: '' },
    error: null,
};

export const fetchAdminAccountWorkspaceTableData = createAsyncThunk<any[], void>(
    'data/fetchAdminAccountWorkspaceTableData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/show-all-account-data/');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to submit form');
        }
    }
);








const AdminAccountWorkspaceTableData = createSlice({
    name: 'adminAccountWorkspaceTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminAccountWorkspaceTableData.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchAdminAccountWorkspaceTableData.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchAdminAccountWorkspaceTableData.rejected, (state, action) => {
                // console.error('Error fetching account data:', action.error.message);
                state.loading = false;
                state.data = [];
                state.error = action.error.message || 'Unknown error';
            });
    },
});



export const deleteAdminAccountWorkspaceTableData = createAsyncThunk(
    'data/deleteAdminAccountWorkspaceTableData',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/delete-account/${id}/`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Failed to fetch account data'
            );
        }
    }
);

interface DeleteAccountTableState {
    loading: boolean;
    delteData: any[];
    response: { message: string };
    error: string | null;
}

const initialDeleteAccountTableState: DeleteAccountTableState = {
    loading: false,
    delteData: [],
    error: null,
    response: { message: '' },
};

const AdminDeleteAccountWorkspaceTableData = createSlice({
    name: 'AdminDeleteAccountWorkspaceTableData',
    initialState: initialDeleteAccountTableState,
    reducers: { clearResponse(state) {
        state.response = { message: '' }; // Reset the data
      },},
    extraReducers: (builder) => {
        builder
            .addCase(deleteAdminAccountWorkspaceTableData.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminAccountWorkspaceTableData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.loading = false;
                state.response = { message: action.payload.message };
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminAccountWorkspaceTableData.rejected, (state, action) => {
                // console.error('Error fetching account data:', action.error.message);
                state.loading = false;
                state.response = { message: 'failed' };
                state.error = action.error.message || 'Unknown error';
            });
    },
});

// export default AdminAccountWorkspaceTableData.reducer;

export const {clearResponse} = AdminDeleteAccountWorkspaceTableData.actions;

export const { reducer: deleteAdminAccountWorkspaceTableDataReducer } = AdminDeleteAccountWorkspaceTableData;
export const { reducer: fetchAdminAccountWorkspaceTableDataReducer } = AdminAccountWorkspaceTableData;
