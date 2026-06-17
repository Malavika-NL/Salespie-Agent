// src/features/auth/authSlice.ts

import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Token } from './authTypes'

interface AuthState {
  tokens: Token | null;
}

const initialState: AuthState = {
  tokens: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token>) => {
      state.tokens = action.payload;
    },
    clearTokens: (state) => {
      state.tokens = null;
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;
