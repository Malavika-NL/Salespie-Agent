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


// interface AccountDetailsValues {
//   account_holder: string;
//   account_name: string;
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
//   values: number;
//   exp_closure_date: string;
//   exp_po_date: string;
//   remarks?: string | null;
//   hardware_amount: number;
//   software_amount: number;
//   consumables_amount: number;
//   automation_amount: number;
//   solution_amount: number;
//   maintenance_amount: number;
//   others_amount: number;
//   total_amount: number;
//   status: string | null;
//   vertical: string | null;
//   vertical_sub:string;
//   last_update:string ;
//   opportunity_description:string;
// }

// interface FormData extends AccountDetailsValues {
//   // last_update: string;
//   opportunity_stages: Stage[];
//   opportunity_pic: PicDetails[];
//   opportunity_event: EventDetails[];
//   opportunity_task: TaskDetails[];
// }

// export const postAdminEditOpportunityWorkspaceForm = createAsyncThunk(
//   'form/postAdminEditOpportunityWorkspaceForm',
//   async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;
//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }
//       const response = await axios.put(`http://localhost:8000/opportunities/update/${id}/`, formData, {
//         headers: {
//           'content-type': 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });
//       console.log('at opportunity end point ',response)
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to submit form');
//     }
//   }
// )


// export const fetchAdminOpportunityWorkspaceUserById = createAsyncThunk(
//   'users/fetchOpportunityEditWorkspaceUserById',
//   async (id: string, { rejectWithValue, getState }) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens.access;
//       console.log(tokenData)
//       const response = await axios.get(`http://localhost:8000/opportunities/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${tokenData}`,
//         },
//       });

//       console.log('the data from end point',response);
//       return response.data;
//     } catch (error: any) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(error.response.data);
//       }
//       return rejectWithValue(error.message);
//     }
//   }
// );

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
//   account_name: '',
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
//   vertical_sub:'',
//   last_update: '',
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
// const EditAdminOpportunityWorkspaceForm = createSlice({
//   name: 'EditAdminOpportunityWorkspaceForm',
//   initialState,
//   reducers: {
//     clearEditOpportunityData(state) {
//       state.data = { message:''};
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
//       console.log('action',action.payload)
//       if (state.formData) {
//         state.formData = {
//           ...state.formData,
//           opportunity_stages: [action.payload],  // Overwrite the existing stages with the new one
//         };
//         console.log('form stage data', state.formData);
//       }
//     },
//     updateStatus(state, action: PayloadAction<string | null>) {
//       if (state.formData) {
//         state.formData.status = action.payload;
//         console.log("Updated Status:", state.formData.status);
//       }
//     },
//    addPicDetails(state, action: PayloadAction<PicDetails | PicDetails[]>) {
//          if (state.formData) {
//            if (Array.isArray(action.payload)) {
//              state.formData.opportunity_pic = action.payload; // Update entire array when editing
//            } else {
//              state.formData.opportunity_pic = [...state.formData.opportunity_pic, action.payload]; // Add new PIC
//            }
//          }
//        },
//     addEventDetails(state, action: PayloadAction<EventDetails>) {
//       if (state.formData) {
//         state.formData = {
//           ...state.formData,
//           opportunity_event: [...state.formData.opportunity_event, action.payload]
//         };
//       }
//     },
//     addTaskDetails(state, action: PayloadAction<TaskDetails>) {
//       if (state.formData) {
//         state.formData = {
//           ...state.formData,
//           opportunity_task: [...state.formData.opportunity_task, action.payload]
//         };
//       }
//     },
//      updateEvent(state, action: PayloadAction<UpdateEventPayload>) {
//           if (state.formData && state.formData.opportunity_event) {
//             const { eventIndex, updatedEvent } = action.payload;
    
//             // Replace the event at the specified index with the updated event
//             state.formData.opportunity_event[eventIndex] = updatedEvent;
    
//             // Log to confirm update
//             console.log("Updated Event at index", eventIndex, updatedEvent);
//           }
//         },
//         removeEvent(state, action: PayloadAction<number>) {
//           if (state.formData) {
//             state.formData.opportunity_event = state.formData.opportunity_event.filter(
//               (_, index) => index !== action.payload
//             );
//           }
//         },
//         removeTask(state, action: PayloadAction<number>) {
//           if (state.formData) {
//             state.formData.opportunity_task = state.formData.opportunity_task.filter(
//               (_, index) => index !== action.payload
//             );
//           }
//         },
        
