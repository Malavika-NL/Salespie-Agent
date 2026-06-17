

import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { error } from "console";
import { setTokens } from "../../Authslice/authslice";
import type { Token } from "../../Authslice/authTypes";
import { getStoredJSON, setStoredJSON } from "../../../app/storage";


interface FormData {
  username:string;
  password:string;
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


// export const adminLoginData = createAsyncThunk(
//     'form/adminData',
//     async (formData: FormData, { dispatch, rejectWithValue }) => {
//         try {
//             const request = await axios.post("http://localhost:8000/Adminlogin/", formData);
//             if (!request || !request.data) {
//               throw new Error("Invalid response from server");
//             }
//             const response = request.data;
//             localStorage.setItem("user", JSON.stringify(response));
//             localStorage.setItem("jwt-token", response.tokens);
      
//             dispatch(setTokens(response.tokens));
      
//             return response;
//           } catch (error: any) {
//             console.error("Error during login:", error);
//             if (error.response && error.response.data) {
//               return rejectWithValue(error.response.data);
//             }
//             return rejectWithValue(error.message);
//           }
//     })

    export const adminLoginData = createAsyncThunk(
      "auth/adminData",
      async (formData: FormData, { dispatch, rejectWithValue }) => {
        try {
          const request = await axios.post("http://localhost:8000/manager/login/", formData);
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








const AdminLogin = createSlice({
    name: 'form',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminLoginData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminLoginData.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.tokens;
                state.error = null;
              })
              .addCase(adminLoginData.rejected, (state, action: PayloadAction<any>) => {
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
})

// export const { reducer: accountFormReducer } = AccountForm;
export default AdminLogin.reducer;
