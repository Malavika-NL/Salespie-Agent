// import { createAsyncThunk, createSlice,type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../../../app/store';



// export const fetchAdminOpportunityCategoryTotalData = createAsyncThunk<any[], void>(
//     'totaldata/fetchAdminOpportunityCategoryTotalData',
//     async (_, { getState, rejectWithValue }) => {
//       try {
//         const state = getState() as RootState;
//         const tokenData = state.userLoginAuth.user.tokens;
  
//         if (!tokenData.access) {
//           throw new Error('No access token available');
//         }
  
//         const response = await fetch('/opportunity-category-total/', {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${tokenData.access}`,
//           },
//         });
  
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
  
//         // console.log('response:' , response)
//         const data = await response.json(); // Parse the response as JSON
//         console.log('data:' , data)
//         return data; // Return the parsed data
  
//       } catch (error: any) {
//         return rejectWithValue(error.message || 'Failed to fetch opportunity category total data');
//       }
//     }
//   );
  



// interface OpportunityCategoryTotalState {
//   loading: boolean;
//   data: any[];
//   error: string | null;
// }

// const initialState: OpportunityCategoryTotalState = {
//   loading: false,
//   data: [],
//   error: null,
// };

// const opportunityAdminCategoryTotalData = createSlice({
//   name: 'opportunityAdminCategoryTotalData',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminOpportunityCategoryTotalData.pending, (state) => {
//         state.loading = true;
//         state.error = null; // Clear any previous errors
//       })
//       .addCase(fetchAdminOpportunityCategoryTotalData.fulfilled, (state, action: PayloadAction<any[]>) => {
//         state.loading = false;
//         state.data = action.payload;
//         state.error = null; // Clear any previous errors
//       })
//       .addCase(fetchAdminOpportunityCategoryTotalData.rejected, (state, action) => {
//         state.loading = false;
//         state.data = [];
//         state.error = action.error.message || 'Unknown error';
//       });
//   },
// });

// export default opportunityAdminCategoryTotalData.reducer;


// src/features/SalesAdminDashboard/Category Wise opportunity/slice/opportunityAdminCategoryTotal.ts

// import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../../../app/store';

// export const fetchAdminOpportunityCategoryTotalData = createAsyncThunk<any[], void>(
//   'totaldata/fetchAdminOpportunityCategoryTotalData',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       // ── Read globalFilter ──────────────────────────────────
//       const { selectedYear } = state.globalFilter;

//       // ✅ Fixed: added /api/ prefix + year param
//       const response = await fetch(
//         `/api/opportunity-category-total/?year=${selectedYear}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token.access}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       return data;

//     } catch (error: any) {
//       return rejectWithValue(
//         error.message || 'Failed to fetch opportunity category total data'
//       );
//     }
//   }
// );

// interface OpportunityCategoryTotalState {
//   loading: boolean;
//   data:    any[];
//   error:   string | null;
// }

// const initialState: OpportunityCategoryTotalState = {
//   loading: false,
//   data:    [],
//   error:   null,
// };

// const opportunityAdminCategoryTotalData = createSlice({
//   name: 'opportunityAdminCategoryTotalData',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminOpportunityCategoryTotalData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(
//         fetchAdminOpportunityCategoryTotalData.fulfilled,
//         (state, action: PayloadAction<any[]>) => {
//           state.loading = false;
//           state.data    = action.payload;
//           state.error   = null;
//         }
//       )
//       .addCase(fetchAdminOpportunityCategoryTotalData.rejected, (state, action) => {
//         state.loading = false;
//         state.data    = [];
//         state.error   = action.error.message || 'Unknown error';
//       });
//   },
// });

// export default opportunityAdminCategoryTotalData.reducer;


// import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../../../app/store';

// export const fetchAdminOpportunityCategoryTotalData = createAsyncThunk<any[], void>(
//   'totaldata/fetchAdminOpportunityCategoryTotalData',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth.user.tokens;
//       if (!token.access) throw new Error('No access token available');

//       const { selectedYear, selectedMonth, filterType } = state.globalFilter;

//       const query = new URLSearchParams();
//       query.set('year', String(selectedYear));
//       if (filterType === 'monthly') {
//         query.set('month', selectedMonth);
//       }

//       const response = await fetch(
//         `/api/opportunity-category-total/?${query.toString()}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token.access}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//       const data = await response.json();
//       return data;

//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed');
//     }
//   }
// );

// interface OpportunityCategoryTotalState {
//   loading: boolean;
//   data:    any[];
//   error:   string | null;
// }

// const initialState: OpportunityCategoryTotalState = {
//   loading: false,
//   data:    [],
//   error:   null,
// };

