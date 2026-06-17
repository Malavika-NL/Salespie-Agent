// import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../../app/store';



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
// export const adminOpportunityFormData = createAsyncThunk<any[], void>(
//   'data/adminOpportunityFormData',
//   async (_,{getState,rejectWithValue}) => {
//     try {
//       const state = getState() as RootState;
//       const tokenData = state.userLoginAuth.user.tokens;
//       console.log(tokenData)
//       if (!tokenData.access) {
//         throw new Error('No access token available');
//       }
//       const response = await fetch('/opportunities/', {
//         headers: {
//             'content-type' : 'application/json',
//           Authorization: `Bearer ${tokenData.access}`,
//         },
//       });
//       console.log( 'opportunity data response', response)
//       const data: any[] = await response.json();
//       console.log(data)
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || 'Failed to submit form');
//   }}
// );




// interface OpportunityTableState {
//   loading: boolean;
//   AdminOpportunityData: any[];
//   error: string | null;
// }

// const initialState: OpportunityTableState = {
//   loading: false,
//   AdminOpportunityData: [],
//   error: null,
// };

// const adminOpportunityData = createSlice({
//   name: 'AdminopportunityTable',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(adminOpportunityFormData.pending, (state) => {
//         state.loading = true;
//         state.error = null; // Clear any previous errors
//       })
//       .addCase(adminOpportunityFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
//         state.loading = false;
//         state.AdminOpportunityData = action.payload;
//         state.error = null; // Clear any previous errors
//       })
//       .addCase(adminOpportunityFormData.rejected, (state, action) => {
//         state.loading = false;
//         state.AdminOpportunityData = [];
//         state.error = action.error.message || 'Unknown error';
//       });
//   },
// });

// export default adminOpportunityData.reducer;


// opportunityTableSlice.ts

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../app/axiosInstance';

export const adminOpportunityFormData = createAsyncThunk<any[], void>(
  'data/adminOpportunityFormData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/opportunities/');
      const payload = response.data;

      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.results)) return payload.results;

      return [];

    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.message ||
        'Failed to fetch opportunities'
      );
    }
  }
);

interface OpportunityTableState {
  loading:             boolean;
  AdminOpportunityData: any[];
  error:               string | null;
}

const initialState: OpportunityTableState = {
  loading:             false,
  AdminOpportunityData: [],
  error:               null,
};

const adminOpportunityData = createSlice({
  name: 'AdminopportunityTable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminOpportunityFormData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(adminOpportunityFormData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading             = false;
        state.AdminOpportunityData = action.payload;
        state.error               = null;
      })
      .addCase(adminOpportunityFormData.rejected, (state, action) => {
        state.loading             = false;
        state.AdminOpportunityData = [];
        state.error               = (action.payload as string) || action.error.message || 'Unknown error';
      });
  },
});

export default adminOpportunityData.reducer;
