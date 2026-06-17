import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
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
  // acct_created_date: string ;
  last_update: string;
}

interface FormData extends AccountDetailsValues {
  targetcontacts: Contact[]; // Update to include contacts array
  finance: Finance[];  // Update to include finance array
  company: Company[];  // Update to include company array
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
  // acct_created_date: '',
  last_update: '',
  targetcontacts: [],// Initializing as empty array
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

export const targetWorkspaceData = createAsyncThunk(
  'form/targetWorkspaceData',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;

      if (!tokenData.access) {
        throw new Error('No access token available');
      }

      const payload = sanitizeTargetPayload(formData);
      const response = await axios.post('http://localhost:8000/target-data/', payload, {
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

const TargetWorkspaceForm = createSlice({
  name: 'TargetWorkspaceForm',
  initialState,
  reducers: {
    clearResponseData(state) {
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
        if (!state.formData.targetcontacts) {
          state.formData.targetcontacts = [];
        }
        state.formData.targetcontacts.push(action.payload);
      }
    },

    updateContact: (state, action: PayloadAction<{ updatedContact: Contact; index: number }>) => {
      if (state.formData) {
        const { updatedContact, index } = action.payload;
        if (!state.formData.targetcontacts) return;
        if (index >= 0 && index < state.formData.targetcontacts.length) {
          state.formData.targetcontacts[index] = updatedContact;
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
        targetWorkspaceData(state.formData as any); // Call the async thunk with formData
      }
    },

  },
  extraReducers: builder => {
    builder
      .addCase(targetWorkspaceData.pending, state => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(targetWorkspaceData.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message }; // Set message from payload
      })
      .addCase(targetWorkspaceData.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data.message = (action.payload as { message?: string })?.message || 'Failed to submit form'; // Set message from error payload
      });
  },
});

export const { clearResponseData, setFormData, addFinanceDetails, addCompanyDetails, addContact, updateContact,resetFormData, submitForm } = TargetWorkspaceForm.actions;

export default TargetWorkspaceForm.reducer;
