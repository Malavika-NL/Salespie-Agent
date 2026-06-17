

// import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// // import { error } from "console";


// interface FormData {
//  username: string;
//  password:any;
//  employeeid: string;
//  role:string;
//  email:string;
// }




// export const registerForm = createAsyncThunk(
//     'form/registerForm',
//     async (formData: FormData) => {
//         const request = await axios.post('/register/', formData);
//         const response = await request.data;
//         console.log(response.data)
//         console.log("response")
//         localStorage.setItem('user', JSON.stringify(response));
//         return response;
//     })





// interface InitialStateData {
//     loading: boolean;
//     users: any; // Adjust as per your response structure
//     error: string | null;
//     data: { message: string };
// }





// const initialState: InitialStateData = {
//     loading: false,
//     users: null,
//     error: null,
//     data: { message: '' },
// };



// const RegisterForm = createSlice({
//     name: 'form',
//     initialState,
//     reducers: {
//         clearRegisterData(state) {
//             state.data = { message: '' }; // Reset the data
//           },
//     },
//     extraReducers: (builder) => {
//         builder
//         .addCase(registerForm.pending, state => {
//             state.loading = true;
//             state.users = null;
//             state.error = null;
//           })
//           .addCase(registerForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
//             state.loading = false;
//             state.users = action.payload; // If users should also be updated, adjust accordingly
//             state.error = null;
//             state.data = { message: action.payload.message }; // Set message from payload
//           })
//           .addCase(registerForm.rejected, (state, action) => {
//             state.loading = false;
//             state.users = null;
//             state.error = action.payload?.toString() || 'Failed to submit form';
//             state.data.message = (action.payload as { message?: string })?.message || 'Failed to submit form'; // Set message from error payload
//           });

//     },
// })

// export const { clearRegisterData } = RegisterForm.actions;
// // export const { reducer: opportunityFormReducer } = opportunityForm;
// export default RegisterForm.reducer;


import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface FormData {
  username: string;
  password: string;
  employeeid: string;
  role: string;
  email: string;
}

interface EditFormData {
  id: number;
  username: string;
  email: string;
  employeeid: string;
  role: string;
}

interface InitialStateData {
  loading: boolean;
  editLoading: boolean;
  deleteLoading: boolean;
  users: any;
  error: string | null;
  editError: string | null;
  deleteError: string | null;
  data: { message: string };
}

const initialState: InitialStateData = {
  loading: false,
  editLoading: false,
  deleteLoading: false,
  users: null,
  error: null,
  editError: null,
  deleteError: null,
  data: { message: '' },
};

const formatApiError = (payload: unknown, fallback: string): string => {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (Array.isArray(payload)) {
    return payload.map(item => String(item)).join(' ') || fallback;
  }

  if (typeof payload === 'object') {
    const response = payload as Record<string, unknown>;
    const nestedErrors = response.errors;

    if (nestedErrors) {
      const nestedMessage = formatApiError(nestedErrors, '');
      if (nestedMessage) return nestedMessage;
    }

    const directMessage = response.detail || response.message;
    if (typeof directMessage === 'string' && directMessage.trim() && directMessage.trim() !== 'Failed') {
      return directMessage.trim();
    }

    const messages = Object.entries(response)
      .filter(([key]) => key !== 'message' && key !== 'detail')
      .flatMap(([field, value]) => {
        const label = field
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase())
          .replace('Employeeid', 'Employee ID');

        if (Array.isArray(value)) {
          return value.map(item => `${label}: ${String(item)}`);
        }

        if (value && typeof value === 'object') {
          const nested = formatApiError(value, '');
          return nested ? [`${label}: ${nested}`] : [];
        }

        return [`${label}: ${String(value)}`];
      });

    return messages.join(' ') || fallback;
  }

  return fallback;
};

// ── Register ──
export const registerForm = createAsyncThunk(
  'form/registerForm',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const request = await axios.post('/api/register/', formData);
      const response = request.data;
      console.log("Registration response:", response);
      return response;
    } catch (error: any) {
      console.warn("Registration failed:", formatApiError(error.response?.data, 'Registration failed'));
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

// ── Edit User ──
export const editUser = createAsyncThunk(
  'form/editUser',
  async (formData: EditFormData, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.userLoginAuth.user.tokens?.access; // ← get token from Redux
      const { id, ...data } = formData;
      const request = await axios.put(`/api/users/${id}/`, data, {
        headers: { Authorization: `Bearer ${token}` }, // ← add auth header
      });
      return request.data;
    } catch (error: any) {
      console.error("Edit error details:", error.response?.data);
      return rejectWithValue(error.response?.data || 'Failed to update user');
    }
  }
);

// ── Delete User ──
export const deleteUser = createAsyncThunk(
  'form/deleteUser',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state: any = getState();
      const token = state.userLoginAuth.user.tokens?.access; // ← get token from Redux
      await axios.delete(`/api/users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }, // ← add auth header
      });
      return id;
    } catch (error: any) {
      console.error("Delete error details:", error.response?.data);
      return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
  }
);

const RegisterForm = createSlice({
  name: 'form',
  initialState,
  reducers: {
    clearRegisterData(state) {
      state.data = { message: '' };
      state.error = null;
      state.editError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Register Cases ──
      .addCase(registerForm.pending, (state) => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(registerForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
        state.data = { message: action.payload.message };
      })
      .addCase(registerForm.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        const message = formatApiError(action.payload, 'Failed to submit form');
        state.error = message;
        state.data.message = message;
      })

      // ── Edit Cases ──
      .addCase(editUser.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(editUser.fulfilled, (state) => {
        state.editLoading = false;
        state.editError = null;
        state.data = { message: 'User updated successfully.' };
      })
      .addCase(editUser.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = formatApiError(action.payload, 'Failed to update user');
      })

      // ── Delete Cases ──
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.data = { message: 'User deleted successfully.' };
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = formatApiError(action.payload, 'Failed to delete user');
      });
  },
});

export const { clearRegisterData } = RegisterForm.actions;
export default RegisterForm.reducer;