// const opportunityAdminCategoryTotalData = createSlice({
//   name: 'opportunityAdminCategoryTotalData',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminOpportunityCategoryTotalData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(
//         fetchAdminOpportunityCategoryTotalData.fulfilled,
//         (state, action: PayloadAction<any[]>) => {
//           state.loading = false;
//           state.data    = action.payload;
//           state.error   = null;
//         }
//       )
//       .addCase(fetchAdminOpportunityCategoryTotalData.rejected, (state, action) => {
//         state.loading = false;
//         state.data    = [];
//         state.error   = action.error.message || 'Unknown error';
//       });
//   },
// });

// export default opportunityAdminCategoryTotalData.reducer;


// // src/features/SalesAdminDashboard/Category Wise opportunity/slice/opportunityAdminCategoryTotal.ts
// import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../../../app/store';
// import axiosInstance from '../../../../app/axiosInstance';

// export const fetchAdminOpportunityCategoryTotalData = createAsyncThunk<any, void>(
//   'totaldata/fetchAdminOpportunityCategoryTotalData',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const { selectedYear, selectedMonth, filterType, selectedPic } = state.globalFilter;

//       const query = new URLSearchParams();
//       query.set('year', String(selectedYear));
//       if (filterType === 'monthly') {
//         query.set('month', selectedMonth);
//       }
//       if (selectedPic && selectedPic !== 'all') {
//         query.set('pic', selectedPic);
//       }

//       const response = await axiosInstance.get(
//         `/opportunity-category-total/?${query.toString()}`
//       );

//       return response.data;

//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data || error.message || 'Failed'
//       );
//     }
//   }
// );

// interface OpportunityCategoryTotalState {
//   loading: boolean;
//   data:    { labels: string[]; totals: number[] } | null;
//   error:   string | null;
// }

// const initialState: OpportunityCategoryTotalState = {
//   loading: false,
//   data:    null,
//   error:   null,
// };

// const opportunityAdminCategoryTotalData = createSlice({
//   name: 'opportunityAdminCategoryTotalData',
//   initialState,
//   reducers: {
//     clearCategoryData: (state) => { state.data = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminOpportunityCategoryTotalData.pending, (state) => {
//         state.loading = true;
//         state.error   = null;
//       })
//       .addCase(
//         fetchAdminOpportunityCategoryTotalData.fulfilled,
//         (state, action: PayloadAction<any>) => {
//           state.loading = false;
//           state.data    = action.payload;
//           state.error   = null;
//         }
//       )
//       .addCase(
//         fetchAdminOpportunityCategoryTotalData.rejected,
//         (state, action) => {
//           state.loading = false;
//           state.data    = null;
//           state.error   = action.error.message || 'Unknown error';
//         }
//       );
//   },
// });

// export const { clearCategoryData } = opportunityAdminCategoryTotalData.actions;
// export default opportunityAdminCategoryTotalData.reducer;


import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import axiosInstance from '../../../../app/axiosInstance';

export const fetchAdminOpportunityCategoryTotalData = createAsyncThunk<any, void>(
  'totaldata/fetchAdminOpportunityCategoryTotalData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { selectedYear, selectedMonth, filterType, selectedPic } = state.globalFilter;

      const query = new URLSearchParams();
      query.set('year', String(selectedYear));
      if (filterType === 'monthly') {
        query.set('month', selectedMonth);
      }
      if (selectedPic && selectedPic !== 'all') {
        query.set('pic', selectedPic);
      }

      const response = await axiosInstance.get(
        `/opportunity-category-total/?${query.toString()}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || error.message || 'Failed'
      );
    }
  }
);

export interface MakeItem {
  make: string;
  total_amount: number;
}

export interface HierarchicalItem {
  opportunity: string;
  total_amount: number;
  makes: MakeItem[];
}

interface OpportunityCategoryTotalState {
  loading: boolean;
  data: {
    labels: string[];
    totals: number[];
    hierarchical: HierarchicalItem[];
  } | null;
  error: string | null;
}

const initialState: OpportunityCategoryTotalState = {
  loading: false,
  data: null,
  error: null,
};

const opportunityAdminCategoryTotalData = createSlice({
  name: 'opportunityAdminCategoryTotalData',
  initialState,
  reducers: {
    clearCategoryData: (state) => { state.data = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOpportunityCategoryTotalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminOpportunityCategoryTotalData.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchAdminOpportunityCategoryTotalData.rejected,
        (state, action) => {
          state.loading = false;
          state.data = null;
          state.error = action.error.message || 'Unknown error';
        }
      );
  },
});

export const { clearCategoryData } = opportunityAdminCategoryTotalData.actions;
export default opportunityAdminCategoryTotalData.reducer;