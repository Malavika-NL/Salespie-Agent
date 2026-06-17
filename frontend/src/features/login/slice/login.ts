// import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { setTokens } from "../../Authslice/authslice";
// import type { Token } from "../../Authslice/authTypes";

// interface FormData {
//   email: string;
//   password: string;
// }

// export interface LoginResponse {
//   message: string;
//   username: string;
//   email: string;
//   role: string | null;
//   tokens: Token;
// }

// interface AuthState {
//   token: Token | null;
//   loading: boolean;
//   error: string | null;
//   user: LoginResponse | null;
// }

// const getStoredItem = <T>(key: string): T | null => {
//   const item = localStorage.getItem(key);
//   return item ? (JSON.parse(item) as T) : null;
// };

// const initialState: AuthState = {
//   token: getStoredItem<Token>("jwt-token"),
//   loading: false,
//   error: null,
//   user: getStoredItem<LoginResponse>("user"),
// };

// export const loginData = createAsyncThunk<
//   LoginResponse,
//   FormData,
//   { rejectValue: string }
// >("auth/loginData", async (formData, { dispatch, rejectWithValue }) => {
//   try {
//     const request = await axios.post<LoginResponse>("/login/", formData);

//     if (!request?.data) {
//       throw new Error("Invalid response from server");
//     }

//     const response = request.data;

//     localStorage.setItem("user", JSON.stringify(response));
//     localStorage.setItem("refresh-token", response.tokens.refresh);
//     localStorage.setItem("jwt-token", JSON.stringify(response.tokens));

//     dispatch(setTokens(response.tokens));

//     return response;
//   } catch (error: any) {
//     console.error("Error during login:", error);

//     if (typeof error?.response?.data?.message === "string") {
//       return rejectWithValue(error.response.data.message);
//     }

//     if (typeof error?.message === "string") {
//       return rejectWithValue(error.message);
//     }

//     return rejectWithValue("Unable to login with the provided credentials.");
//   }
// });

// export const logout = createAsyncThunk("auth/logout", async () => {
//   localStorage.removeItem("user");
//   localStorage.removeItem("jwt-token");
//   localStorage.removeItem("refresh-token");
// });

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginData.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.token = action.payload.tokens;
//         state.error = null;
//       })
//       .addCase(loginData.rejected, (state, action) => {
//         state.loading = false;
//         state.user = null;
//         state.token = null;
//         state.error = action.payload ?? "Unable to login with the provided credentials.";
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.loading = false;
//         state.error = null;
//       });
//   },
// });

// export default authSlice.reducer;


import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { setTokens } from "../../Authslice/authslice";
import type { Token } from "../../Authslice/authTypes";
import { getStoredJSON, setStoredJSON } from "../../../app/storage";

interface FormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  username: string;
  email: string;
  role: string | null;
  tokens: Token;
}

interface AuthState {
  token: Token | null;
  loading: boolean;
  error: string | null;
  user: LoginResponse | null;
}

const getStoredItem = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: getStoredJSON<Token>("jwt-token"),
  loading: false,
  error: null,
  user: getStoredJSON<LoginResponse>("user"),
};

export const loginData = createAsyncThunk<
  LoginResponse,
  FormData,
  { rejectValue: string }
>("auth/loginData", async (formData, { dispatch, rejectWithValue }) => {
  try {
    const request = await axios.post<LoginResponse>("/login/", formData);

    if (!request?.data) {
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

    const nonFieldErrors = error?.response?.data?.errors?.non_field_errors;
    if (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === "string") {
      return rejectWithValue(nonFieldErrors[0]);
    }

    if (typeof error?.response?.data?.errors?.email?.[0] === "string") {
      return rejectWithValue(error.response.data.errors.email[0]);
    }

    if (typeof error?.response?.data?.errors?.username?.[0] === "string") {
      return rejectWithValue(error.response.data.errors.username[0]);
    }

    if (typeof error?.response?.data?.password?.[0] === "string") {
      return rejectWithValue(error.response.data.password[0]);
    }

    if (typeof error?.response?.data?.errors === "string") {
      return rejectWithValue(error.response.data.errors);
    }

    if (typeof error?.response?.data?.message === "string") {
      return rejectWithValue(error.response.data.message);
    }

    if (typeof error?.message === "string") {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Unable to login with the provided credentials.");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwt-token");
  localStorage.removeItem("refresh-token");
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
      .addCase(loginData.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.tokens;
        state.error = null;
      })
      .addCase(loginData.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload ?? "Unable to login with the provided credentials.";
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
