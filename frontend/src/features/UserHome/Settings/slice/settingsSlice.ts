// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axiosInstance from '../../../../app/axiosInstance';

// // ─── Thunk ────────────────────────────────────────────────────────────────────

// export const changePassword = createAsyncThunk<
//   { message: string },
//   { old_password: string; new_password: string; confirm_password: string },
//   { rejectValue: string }
// >('settings/changePassword', async (payload, { rejectWithValue }) => {
//   try {
//     const res = await axiosInstance.post('/change-password/', payload);
//     return res.data;
//   } catch (error: any) {
//     const errors = error?.response?.data?.errors;

//     // Handle field-level errors
//     if (errors?.old_password?.[0]) return rejectWithValue(errors.old_password[0]);
//     if (errors?.new_password?.[0]) return rejectWithValue(errors.new_password[0]);

//     const msg =
//       (Array.isArray(errors?.non_field_errors) ? errors.non_field_errors[0] : null) ||
//       error?.response?.data?.message ||
//       error?.message ||
//       'Failed to change password.';

//     return rejectWithValue(typeof msg === 'string' ? msg : 'Failed to change password.');
//   }
// });

// // ─── Slice ────────────────────────────────────────────────────────────────────

// interface SettingsState {
//   loading: boolean;
//   error: string | null;
//   success: string | null;
// }

// const initialState: SettingsState = {
//   loading: false,
//   error: null,
//   success: null,
// };

// const settingsSlice = createSlice({
//   name: 'settings',
//   initialState,
//   reducers: {
//     clearSettingsState(state) {
//       state.loading = false;
//       state.error = null;
//       state.success = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(changePassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(changePassword.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.message;
//         state.error = null;
//       })
//       .addCase(changePassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload ?? 'Failed to change password.';
//         state.success = null;
//       });
//   },
// });

// export const { clearSettingsState } = settingsSlice.actions;
// export default settingsSlice.reducer;


import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../../app/axiosInstance';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const changePassword = createAsyncThunk<
  { message: string },
  { old_password: string; new_password: string; confirm_password: string },
  { rejectValue: string }
>('settings/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/change-password/', payload);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to change password.');
  }
});

// NEW: Fetch employees for the dropdown
export const fetchPerfEmployees = createAsyncThunk('settings/fetchEmployees', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/users/');
    return res.data;
  } catch (error: any) {
    return rejectWithValue('Failed to fetch employees');
  }
});

// NEW: Fetch the attainment report
// export const fetchAttainmentReport = createAsyncThunk('settings/fetchReport', async (year: number, { rejectWithValue }) => {
//   try {
//     const res = await axiosInstance.get(`/performance-admin/attainment-report/?year=${year}`);
//     return res.data;
//   } catch (error: any) {
//     return rejectWithValue('Failed to fetch report');
//   }
// });
export const fetchAttainmentReport = createAsyncThunk(
  'settings/fetchAttainmentReport',
  async (year: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axiosInstance.get(
        `/performance-admin/attainment-report/?year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Failed to fetch attainment report.');
    }
  }
);
// NEW: Save performance quota
export const savePerformanceQuota = createAsyncThunk(
  'settings/saveQuota', 
  async (payload: { user_id: string; target_amount: string; year: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/performance-admin/save-quota/', payload);
      return res.data;
    } catch (error: any) {
      return rejectWithValue('Failed to save quota');
    }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

interface SettingsState {
  loading: boolean;
  perfLoading: boolean;
  error: string | null;
  success: string | null;
  employees: any[];
  reportData: any[];
}

const initialState: SettingsState = {
  loading: false,
  perfLoading: false,
  error: null,
  success: null,
  employees: [],
  reportData: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => { state.loading = true; })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Performance Reducers
      .addCase(fetchPerfEmployees.fulfilled, (state, action) => {
        const users = Array.isArray(action.payload) ? action.payload : [];
        state.employees = users.filter((u: any) => String(u?.role ?? '').toLowerCase() === 'user');
      })
      .addCase(fetchAttainmentReport.pending, (state) => { state.perfLoading = true; })
      .addCase(fetchAttainmentReport.fulfilled, (state, action) => {
        state.perfLoading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchAttainmentReport.rejected, (state) => { state.perfLoading = false; })
      .addCase(savePerformanceQuota.fulfilled, (state) => {
        state.success = "Quota updated successfully";
      });
  },
});

export const { clearSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
