import  { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../../app/store';
import type { Token } from '../../Authslice/authTypes';

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

// Base interface for AccountDetailsValues
interface AccountDetailsValues {
  // account_holder: string;
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

  // account_holder: '',
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

export const accountWorkspaceData = createAsyncThunk(
  'form/accountWorkspaceForm',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;

      if (!tokenData.access) {
        throw new Error('No access token available');
      }

      const response = await axios.post('http://localhost:8000/account-data/', formData, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });

      return response.data; // Assuming your response data structure here
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      return rejectWithValue(error.response?.data || 'Failed to submit form');
    }
  }
);

const AccountWorkspaceForm = createSlice({
  name: 'accountForm',
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


  resetFormData(state) {
      // Reset the formData to its initial state
      state.formData = initialFormData;
    },
    submitForm(state) {
      if (state.formData) {
        console.log('end point', state.formData)
        accountWorkspaceData(state.formData as any); // Call the async thunk with formData
      }
    },

  },
  extraReducers: builder => {
    builder
      .addCase(accountWorkspaceData.pending, state => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(accountWorkspaceData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message }; // Set message from payload
      })
      .addCase(accountWorkspaceData.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data.message = (action.payload as { message?: string })?.message || 'Failed to submit form'; // Set message from error payload
      });
  },
});

export const { clearAccountData, setFormData, addFinanceDetails, addCompanyDetails, addContact, updateContact,resetFormData, submitForm } = AccountWorkspaceForm.actions;
export default AccountWorkspaceForm.reducer;
