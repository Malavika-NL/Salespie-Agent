

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
  acct_created_date: string | null;
  last_update: string | null;
  }
  
interface FormData extends AccountDetailsValues {
    targetcontacts: Contact[]; // Update to include contacts array
  
  }

const CONTACT_CATEGORY_CODES = new Set([
  'plant_head', 'purchase_head', 'it_head', 'quality_head', 'production_head',
  'plant_pic', 'purchase_pic', 'it_pic', 'quality_pic', 'production_pic',
]);

const CONTACT_CATEGORY_LABEL_TO_CODE: Record<string, string> = {
  'plant head': 'plant_head',
  'purchase head': 'purchase_head',
  'it head': 'it_head',
  'quality head': 'quality_head',
  'production head': 'production_head',
  'plant pic': 'plant_pic',
  'purchase pic': 'purchase_pic',
  'it pic': 'it_pic',
  'quality pic': 'quality_pic',
  'production pic': 'production_pic',
};

const normalizeEmail = (value: string) => {
  const email = (value || '').trim();
  if (!email) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
};

const normalizeContactCategory = (value: string) => {
  const raw = (value || '').trim();
  if (!raw) return '';
  if (CONTACT_CATEGORY_CODES.has(raw)) return raw;
  const mapped = CONTACT_CATEGORY_LABEL_TO_CODE[raw.toLowerCase()];
  return mapped || '';
};

const sanitizeTargetPayload = (formData: FormData) => {
  const normalizedContacts = (formData.targetcontacts || [])
    .map((contact) => ({
      category: normalizeContactCategory(contact.category),
      name: (contact.name || '').trim(),
      designation: (contact.designation || '').trim(),
      mobile_no: (contact.mobile_no || '').replace(/\D/g, '').slice(0, 15),
      email_id: normalizeEmail(contact.email_id),
    }))
    .filter((contact) => Boolean(contact.category || contact.name || contact.designation || contact.mobile_no || contact.email_id));

  return {
    account_name: (formData.account_name || '').trim(),
    department: (formData.department || '').trim(),
    vertical: (formData.vertical || '').trim(),
    vertical_sub: (formData.vertical_sub || '').trim(),
    region: (formData.region || '').trim(),
    pic: (formData.pic || '').trim(),
    designation: (formData.designation || '').trim(),
    activity: (formData.activity || '').trim(),
    activity_date: (formData.activity_date || '').trim(),
    next_action: (formData.next_action || '').trim(),
    remarks: (formData.remarks || '').trim(),
    next_action_date: (formData.next_action_date || '').trim(),
    mobile_number: (formData.mobile_number || '').replace(/\D/g, '').slice(0, 10),
    email_id: normalizeEmail(formData.email_id),
    location: (formData.location || '').trim(),
    state: (formData.state || '').trim(),
    city: (formData.city || '').trim(),
    address: (formData.address || '').trim(),
    business: (formData.business || '').trim(),
    targetcontacts: normalizedContacts,
    acct_created_date: formData.acct_created_date,
  };
};


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
  acct_created_date: null,
  last_update: null,
  targetcontacts: [], // Initializing as empty array
  
};


const initialState: InitialStateData = {
    formValues: null,
    users: null,
    loading: false,
    error: null,
    data: { message: '' },
    formData: initialFormData,
};

export const editTargetWorkspaceFetchUserById = createAsyncThunk(
    'users/editTargetWorkspaceFetchUserById',
    async (id: string, { rejectWithValue, getState }) => {
        try {
            // Retrieve the token (from store, local storage, etc.)
            const state = getState() as RootState;
            const tokenData = state.userLoginAuth.user.tokens.access;

            // Make the GET request with the Authorization header
            const response = await axios.get(`/target-data/${id}/`, {
                headers: {
                    Authorization: `Bearer ${tokenData}`,
                },
            });

            console.log('target end point data', response);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
);

export const editPostTargetWorkspace = createAsyncThunk(
    'users/editPostTargetWorkspace',
    async ({ formData }: { formData: FormData }, { rejectWithValue, getState }) => {
        try {
            // Retrieve the token (from store, local storage, etc.)
            const state = getState() as RootState;
            const tokenData = state.userLoginAuth.user.tokens.access;


            // Make the PUT request with the Authorization header
            const payload = sanitizeTargetPayload(formData);
            const response = await axios.put(`/target-data/${formData.id}/`, payload, {
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

const TargetWorkspaceEditForm = createSlice({
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
        
       
        // addContact: (state, action: PayloadAction<Contact>) => {
        //   if (state.formData) {
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
    
        // updateContact: (
        //   state,
        //   action: PayloadAction<{ updatedContact: Contact; index: number }>
        // ) => {
        //   if (state.formData) {
        //     const { updatedContact, index } = action.payload;
        //     if (index >= 0 && index < state.formData.contacts.length) {
        //       state.formData.contacts[index] = updatedContact;
        //     }
        //   }
        // },
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
            editPostTargetWorkspace(state.formData as any); // Call the async thunk with formData
          }
        },
    
      },
    extraReducers: (builder) => {
      

             builder
                  .addCase(editPostTargetWorkspace.pending, (state) => {
                    state.loading = true;
                    state.users = null;
                    state.error = null;
                  })
                  .addCase(editPostTargetWorkspace.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
                    
                    state.loading = false;
                    state.error = null;
                    state.data = { message: action.payload.message };
                  })
                  .addCase(editPostTargetWorkspace.rejected, (state, action) => {
                    state.loading = false;
                    state.users = null;
                    state.error = action.payload?.toString() || 'Failed to submit form';
                    state.data = { message: '' };
                  })
            
                  .addCase(editTargetWorkspaceFetchUserById.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(editTargetWorkspaceFetchUserById.fulfilled, (state, action: PayloadAction<FormData | null>) => {
                    console.log('recieved or Default Form Data:', action.payload);
                    state.loading = false;
                    state.formData = action.payload ? {
                      ...action.payload,
                      targetcontacts: action.payload.targetcontacts || [],
                    } : initialFormData;
                    console.log('Fetched or Default Form Data:', state.formData);
                  })
                  
                  .addCase(editTargetWorkspaceFetchUserById.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.toString() || 'Failed to fetch opportunity data';
                  });
    },
});


// export default AccountEditForm.reducer;
export const { clearAccountData, setFormData, addContact, updateContact, submitForm } = TargetWorkspaceEditForm.actions;
export default TargetWorkspaceEditForm.reducer;