//         updateTask(state, action: PayloadAction<{ taskIndex: number; updatedTask: TaskDetails }>) {
//           if (state.formData?.opportunity_task) {
//             const { taskIndex, updatedTask } = action.payload;
//             state.formData.opportunity_task[taskIndex] = updatedTask;
//           }
//         },
//     submitForm(state) {
      
//       if (state.formData) {
//         console.log('end point' , state.formData)
//         postAdminEditOpportunityWorkspaceForm(state.formData as any);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(postAdminEditOpportunityWorkspaceForm.pending, (state) => {
//         state.loading = true;
//         state.users = null;
//         state.error = null;
//       })
//       .addCase(postAdminEditOpportunityWorkspaceForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        
//         state.loading = false;
//         state.error = null;
//         state.data = { message: action.payload.message };
//       })
//       .addCase(postAdminEditOpportunityWorkspaceForm.rejected, (state, action) => {
//         state.loading = false;
//         state.users = null;
//         state.error = action.payload?.toString() || 'Failed to submit form';
//         state.data = { message: '' };
//       })

//       .addCase(fetchAdminOpportunityWorkspaceUserById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminOpportunityWorkspaceUserById.fulfilled, (state, action: PayloadAction<FormData | null>) => {
//         console.log('recieved or Default Form Data:', action.payload);
//         state.loading = false;
//         state.formData = action.payload || initialFormData;  // Fallback to initial data
//         console.log('Fetched or Default Form Data:', state.formData);
//       })
      
//       .addCase(fetchAdminOpportunityWorkspaceUserById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.toString() || 'Failed to fetch opportunity data';
//       });
//   },
// });

// export const { clearEditOpportunityData, setFormData, addStage, addPicDetails, addEventDetails, addTaskDetails, submitForm ,updateEvent,updateStatus,removeEvent,removeTask, updateTask} = EditAdminOpportunityWorkspaceForm.actions;
// export default EditAdminOpportunityWorkspaceForm.reducer;


import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../../app/store";

