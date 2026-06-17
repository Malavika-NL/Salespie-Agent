// import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import type { RootState } from "../../../app/store";
// // import { stat } from "fs";

// interface Stage {
//   stages: string;
//   ranks: string;
//   lost_reason?: string;
// }

// interface PicDetails {
//   pic_department: string;
//   pic_name: string;
//   pic_designation: string;
//   pic_email: string;
//   pic_phnone: string;
//   pic_phntwo: string;
// }

// interface EventDetails {
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
//   event: string;
//   remark: string;
// }

// interface TaskDetails {
//   task: string;
//   assign_to: string;
//   start_date: string;
//   end_date: string;
//   status: string;
// }

// interface UpdateEventPayload {
//   eventIndex: number;
//   updatedEvent: EventDetails;
// }

// interface UpdateTaskPayload {
//   taskIndex: number;
//   updatedTask: TaskDetails;
// }
// interface AccountDetailsValues {
//   account_holder: string;
//   account_name: number;
//   opportunity: string;
//   make: string;
//   sub_make: string;
//   sub_make_brand: string;
//   pic: string;
//   contact_person: string;
//   designation: string;
//   department: string;
//   mobile_number: string;
//   email_id: string;
//   location: string;
//   state: string;
//   city: string;
//   address: string;
//   qty: string;
//   values: number | null;
//   exp_closure_date: string;
//   exp_po_date: string;
//   remarks?: string | null;
//   opportunity_description:string;
//   hardware_amount: number | null;
//   software_amount: number | null;
//   consumables_amount: number | null;
//   automation_amount: number | null;
//   solution_amount: number | null;
//   maintenance_amount: number | null;
//   others_amount: number | null;
//   total_amount: number | null;
//   status: string | null;
//   vertical: string ;
//   vertical_sub:string;

// }

// interface FormData extends AccountDetailsValues {
//   // last_update: string;
//   opportunity_stages: Stage[];
//   opportunity_pic: PicDetails[];
//   opportunity_event: EventDetails[];
//   opportunity_task: TaskDetails[];
// }

// export const postOpportunityWorkspaceForm = createAsyncThunk(
//   'form/opportunityWorkspaceForm',
//   async (formData: FormData, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;
//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }
//       const response = await axios.post('/opportunity-data/', formData, {
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });
//       console.log('response ', response.data)
//       return response.data;
      
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to submit form');
//     }
//   }
// )

// interface InitialStateData {
//   formValues: any;
//   loading: boolean;
//   error: string | null;
//   users: null | string;
//   data: { message: string };
//   formData: FormData | null;  // Ensure this line exists
// }


// const initialFormData: FormData = {
//   account_holder: '',
//   account_name: 0,
//   opportunity: '',
//   make: '',
//   sub_make: '',
//   sub_make_brand: '',
//   pic: '',
//   contact_person: '',
//   designation: '',
//   department: '',
//   mobile_number: '',
//   email_id: '',
//   location: '',
//   state: '',
//   city: '',
//   address: '',
//   qty: '',
//   values: 0,
//   opportunity_description:'',
//   exp_closure_date: '',
//   exp_po_date: '',
//   hardware_amount: 0,
//   software_amount: 0,
//   consumables_amount: 0,
//   automation_amount: 0,
//   solution_amount: 0,
//   maintenance_amount: 0,
//   others_amount: 0,
//   total_amount: 0,
//   status: null,
//   vertical: '',
//   vertical_sub: '',
//   opportunity_stages: [],
//   opportunity_pic: [
//     { 
//       pic_department: '',
//       pic_name: '',
//       pic_designation: '',
//       pic_email: '',
//       pic_phnone: '',
//       pic_phntwo: '',
//     }
//   ],
//   opportunity_event: [],
//   opportunity_task: [],
// };

