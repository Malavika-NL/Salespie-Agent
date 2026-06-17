import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';



interface OpportunityTableState {
    loading: boolean;
    data: any[];
    message: { message: string };
    error: string | null;
}

const initialState: OpportunityTableState = {
    loading: false,
    data: [],
    message: { message: '' },
    error: null,
};

export const fetchAdminOpportunityWorkspaceTableData = createAsyncThunk<any[], void>(
    'data/fetchAdminOpportunityWorkspaceTableData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/opportunities/');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Failed to fetch Opportunity data'
            );
        }
    }
);



export const deleteAdminOpportunityWorkspaceTableData = createAsyncThunk(
    'data/deleteAdminOpportunityWorkspaceTableData',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/opportunities/delete/${id}/`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || 'Failed to fetch Opportunity data'
            );
        }
    }
);




const AdminOpportunityWorkspaceTableData = createSlice({
    name: 'adminOpportunityWorkspaceTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminOpportunityWorkspaceTableData.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchAdminOpportunityWorkspaceTableData.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchAdminOpportunityWorkspaceTableData.rejected, (state, action) => {
                // console.error('Error fetching Opportunity data:', action.error.message);
                state.loading = false;
                state.data = [];
                state.error = action.error.message || 'Unknown error';
            });
    },
});



interface DeleteOpportunityTableState {
    loading: boolean;
    delteData: any[];
    response: { message: string };
    error: string | null;
}

const initialDeleteOpportunityTableState: DeleteOpportunityTableState = {
    loading: false,
    delteData: [],
    error: null,
    response: { message: '' },
};

const AdminDeleteOpportunityWorkspaceTableData = createSlice({
    name: 'AdminDeleteOpportunityWorkspaceTableData',
    initialState: initialDeleteOpportunityTableState,
    reducers: { clearResponse(state) {
        state.response = { message: '' }; // Reset the data
      },},
    extraReducers: (builder) => {
        builder
            .addCase(deleteAdminOpportunityWorkspaceTableData.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminOpportunityWorkspaceTableData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                state.loading = false;
                state.response = { message: action.payload.message };
                state.error = null; // Clear any previous errors
            })
            .addCase(deleteAdminOpportunityWorkspaceTableData.rejected, (state, action) => {
                // console.error('Error fetching Opportunity data:', action.error.message);
                state.loading = false;
                state.response = { message: 'failed' };
                state.error = action.error.message || 'Unknown error';
            });
    },
});

// export default AdminOpportunityWorkspaceTableData.reducer;

export const { clearResponse } = AdminDeleteOpportunityWorkspaceTableData.actions;

export const { reducer: deleteAdminOpportunityWorkspaceTableDataReducer } = AdminDeleteOpportunityWorkspaceTableData;
export const { reducer: fetchAdminOpportunityWorkspaceTableDataReducer } = AdminOpportunityWorkspaceTableData;