interface Stage {
  stages: string;
  month: string;
  ranks: string;
  lost_reason?: string;
  last_update?: string;
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

// ✅ Added Followup Interface
export interface FollowupDetails {
  followup: string;
  followup_topic: string;
  start_date: string;
  end_date: string;
  remark: string;
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
  values: number;
  exp_closure_date: string;
  exp_po_date: string;
  remarks?: string | null;
  hardware_amount: number;
  software_amount: number;
  consumables_amount: number;
  automation_amount: number;
  solution_amount: number;
  implementation_amount: number;
  others_amount: number;
  total_amount: number;
  status: string | null;
  vertical: string | null;
  vertical_sub: string;
  last_update: string;
  opportunity_description: string;
  sales_type: string;
  sales_type_value: number;
}

interface FormData extends AccountDetailsValues {
  opportunity_stages: Stage[];
  opportunity_pic: PicDetails[];
  opportunity_event: EventDetails[];
  opportunity_task: TaskDetails[];
  opportunity_followup: FollowupDetails[]; // ✅ Added Followup to FormData
}

export const postAdminEditOpportunityWorkspaceForm = createAsyncThunk(
  'form/postAdminEditOpportunityWorkspaceForm',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens;
      if (!tokenData.access) {
        throw new Error('No access token available');
      }
      const response = await axios.put(`http://localhost:8000/opportunities/update/${id}/`, formData, {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      console.log('at opportunity end point ', response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to submit form');
    }
  }
)

export const fetchAdminOpportunityWorkspaceUserById = createAsyncThunk(
  'users/fetchOpportunityEditWorkspaceUserById',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const tokenData = state.userLoginAuth.user.tokens.access;
      console.log(tokenData)
      const response = await axios.get(`http://localhost:8000/opportunities/${id}/`, {
        headers: {
          Authorization: `Bearer ${tokenData}`,
        },
      });

      console.log('the data from end point', response);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

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
  opportunity_description: '',
  exp_closure_date: '',
  exp_po_date: '',
  hardware_amount: 0,
  software_amount: 0,
  consumables_amount: 0,
  automation_amount: 0,
  solution_amount: 0,
  implementation_amount: 0,
  others_amount: 0,
  total_amount: 0,
  status: null,
  vertical: '',
  vertical_sub: '',
  last_update: '',
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
  opportunity_followup: [], // ✅ Initialize Followup Array
};

const initialState: InitialStateData = {
  formValues: null,
  users: null,
  loading: false,
  error: null,
  data: { message: '' },
  formData: initialFormData,
};

const EditAdminOpportunityWorkspaceForm = createSlice({
  name: 'EditAdminOpportunityWorkspaceForm',
  initialState,
  reducers: {
    clearEditOpportunityData(state) {
      state.data = { message: '' };
    },
    setFormData(state, action: PayloadAction<{ id: string; value: string | number }>) {
      if (!state.formData) {
        return;
      }
      const { id, value } = action.payload;
      state.formData = {
        ...state.formData,
        [id]: value
      };
    },
    addStage(state, action: PayloadAction<Stage>) {
      if (state.formData) {
        state.formData = {
          ...state.formData,
          opportunity_stages: [action.payload],
        };
      }
    },
    updateStatus(state, action: PayloadAction<string | null>) {
      if (state.formData) {
        state.formData.status = action.payload;
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
          opportunity_event: [...state.formData.opportunity_event, action.payload]
        };
      }
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
        state.formData.opportunity_event[eventIndex] = updatedEvent;
      }
    },
    removeEvent(state, action: PayloadAction<number>) {
      if (state.formData) {
        state.formData.opportunity_event = state.formData.opportunity_event.filter(
          (_, index) => index !== action.payload
        );
      }
    },
    removeTask(state, action: PayloadAction<number>) {
      if (state.formData) {
        state.formData.opportunity_task = state.formData.opportunity_task.filter(
          (_, index) => index !== action.payload
        );
      }
    },
    updateTask(state, action: PayloadAction<{ taskIndex: number; updatedTask: TaskDetails }>) {
      if (state.formData?.opportunity_task) {
        const { taskIndex, updatedTask } = action.payload;
        state.formData.opportunity_task[taskIndex] = updatedTask;
      }
    },
    
    // ✅ ADDED FOLLOWUP REDUCERS
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
    },
    removeFollowup(state, action: PayloadAction<number>) {
      if (state.formData) {
        state.formData.opportunity_followup = (
          state.formData.opportunity_followup || []
        ).filter((_, index) => index !== action.payload);
      }
    },
    // ✅ END FOLLOWUP REDUCERS

    submitForm(state) {
      if (state.formData) {
        postAdminEditOpportunityWorkspaceForm(state.formData as any);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAdminEditOpportunityWorkspaceForm.pending, (state) => {
        state.loading = true;
        state.users = null;
        state.error = null;
      })
      .addCase(postAdminEditOpportunityWorkspaceForm.fulfilled, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.error = null;
        state.data = { message: action.payload.message };
      })
      .addCase(postAdminEditOpportunityWorkspaceForm.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload?.toString() || 'Failed to submit form';
        state.data = { message: '' };
      })

      .addCase(fetchAdminOpportunityWorkspaceUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOpportunityWorkspaceUserById.fulfilled, (state, action: PayloadAction<FormData | null>) => {
        state.loading = false;
        const payload = action.payload as (FormData & { maintenance_amount?: number }) | null;
        state.formData = payload
          ? {
              ...initialFormData,
              ...payload,
              implementation_amount:
                payload.implementation_amount ?? payload.maintenance_amount ?? 0,
            }
          : initialFormData;
      })
      .addCase(fetchAdminOpportunityWorkspaceUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.toString() || 'Failed to fetch opportunity data';
      });
  },
});

// ✅ Exported addFollowupDetails and removeFollowup
export const { 
  clearEditOpportunityData, 
  setFormData, 
  addStage, 
  addPicDetails, 
  addEventDetails, 
  addTaskDetails, 
  submitForm, 
  updateEvent, 
  updateStatus, 
  removeEvent, 
  removeTask, 
  updateTask,
  addFollowupDetails, 
  removeFollowup
} = EditAdminOpportunityWorkspaceForm.actions;

export default EditAdminOpportunityWorkspaceForm.reducer;