// const initialState: InitialStateData = {
//   formValues: null,
//   users: null,
//   loading: false,
//   error: null,
//   data: { message: '' },
//   formData: initialFormData,
// };
// const OpportunityWorkspaceForm = createSlice({
//   name: 'OpportunityWorkspaceForm',
//   initialState,
//   reducers: {
//     clearOpportunityData(state) {
//       state.data = { message: '' };
//     },
//     setFormData(state, action: PayloadAction<{ id: string; value: string | number }>) {
//       if (!state.formData) {
//         console.warn('formData is null or undefined');
//         return;
//       }
    
//       const { id, value } = action.payload;
//       console.log('form action', action.payload);  // Check the payload here
    
//       state.formData = {
//         ...state.formData,
//         [id]: value
//       };
    
//       console.log('form data', state.formData);  // Check the updated formData
//     },

//     addStage(state, action: PayloadAction<Stage>) {
//       if (state.formData) {
//         state.formData = {
//           ...state.formData,
//           opportunity_stages: [action.payload]
//         };
//       }
//     },
//   addPicDetails(state, action: PayloadAction<PicDetails | PicDetails[]>) {
//       if (state.formData) {
//         if (Array.isArray(action.payload)) {
//           state.formData.opportunity_pic = action.payload; // Update entire array when editing
//         } else {
//           state.formData.opportunity_pic = [...state.formData.opportunity_pic, action.payload]; // Add new PIC
//         }
//       }
//     },
//     addEventDetails(state, action: PayloadAction<EventDetails>) {
//       if (state.formData) {
//         state.formData = {
//           ...state.formData,
//           opportunity_event: [...state.formData.opportunity_event, action.payload]
//         };
//       }
//       console.log('form data', state.formData);
//     },
//     addTaskDetails(state, action: PayloadAction<TaskDetails>) {
//       if (state.formData) {
//         state.formData = {
//           ...state.formData,
//           opportunity_task: [...state.formData.opportunity_task, action.payload]
//         };
//       }
//     },
//     updateEvent(state, action: PayloadAction<UpdateEventPayload>) {
//       if (state.formData && state.formData.opportunity_event) {
//         const { eventIndex, updatedEvent } = action.payload;

//         // Replace the event at the specified index with the updated event
//         state.formData.opportunity_event[eventIndex] = updatedEvent;

//         // Log to confirm update
//         console.log("Updated Event at index", eventIndex, updatedEvent);
//       }
//     },
//     removeEvent(state, action: PayloadAction<number>) {
//       if (state.formData && state.formData.opportunity_event) {
//         state.formData.opportunity_event = state.formData.opportunity_event.filter(
//           (_, index) => index !== action.payload
//         );
//       }
//     },
//     updateTasks(state, action: PayloadAction<UpdateTaskPayload>) {
//       if (state.formData && state.formData.opportunity_task) {
//         const { taskIndex, updatedTask } = action.payload;

//         // Replace the event at the specified index with the updated event
//         state.formData.opportunity_task[taskIndex] = updatedTask;

//         // Log to confirm update
//         console.log("Updated Event at index", taskIndex, updatedTask);
//       }
//     },
//     removeTask(state, action: PayloadAction<number>) {
//       if (state.formData && state.formData.opportunity_task) {
//         state.formData.opportunity_task = state.formData.opportunity_task.filter(
//           (_, index) => index !== action.payload
//         );
//       }
//     },
//     submitForm(state) {

