

import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { setTokens } from "./authslice";
import type { RootState } from "../../app/store";
import type { Token } from "./authTypes";
import { getStoredJSON, getStoredToken, setStoredJSON } from "../../app/storage";

interface AuthState {
  token: Token | null;
  loading: boolean;
  error: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: getStoredToken(),
  loading: false,
  error: null,
  user: getStoredJSON("user"),
};

export const refreshTokenReq = createAsyncThunk(
  "auth/refreshTokenReq",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user?.tokens ?? getStoredToken();

      if (!tokenData) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: tokenData.refresh,
      });

      if (response.status !== 200) {
        throw new Error("Failed to refresh token");
      }

      const { access } = response.data;
      const nextTokens = {
        ...(getStoredToken() ?? tokenData),
        access,
      };
      setStoredJSON("jwt-token", nextTokens);
      dispatch(setTokens(nextTokens));
      return nextTokens;
    } catch (error: any) {
      console.error("Error during token refresh:", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const refreshToken = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshTokenReq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenReq.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(refreshTokenReq.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export default refreshToken.reducer;
