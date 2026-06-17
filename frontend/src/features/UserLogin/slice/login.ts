// // src/features/auth/authSlice.ts

// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// interface FormData {
//   username: string;
//   password: string;
// }

// interface AuthState {
//   token: string | null;
//   loading: boolean;
//   error: string | null;
//   user: any | null;
// }

// const initialState: AuthState = {
//   token: localStorage.getItem("jwt-token"),
//   loading: false,
//   error: null,
//   user: JSON.parse(localStorage.getItem("user") || "null"),
// };

// export const loginData = createAsyncThunk(
//   "auth/loginData",
//   async (formData: FormData, { rejectWithValue }) => {
//     try {
//       const request = await axios.post("/login/", formData);
//       const response = request.data;
//       localStorage.setItem("user", JSON.stringify(response));
//       localStorage.setItem("jwt-token", response.tokens);
//       console.log(response)
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const logout = createAsyncThunk("auth/logout", async () => {
//   localStorage.removeItem("user");
//   localStorage.removeItem("jwt-token");
//   return;
// });

// const userLogin = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginData.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.token = action.payload.tokens;
//         state.error = null;
//       })
//       .addCase(loginData.rejected, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.user = null;
//         state.token = null;
//         state.error = action.payload;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.loading = false;
//         state.error = null;
//       });
//   },
// });

// export default userLogin.reducer;


import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { setTokens } from "../../Authslice/authslice";
import type { Token } from "../../Authslice/authTypes";
import { getStoredJSON, setStoredJSON } from "../../../app/storage";

interface FormData {
  username: string;
  password: string;
}

interface AuthState {
  token: Token | null;
  loading: boolean;
  error: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: getStoredJSON<Token>("jwt-token"),
  loading: false,
  error: null,
  user: getStoredJSON("user"),
};

export const loginData = createAsyncThunk(
  "auth/loginData",
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const request = await axios.post("/login/", formData);
      if (!request || !request.data) {
        throw new Error("Invalid response from server");
      }
      const response = request.data;
      setStoredJSON("user", response);
      localStorage.setItem("refresh-token", response.tokens.refresh);
      setStoredJSON("jwt-token", response.tokens);

      dispatch(setTokens(response.tokens));

      return response;
    } catch (error: any) {
      console.error("Error during login:", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwt-token");
  localStorage.removeItem("refresh-token");
  return;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.tokens;
        state.error = null;
      })
      .addCase(loginData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