//       if (state.formData) {
//         console.log('end point', state.formData)
//         postOpportunityWorkspaceForm(state.formData as any);
//       }
//     },
//     resetFormData(state) {
//       // Reset the formData to its initial state
//       state.formData = initialFormData;
//     },
    
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(postOpportunityWorkspaceForm.pending, (state) => {
//         state.loading = true;
//         state.users = null;
//         state.error = null;
//       })
//       .addCase(postOpportunityWorkspaceForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
//         state.loading = false;
//         state.error = null;
//         state.data = { message: action.payload.message };
//       })
//       .addCase(postOpportunityWorkspaceForm.rejected, (state, action) => {
//         state.loading = false;
//         state.users = null;
//         state.error = action.payload?.toString() || 'Failed to submit form';
//         state.data = { message: '' };
//       });
//   },
// });

// export const { clearOpportunityData, setFormData, addStage, addPicDetails, addEventDetails, addTaskDetails, submitForm , updateEvent,updateTasks ,resetFormData,removeEvent ,removeTask } = OpportunityWorkspaceForm.actions;
// export default OpportunityWorkspaceForm.reducer;

// src/features/OpportunityWorkspace/slice/opportunitySlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../../app/store";

// â”€â”€ Interfaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Stage {
  stages: string;
  month: string;
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

// â”€â”€ NEW â”€â”€
export interface FollowupDetails {
  followup: string;
  followup_topic: string;
  start_date: string;
  end_date: string;
  remark: string;
}

interface UpdateEventPayload {
  eventIndex: number;
  updatedEvent: EventDetails;
}

interface UpdateTaskPayload {
  taskIndex: number;
  updatedTask: TaskDetails;
}

interface AccountDetailsValues {
  account_holder: string;
  account_name: number;
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
  description: string;
  qty: string;
  values: number | null;
  exp_closure_date: string;
  exp_po_date: string;
  remarks?: string | null;
  opportunity_description: string;
  hardware_amount: number | null;
  software_amount: number | null;
  consumables_amount: number | null;
  automation_amount: number | null;
  implementation_amount: number | null;
  solution_amount: number | null;
  maintenance_amount: number | null;
  others_amount: number | null;
  total_amount: number | null;
  status: string | null;
  vertical: string;
  vertical_sub: string;
  sales_type: string;
  sales_type_value: number | null;
}

interface FormData extends AccountDetailsValues {
  opportunity_stages: Stage[];
  opportunity_pic: PicDetails[];
  opportunity_event: EventDetails[];
  opportunity_task: TaskDetails[];
  opportunity_followup: FollowupDetails[]; // â”€â”€ NEW â”€â”€
}

// â”€â”€ Async thunk â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const postOpportunityWorkspaceForm = createAsyncThunk(
  'form/opportunityWorkspaceForm',
  async (formData: FormData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await axios.post('/opportunity-data/', formData, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log('response ', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
    }
  }
);

// â”€â”€ Initial state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface InitialStateData {
  formValues: any;
  loading: boolean;
  error: string | null;
  users: null | string;
  data: { message: string };
  formData: FormData | null;
}

const initialFormData: FormData = {
  account_holder: '',
  account_name: 0,
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
  description: '',
  qty: '',
  values: 0,
  opportunity_description: '',
  exp_closure_date: '',
  exp_po_date: '',
  hardware_amount: 0,
  software_amount: 0,
  consumables_amount: 0,
  automation_amount: 0,
  implementation_amount: 0,
  solution_amount: 0,
  maintenance_amount: 0,
  others_amount: 0,
  total_amount: 0,
  status: null,
  vertical: '',
  vertical_sub: '',
  sales_type: '',
  sales_type_value: 0,
  opportunity_stages: [],
  opportunity_pic: [
    {
      pic_department: '',
      pic_name: '',
      pic_designation: '',
      pic_email: '',
      pic_phnone: '',
      pic_phntwo: '',
    }
  ],
  opportunity_event: [],
  opportunity_task: [],
  opportunity_followup: [], // â”€â”€ NEW â”€â”€
};

const initialState: InitialStateData = {
  formValues: null,
  users: null,
  loading: false,
  error: null,
  data: { message: '' },
  formData: initialFormData,
};

// â”€â”€ Slice â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const OpportunityWorkspaceForm = createSlice({
  name: 'OpportunityWorkspaceForm',
  initialState,
  reducers: {

    clearOpportunityData(state) {
      state.data = { message: '' };
    },

    setFormData(state, action: PayloadAction<{ id: string; value: string | number }>) {
      if (!state.formData) {
        console.warn('formData is null or undefined');
        return;
      }
      const { id, value } = action.payload;
      console.log('form action', action.payload);
      state.formData = { ...state.formData, [id]: value };
      console.log('form data', state.formData);
    },

    addStage(state, action: PayloadAction<Stage>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_stages: [action.payload],
        };
      }
    },

    addPicDetails(state, action: PayloadAction<PicDetails | PicDetails[]>) {
      if (state.formData) {
        if (Array.isArray(action.payload)) {
          state.formData.opportunity_pic = action.payload;
        } else {
          state.formData.opportunity_pic = [...state.formData.opportunity_pic, action.payload];
        }
      }
    },

    addEventDetails(state, action: PayloadAction<EventDetails>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_event: [...state.formData.opportunity_event, action.payload],
        };
      }
      console.log('form data', state.formData);
    },

    addTaskDetails(state, action: PayloadAction<TaskDetails>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_task: [...state.formData.opportunity_task, action.payload],
        };
      }
    },

    // â”€â”€ NEW: Followup reducers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    addFollowupDetails(state, action: PayloadAction<FollowupDetails>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_followup: [
            ...(state.formData.opportunity_followup || []),
            action.payload,
          ],
        };
      }
      console.log('followup added', state.formData);
    },

    removeFollowup(state, action: PayloadAction<number>) {
      if (state.formData) {
        state.formData.opportunity_followup = (
          state.formData.opportunity_followup || []
        ).filter((_, index) => index !== action.payload);
      }
    },
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    updateEvent(state, action: PayloadAction<UpdateEventPayload>) {
      if (state.formData && state.formData.opportunity_event) {
        const { eventIndex, updatedEvent } = action.payload;
        state.formData.opportunity_event[eventIndex] = updatedEvent;
        console.log("Updated Event at index", eventIndex, updatedEvent);
      }
    },

    removeEvent(state, action: PayloadAction<number>) {
      if (state.formData && state.formData.opportunity_event) {
        state.formData.opportunity_event = state.formData.opportunity_event.filter(
          (_, index) => index !== action.payload
        );
      }
    },

    updateTasks(state, action: PayloadAction<UpdateTaskPayload>) {
      if (state.formData && state.formData.opportunity_task) {
        const { taskIndex, updatedTask } = action.payload;
        state.formData.opportunity_task[taskIndex] = updatedTask;
        console.log("Updated Task at index", taskIndex, updatedTask);
      }
    },

    removeTask(state, action: PayloadAction<number>) {
      if (state.formData && state.formData.opportunity_task) {
        state.formData.opportunity_task = state.formData.opportunity_task.filter(
          (_, index) => index !== action.payload
        );
      }
    },

    submitForm(state) {
      if (state.formData) {
        console.log('end point', state.formData);
        postOpportunityWorkspaceForm(state.formData as any);
      }
    },

    resetFormData(state) {
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
        const payload = action.payload as any;
        if (typeof payload === 'string') {
          state.error = payload;
        } else if (payload && typeof payload === 'object') {
          const rawDetails = payload.details ?? payload.errors;
          if (rawDetails && typeof rawDetails === 'object') {
            state.error = Object.entries(rawDetails)
              .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : String(value)}`)
              .join(' | ');
          } else {
            state.error = payload.message || 'Failed to submit form';
          }
        } else {
          state.error = action.error.message || 'Failed to submit form';
        }
        state.data = { message: '' };
      });
  },
});

// â”€â”€ Exports â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const {
  clearOpportunityData,
  setFormData,
  addStage,
  addPicDetails,
  addEventDetails,
  addTaskDetails,
  addFollowupDetails,  // â”€â”€ NEW â”€â”€
  removeFollowup,      // â”€â”€ NEW â”€â”€
  submitForm,
  updateEvent,
  updateTasks,
  resetFormData,
  removeEvent,
  removeTask,
} = OpportunityWorkspaceForm.actions;

export default OpportunityWorkspaceForm.reducer;
