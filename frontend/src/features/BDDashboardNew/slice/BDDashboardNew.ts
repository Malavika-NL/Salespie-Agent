import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../../app/store";
// import { stat } from "fs";

interface Stage {
  stages: string;
  ranks: string;
  lost_reason?: string;
}

interface PicDetails {
  pic_department: string;
  pic_name: string;
  pic_designation: string;
  pic_email: string;
  pic_phnone: string;
  pic_phntwo: string;
}

interface EventDetails {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  event: string;
  remark: string;
}

interface TaskDetails {
  task: string;
  assign_to: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface UpdateEventPayload {
  eventIndex: number;
  updatedEvent: EventDetails;
}

interface AccountDetailsValues {
  account_holder: string;
  account_name: string;
  opportunity: string;
  make: string;
  sub_make: string;
  sub_make_brand: string;
  pic: string;
  contact_person: string;
  designation: string;
  department: string;
  mobile_number: string;
  email_id: string;
  location: string;
  state: string;
  city: string;
  address: string;
  qty: string;
  values: number | null;
  exp_closure_date: string;
  exp_po_date: string;
  remarks?: string | null;
  hardware_amount: number | null;
  software_amount: number | null;
  consumables_amount: number | null;
  automation_amount: number | null;
  solution_amount: number | null;
  maintenance_amount: number | null;
  others_amount: number | null;
  total_amount: number | null;
  status: string | null;
  vertical: string | null;

}

interface FormData extends AccountDetailsValues {
  // last_update: string;
  opportunity_stages: Stage[];
  opportunity_pic: PicDetails[];
  opportunity_event: EventDetails[];
  opportunity_task: TaskDetails[];
}

export const postOpportunityWorkspaceForm = createAsyncThunk(
  'form/opportunityWorkspaceForm',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await axios.post('http://localhost:8000/opportunity-data/', formData, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log('response ', response.data)
      return response.data;
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
    }
  }
)

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
  opportunity: '',
  make: '',
  sub_make: '',
  sub_make_brand: '',
  pic: '',
  contact_person: '',
  designation: '',
  department: '',
  mobile_number: '',
  email_id: '',
  location: '',
  state: '',
  city: '',
  address: '',
  qty: '',
  values: 0,
  exp_closure_date: '',
  exp_po_date: '',
  hardware_amount: 0,
  software_amount: 0,
  consumables_amount: 0,
  automation_amount: 0,
  solution_amount: 0,
  maintenance_amount: 0,
  others_amount: 0,
  total_amount: 0,
  status: null,
  vertical: '',
  // last_update: '',
  opportunity_stages: [],
  opportunity_pic: [],
  opportunity_event: [],
  opportunity_task: [],
};

const initialState: InitialStateData = {
  formValues: null,
  users: null,
  loading: false,
  error: null,
  data: { message: '' },
  formData: initialFormData,
};
const OpportunityWorkspaceForm = createSlice({
  name: 'OpportunityWorkspaceForm',
  initialState,
  reducers: {
    clearOpportunityData(state) {
      state.data = { message: '' };
    },
    // setFormData(state, action: PayloadAction<{ id: string; value: string | number }>) {
    //   if (!state.formData) {
    //     console.warn('formData is null or undefined');
    //     return;
    //   }

    //   const { id, value } = action.payload;
    //   console.log('Form action received', action.payload);  // Log the incoming action

    //   // Ensure value is a valid number
    //   const parsedValue = typeof value === 'string' ? parseFloat(value) : value;

    //   // If parsedValue is NaN (Not a Number), set it to 0
    //   const validValue = isNaN(parsedValue) ? 0 : parsedValue;

    //   // Update the specific field in formData
    //   state.formData = {
    //     ...state.formData,
    //     [id]: validValue,
    //   };

    //   // Recalculate the total_amount based on all the individual amounts
    //   const {
    //     hardware_amount = 0,
    //     software_amount = 0,
    //     consumables_amount = 0,
    //     automation_amount = 0,
    //     solution_amount = 0,
    //     maintenance_amount = 0,
    //     others_amount = 0,
    //   } = state.formData;

    //   console.log('Individual amounts:', {
    //     hardware_amount,
    //     software_amount,
    //     consumables_amount,
    //     automation_amount,
    //     solution_amount,
    //     maintenance_amount,
    //     others_amount,
    //   });

    //   // Calculate total_amount
    //   state.formData.total_amount =
    //     (hardware_amount ?? 0) +
    //     (software_amount ?? 0) +
    //     (consumables_amount ?? 0) +
    //     (automation_amount ?? 0) +
    //     (solution_amount ?? 0) +
    //     (maintenance_amount ?? 0) +
    //     (others_amount ?? 0);

    //   console.log('Updated form data with total amount', state.formData);  // Check the updated state
    // },


    setFormData(state, action: PayloadAction<{ id: string; value: string | number }>) {
      if (!state.formData) {
        console.warn('formData is null or undefined');
        return;
      }
    
      const { id, value } = action.payload;
      console.log('form action', action.payload);  // Check the payload here
    
      state.formData = {
        ...state.formData,
        [id]: value
      };
    
      console.log('form data', state.formData);  // Check the updated formData
    },

    addStage(state, action: PayloadAction<Stage>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_stages: [action.payload]
        };
      }
    },
    addPicDetails(state, action: PayloadAction<PicDetails>) {

      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_pic: [action.payload]
        };
      }
      console.log(state.formData)
    },
    addEventDetails(state, action: PayloadAction<EventDetails>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_event: [...state.formData.opportunity_event, action.payload]
        };
      }
      console.log('form data', state.formData);
    },
    addTaskDetails(state, action: PayloadAction<TaskDetails>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_task: [...state.formData.opportunity_task, action.payload]
        };
      }
    },
    updateEvent(state, action: PayloadAction<UpdateEventPayload>) {
      if (state.formData && state.formData.opportunity_event) {
        const { eventIndex, updatedEvent } = action.payload;

        // Replace the event at the specified index with the updated event
        state.formData.opportunity_event[eventIndex] = updatedEvent;

        // Log to confirm update
        console.log("Updated Event at index", eventIndex, updatedEvent);
      }
    },
    submitForm(state) {

      if (state.formData) {
        console.log('end point', state.formData)
        postOpportunityWorkspaceForm(state.formData as any);
      }
    },
    resetFormData(state) {
      // Reset the formData to its initial state
      state.formData = initialFormData;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOpportunityWorkspaceForm.pending, (state) => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(postOpportunityWorkspaceForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message };
      })
      .addCase(postOpportunityWorkspaceForm.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data = { message: '' };
      });
  },
});

export const { clearOpportunityData, setFormData, addStage, addPicDetails, addEventDetails, addTaskDetails, submitForm , updateEvent ,resetFormData  } = OpportunityWorkspaceForm.actions;
export default OpportunityWorkspaceForm.reducer;
