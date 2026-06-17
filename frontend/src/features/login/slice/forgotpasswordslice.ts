import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';

// Uses the shared axiosInstance (baseURL: '/api') so requests go through
// the Vite proxy to Django at http://127.0.0.1:8000 — same as all other slices.

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const sendForgotPasswordOTP = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>('forgotPassword/sendOTP', async ({ email }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/forgot-password/', { email });
    return res.data;
  } catch (error: any) {
    const errors = error?.response?.data?.errors;
    const msg =
      (Array.isArray(errors?.non_field_errors) ? errors.non_field_errors[0] : null) ||
      error?.response?.data?.message ||
      error?.message ||
      'Failed to send OTP.';
    return rejectWithValue(typeof msg === 'string' ? msg : 'Failed to send OTP.');
  }
});

export const verifyOTP = createAsyncThunk<
  { message: string },
  { email: string; otp: string },
  { rejectValue: string }
>('forgotPassword/verifyOTP', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/verify-otp/', { email, otp });
    return res.data;
  } catch (error: any) {
    const errors = error?.response?.data?.errors;
    const msg =
      (Array.isArray(errors?.non_field_errors) ? errors.non_field_errors[0] : null) ||
      error?.response?.data?.message ||
      error?.message ||
      'Invalid or expired OTP.';
    return rejectWithValue(typeof msg === 'string' ? msg : 'Invalid or expired OTP.');
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { email: string; otp: string; new_password: string; confirm_password: string },
  { rejectValue: string }
>('forgotPassword/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/reset-password/', payload);
    return res.data;
  } catch (error: any) {
    const errors = error?.response?.data?.errors;
    const msg =
      (Array.isArray(errors?.non_field_errors) ? errors.non_field_errors[0] : null) ||
      error?.response?.data?.message ||
      error?.message ||
      'Failed to reset password.';
    return rejectWithValue(typeof msg === 'string' ? msg : 'Failed to reset password.');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

interface ForgotPasswordState {
  loading: boolean;
  error: string | null;
  step: 'email' | 'otp' | 'reset' | 'done';
  email: string;
}

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  step: 'email',
  email: '',
};

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    setForgotEmail(state, action) {
      state.email = action.payload;
    },
    resetForgotPasswordState(state) {
      state.loading = false;
      state.error = null;
      state.step = 'email';
      state.email = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendForgotPasswordOTP.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(sendForgotPasswordOTP.fulfilled, (state) => { state.loading = false; state.step = 'otp'; })
      .addCase(sendForgotPasswordOTP.rejected,  (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to send OTP.'; });

    builder
      .addCase(verifyOTP.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(verifyOTP.fulfilled, (state) => { state.loading = false; state.step = 'reset'; })
      .addCase(verifyOTP.rejected,  (state, action) => { state.loading = false; state.error = action.payload ?? 'Invalid OTP.'; });

    builder
      .addCase(resetPassword.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(resetPassword.fulfilled, (state) => { state.loading = false; state.step = 'done'; })
      .addCase(resetPassword.rejected,  (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to reset password.'; });
  },
});

export const { setForgotEmail, resetForgotPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;