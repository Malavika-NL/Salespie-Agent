

import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes'


interface Contact {
    category: string;
    name: string;
    designation: string;
    mobile_no: string;
    email_id: string;
}

interface Finance {
    turn_over: number;
    account_resumable: number;
    credits: number;
}

interface Company {
    company_type: string;
    account_type: string;
    company_scale: string;
}

interface AccountDetailsValues {
    id:string;
    account_holder: string;
    account_name: string;
    department: string;
    vertical: string;
    vertical_sub: string ;
    pic: string;
    designation: string;
    business: string;
    region: string;
    mobile_number: string;
    email_id: string;
    location: string;
    state: string;
    city: string;
    address: string;
    acct_created_date: string | null;
    last_update: string | null;
  }
  
  interface FormData extends AccountDetailsValues {
    contacts: Contact[]; // Update to include contacts array
    finance: Finance[];  // Update to include finance array
    company: Company[];  // Update to include company array
  }


interface InitialStateData {
    formValues: any;
    loading: boolean;
    error: string | null;
    users: null | string;
    data: { message: string };
    formData: FormData | null;  // Ensure this line exists
}


const initialFormData: FormData = {
    id: '',
    account_holder: '',
    account_name: '',
    department: '',
    vertical: '',
    vertical_sub: '',
    pic: '',
    designation: '',
    business: '',
    region: '',
    mobile_number: '',
    email_id: '',
    location: '',
    state: '',
    city: '',
    address: '',
    acct_created_date: null,
    last_update: null,
    contacts: [], // Initializing as empty array
    finance: [],  // Initializing as empty array
    company: [
        {
            company_type: '',
            account_type: '',
            company_scale: '',
        }
    ],  // Initializing as empty array
};

const initialState: InitialStateData = {
    formValues: null,
    users: null,
    loading: false,
    error: null,
    data: { message: '' },
    formData: initialFormData,
};

export const editAccountWorkspaceFetchUserById = createAsyncThunk(
    'users/editAccountWorkspaceFetchUserById',
    async (id: string, { rejectWithValue, getState }) => {
        try {
            // Retrieve the token (from store, local storage, etc.)
            const state = getState() as RootState;
            const tokenData = state.userLoginAuth.user.tokens.access;

            // Make the GET request with the Authorization header
            const response = await axios.get(`/account-data/${id}/`, {
                headers: {
                    Authorization: `Bearer ${tokenData}`,
                },
            });

            console.log('account end point data', response);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
);

export const editPostAccountWorkspace = createAsyncThunk(
    'users/editPostAccountWorkspace',
    async ({ formData }: { formData: FormData }, { rejectWithValue, getState }) => {
        try {
            // Retrieve the token (from store, local storage, etc.)
            const state = getState() as RootState;
            const tokenData = state.userLoginAuth.user.tokens.access;


            // Make the PUT request with the Authorization header
            const response = await axios.put(`/account-data/${formData.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${tokenData}`,
                },
            });
            console.log(' account user', response)
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
);

const AccountWorkspaceEditForm = createSlice({
    name: 'users',
    initialState,
     reducers: {
        clearAccountData(state) {
          state.data = { message: '' }; // Reset the data
        },
        setFormData(state, action: PayloadAction<{ id: string; value: string | number }>) {
          if (!state.formData) {
            //   console.warn('formData is null or undefined');
            return;
          }
    
          const { id, value } = action.payload;
          // console.log('form action', action.payload);  // Check the payload here
    
          state.formData = {
            ...state.formData,
            [id]: value
          };
    
          // console.log('form data', state.formData);  // Check the updated formData
        },
        addFinanceDetails(state, action: PayloadAction<Finance>) {
          if (state.formData) {
            state.formData = {
              ...state.formData,
              finance: [action.payload]  // Add finance details
            };
          }
          // console.log(state.formData);  // Check the updated formData
        },
        addCompanyDetails(state, action: PayloadAction<Company>) {
          if (state.formData) {
            state.formData = {
              ...state.formData,
              company: [action.payload]  // Add finance details
            };
          }
          // console.log(state.formData);  
        },
        addContact: (state, action: PayloadAction<Contact>) => {
          if (state.formData) {
            state.formData.contacts.push(action.payload);
          }
        },
    
        updateContact: (
          state,
          action: PayloadAction<{ updatedContact: Contact; index: number }>
        ) => {
          if (state.formData) {
            const { updatedContact, index } = action.payload;
            if (index >= 0 && index < state.formData.contacts.length) {
              state.formData.contacts[index] = updatedContact;
            }
          }
        },
    
    
    
        submitForm(state) {
          if (state.formData) {
            console.log('end point', state.formData)
            editPostAccountWorkspace(state.formData as any); // Call the async thunk with formData
          }
        },
    
      },
    extraReducers: (builder) => {
      

             builder
                  .addCase(editPostAccountWorkspace.pending, (state) => {
                    state.loading = true;
                    state.users = null;
                    state.error = null;
                  })
                  .addCase(editPostAccountWorkspace.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                    
                    state.loading = false;
                    state.error = null;
                    state.data = { message: action.payload.message };
                  })
                  .addCase(editPostAccountWorkspace.rejected, (state, action) => {
                    state.loading = false;
                    state.users = null;
                    state.error = action.payload?.toString() || 'Failed to submit form';
                    state.data = { message: '' };
                  })
            
                  .addCase(editAccountWorkspaceFetchUserById.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(editAccountWorkspaceFetchUserById.fulfilled, (state, action: PayloadAction<FormData | null>) => {
                    console.log('recieved or Default Form Data:', action.payload);
                    state.loading = false;
                    state.formData = action.payload || initialFormData;  // Fallback to initial data
                    console.log('Fetched or Default Form Data:', state.formData);
                  })
                  
                  .addCase(editAccountWorkspaceFetchUserById.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.toString() || 'Failed to fetch opportunity data';
                  });
    },
});


// export default AccountEditForm.reducer;
export const { clearAccountData, setFormData, addFinanceDetails, addCompanyDetails, addContact, updateContact, submitForm } = AccountWorkspaceEditForm.actions;
export default AccountWorkspaceEditForm.reducer;
