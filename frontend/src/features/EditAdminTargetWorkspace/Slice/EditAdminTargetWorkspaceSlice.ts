

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
  activity: string;
  activity_date: string;
  next_action: string;
  remarks: string;
  next_action_date: string;
  acct_created_date: string ;
  last_update: string | null;
}
interface FormData extends AccountDetailsValues {
  targetcontacts: Contact[]; // Update to include contacts array
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
  id:'',
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
  activity: '',
  activity_date: '',
  next_action: '',
  remarks: '',
  next_action_date: '',
  acct_created_date: '',
  last_update: '',
  targetcontacts: [], // Initializing as empty array
  finance: [],  // Initializing as empty array
  company: [],  // Initializing as empty array
};

const initialState: InitialStateData = {
  formValues: null,
  users: null,
  loading: false,
  error: null,
  data: { message: '' },
  formData: initialFormData,
};

  export const fetchAdminTargetWorkspaceUserById = createAsyncThunk(
    'users/fetchAdminTargetWorkspaceUserById',
    async (id: string, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
        // Make the GET request with the Authorization header
        const response = await axios.get(`/api/show-all-target-data/${id}/`, {
          headers: {
            Authorization: `Bearer ${tokenData}`,
          },
        });
  
        // console.log( 'account end point data', response.data);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const editAdminTargetWorkspaceUser = createAsyncThunk(
    'users/editAccountWorkspaceUser',
    async ({  formData }: {  formData: FormData }, { rejectWithValue,getState }) => {
      try {
        // Retrieve the token (from store, local storage, etc.)
        const state = getState() as RootState;
        const tokenData = state.userLoginAuth.user.tokens.access;
  
  
        // Make the PUT request with the Authorization header
        const response = await axios.put(`/api/show-all-target-data/${formData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${tokenData}`,
          },
        });
        console.log('account end point data',response)
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  

   const AdminTargetWorkspaceEditForm = createSlice({
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
          //  addContact: (state, action: PayloadAction<Contact>) => {
          //   if (state.formData) {
          //     if (!state.formData.contacts) {
          //       state.formData.contacts = [];
          //     }
          //     state.formData.contacts.push(action.payload);
          //   }
          // },
          addContact: (state, action: PayloadAction<Contact>) => {
            if (state.formData) {
              if (!state.formData.targetcontacts) {
                state.formData.targetcontacts = [];
              }
              state.formData.targetcontacts.push(action.payload);
            }
          },
       
          //  updateContact: (
          //    state,
          //    action: PayloadAction<{ updatedContact: Contact; index: number }>
          //  ) => {
          //    if (state.formData) {
          //      const { updatedContact, index } = action.payload;
          //      if (index >= 0 && index < state.formData.contacts.length) {
          //        state.formData.contacts[index] = updatedContact;
          //      }
          //    }
          //  },
          updateContact: (state, action: PayloadAction<{ updatedContact: Contact; index: number }>) => {
            if (state.formData) {
              const { updatedContact, index } = action.payload;
              if (!state.formData.targetcontacts) return;
              if (index >= 0 && index < state.formData.targetcontacts.length) {
                state.formData.targetcontacts[index] = updatedContact;
              }
            }
          },
       
       
       
           submitForm(state) {
             if (state.formData) {
               console.log('end point', state.formData)
               editAdminTargetWorkspaceUser(state.formData as any); // Call the async thunk with formData
             }
           },
       
         },
       extraReducers: (builder) => {
         
   
                builder
                     .addCase(editAdminTargetWorkspaceUser.pending, (state) => {
                       state.loading = true;
                       state.users = null;
                       state.error = null;
                     })
                     .addCase(editAdminTargetWorkspaceUser.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                       
                       state.loading = false;
                       state.error = null;
                       state.data = { message: action.payload.message };
                     })
                     .addCase(editAdminTargetWorkspaceUser.rejected, (state, action) => {
                       state.loading = false;
                       state.users = null;
                       state.error = action.payload?.toString() || 'Failed to submit form';
                       state.data = { message: '' };
                     })
               
                     .addCase(fetchAdminTargetWorkspaceUserById.pending, (state) => {
                       state.loading = true;
                       state.error = null;
                     })
                     .addCase(fetchAdminTargetWorkspaceUserById.fulfilled, (state, action: PayloadAction<FormData | null>) => {
                       console.log('recieved or Default Form Data:', action.payload);
                       state.loading = false;
                       state.formData = action.payload ? {
                        ...action.payload,
                        targetcontacts: action.payload.targetcontacts || [],
                        finance: action.payload.finance || [],
                        company: action.payload.company || [],
                      } : initialFormData;  // Fallback to initial data
                       console.log('Fetched or Default Form Data:', state.formData);
                     })
                     
                     .addCase(fetchAdminTargetWorkspaceUserById.rejected, (state, action) => {
                       state.loading = false;
                       state.error = action.payload?.toString() || 'Failed to fetch opportunity data';
                     });
       },
   });
   
   
   // export default AccountEditForm.reducer;
   export const { clearAccountData, setFormData, addFinanceDetails, addCompanyDetails, addContact, updateContact, submitForm } = AdminTargetWorkspaceEditForm.actions;
   export default AdminTargetWorkspaceEditForm.reducer;
