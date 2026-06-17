


import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../app/store';



// interface FormData {
//   id:string;
//   task: string;
//   description:string;
//   start_date:string;
//   end_date:string;
//   assigned_to:string;
//   status:string | null;
//   outcome:string | null;
//   last_update_date:string | null;

// }



interface UserState {
    data: any[];
    selectedUser: FormData | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: UserState = {
    data: [],
    selectedUser: null,
    loading: false,
    error: null,
  };

export const fetchTaskUserById = createAsyncThunk(
    'users/fetchLeadUserById',
    async (id: string, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        // Make the GET request with the Authorization header
        const response = await axios.get(`https://api.countrystatecity.in/v1/countries`, {
          headers: {
            'X-CSCAPI-KEY': 'API_KEY'
          },
        });
  
        console.log(response);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );

    
  const CommonApi = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTaskUserById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTaskUserById.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchTaskUserById.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })
       
    },
  });
  
  export default CommonApi.reducer;
