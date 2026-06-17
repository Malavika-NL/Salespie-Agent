// // src/features/Budget/slice/budgetSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// const BASE = 'http://localhost:8000';

// const getToken = (state: any) =>
//   state.userLoginAuth?.tokens?.access ||
//   state.auth?.access ||
//   localStorage.getItem('access_token') || '';

// const authHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

// // ── Thunks ──────────────────────────────────────────────────

// export const fetchBudgets = createAsyncThunk(
//   'budget/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token = getToken(getState());
//       const res = await axios.get(`${BASE}/budgets/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const fetchBudgetDashboard = createAsyncThunk(
//   'budget/fetchDashboard',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const token = getToken(getState());
//       const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const createBudget = createAsyncThunk(
//   'budget/create',
//   async (data: any, { getState, rejectWithValue }) => {
//     try {
//       const token = getToken(getState());
//       const res = await axios.post(`${BASE}/budgets/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const updateBudget = createAsyncThunk(
//   'budget/update',
//   async ({ id, data }: { id: number; data: any }, { getState, rejectWithValue }) => {
//     try {
//       const token = getToken(getState());
//       const res = await axios.put(`${BASE}/budgets/${id}/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const deleteBudget = createAsyncThunk(
//   'budget/delete',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const token = getToken(getState());
//       await axios.delete(`${BASE}/budgets/${id}/`, { headers: authHeaders(token) });
//       return id;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const updateCategorySpend = createAsyncThunk(
//   'budget/updateSpend',
//   async ({ budgetId, categoryId, spent }: { budgetId: number; categoryId: number; spent: number }, { getState, rejectWithValue }) => {
//     try {
//       const token = getToken(getState());
//       const res = await axios.patch(
//         `${BASE}/budgets/${budgetId}/update-spend/`,
//         { category_id: categoryId, spent },
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const saveSnapshot = createAsyncThunk(
//   'budget/saveSnapshot',
//   async ({ budgetId, payload }: { budgetId: number; payload: any }, { getState, rejectWithValue }) => {
//     try {
//       const token = getToken(getState());
//       const res = await axios.post(
//         `${BASE}/budgets/${budgetId}/save-snapshot/`,
//         payload,
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// // ── State ────────────────────────────────────────────────────

// interface BudgetState {
//   budgets:    any[];
//   dashboard:  any | null;
//   loading:    boolean;
//   dashLoading:boolean;
//   error:      any;
//   saveStatus: 'idle' | 'saving' | 'saved' | 'error';
// }

// const initialState: BudgetState = {
//   budgets:    [],
//   dashboard:  null,
//   loading:    false,
//   dashLoading:false,
//   error:      null,
//   saveStatus: 'idle',
// };

// // ── Slice ────────────────────────────────────────────────────

// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     clearDashboard: (s) => { s.dashboard = null; },
//     resetSaveStatus:(s) => { s.saveStatus = 'idle'; },
//   },
//   extraReducers: (b) => {
//     // fetch all
//     b.addCase(fetchBudgets.pending,   (s) => { s.loading = true; s.error = null; });
//     b.addCase(fetchBudgets.fulfilled, (s, a) => { s.loading = false; s.budgets = a.payload; });
//     b.addCase(fetchBudgets.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });

//     // dashboard
//     b.addCase(fetchBudgetDashboard.pending,   (s) => { s.dashLoading = true; });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { s.dashLoading = false; s.dashboard = a.payload; });
//     b.addCase(fetchBudgetDashboard.rejected,  (s) => { s.dashLoading = false; });

//     // create
//     b.addCase(createBudget.pending,   (s) => { s.saveStatus = 'saving'; });
//     b.addCase(createBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       s.budgets.unshift(a.payload);
//     });
//     b.addCase(createBudget.rejected,  (s) => { s.saveStatus = 'error'; });

//     // update
//     b.addCase(updateBudget.pending,   (s) => { s.saveStatus = 'saving'; });
//     b.addCase(updateBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       const idx = s.budgets.findIndex(b => b.id === a.payload.id);
//       if (idx >= 0) s.budgets[idx] = a.payload;
//     });
//     b.addCase(updateBudget.rejected,  (s) => { s.saveStatus = 'error'; });

//     // delete
//     b.addCase(deleteBudget.fulfilled, (s, a) => {
//       s.budgets = s.budgets.filter(b => b.id !== a.payload);
//     });
//   },
// });

// export const { clearDashboard, resetSaveStatus } = budgetSlice.actions;
// export default budgetSlice.reducer;


// src/features/Budget/slice/budgetSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../app/store';

// const BASE = 'http://localhost:8000';

// // FIXED: Correct token path matching your TargetWorkspaceFormData slice
// const getToken = (state: RootState): string => {
//   const tokenData = state.userLoginAuth?.user?.tokens;
  
//   if (!tokenData?.access) {
//     console.error('No access token available');
//     return '';
//   }
  
//   return tokenData.access;
// };

// const authHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

// // ── Thunks ──────────────────────────────────────────────────

// export const fetchBudgets = createAsyncThunk(
//   'budget/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       const res = await axios.get(`${BASE}/budgets/`, { 
//         headers: authHeaders(token) 
//       });
//       return res.data;
//     } catch (e: any) { 
//       console.error('fetchBudgets error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const fetchBudgetDashboard = createAsyncThunk(
//   'budget/fetchDashboard',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, { 
//         headers: authHeaders(token) 
//       });
//       return res.data;
//     } catch (e: any) { 
//       console.error('fetchBudgetDashboard error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const createBudget = createAsyncThunk(
//   'budget/create',
//   async (data: any, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       const res = await axios.post(`${BASE}/budgets/`, data, { 
//         headers: authHeaders(token) 
//       });
//       return res.data;
//     } catch (e: any) { 
//       console.error('createBudget error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const updateBudget = createAsyncThunk(
//   'budget/update',
//   async ({ id, data }: { id: number; data: any }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       const res = await axios.put(`${BASE}/budgets/${id}/`, data, { 
//         headers: authHeaders(token) 
//       });
//       return res.data;
//     } catch (e: any) { 
//       console.error('updateBudget error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const deleteBudget = createAsyncThunk(
//   'budget/delete',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       await axios.delete(`${BASE}/budgets/${id}/`, { 
//         headers: authHeaders(token) 
//       });
//       return id;
//     } catch (e: any) { 
//       console.error('deleteBudget error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const updateCategorySpend = createAsyncThunk(
//   'budget/updateSpend',
//   async (
//     { budgetId, categoryId, spent }: { budgetId: number; categoryId: number; spent: number }, 
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       const res = await axios.patch(
//         `${BASE}/budgets/${budgetId}/update-spend/`,
//         { category_id: categoryId, spent },
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) { 
//       console.error('updateCategorySpend error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const saveSnapshot = createAsyncThunk(
//   'budget/saveSnapshot',
//   async (
//     { budgetId, payload }: { budgetId: number; payload: any }, 
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       const res = await axios.post(
//         `${BASE}/budgets/${budgetId}/save-snapshot/`,
//         payload,
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) { 
//       console.error('saveSnapshot error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// // ── State ────────────────────────────────────────────────────

// interface BudgetState {
//   budgets:     any[];
//   dashboard:   any | null;
//   loading:     boolean;
//   dashLoading: boolean;
//   error:       any;
//   saveStatus:  'idle' | 'saving' | 'saved' | 'error';
// }

// const initialState: BudgetState = {
//   budgets:     [],
//   dashboard:   null,
//   loading:     false,
//   dashLoading: false,
//   error:       null,
//   saveStatus:  'idle',
// };

// // ── Slice ────────────────────────────────────────────────────

// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     clearDashboard: (s) => { s.dashboard = null; },
//     resetSaveStatus: (s) => { s.saveStatus = 'idle'; },
//   },
//   extraReducers: (b) => {
//     // fetch all
//     b.addCase(fetchBudgets.pending, (s) => { 
//       s.loading = true; 
//       s.error = null; 
//     });
//     b.addCase(fetchBudgets.fulfilled, (s, a) => { 
//       s.loading = false; 
//       s.budgets = a.payload; 
//     });
//     b.addCase(fetchBudgets.rejected, (s, a) => { 
//       s.loading = false; 
//       s.error = a.payload; 
//     });

//     // dashboard
//     b.addCase(fetchBudgetDashboard.pending, (s) => { 
//       s.dashLoading = true; 
//     });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { 
//       s.dashLoading = false; 
//       s.dashboard = a.payload; 
//     });
//     b.addCase(fetchBudgetDashboard.rejected, (s) => { 
//       s.dashLoading = false; 
//     });

//     // create
//     b.addCase(createBudget.pending, (s) => { 
//       s.saveStatus = 'saving'; 
//     });
//     b.addCase(createBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       s.budgets.unshift(a.payload);
//     });
//     b.addCase(createBudget.rejected, (s, a) => { 
//       s.saveStatus = 'error'; 
//       s.error = a.payload;
//     });

//     // update
//     b.addCase(updateBudget.pending, (s) => { 
//       s.saveStatus = 'saving'; 
//     });
//     b.addCase(updateBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       const idx = s.budgets.findIndex(b => b.id === a.payload.id);
//       if (idx >= 0) s.budgets[idx] = a.payload;
//     });
//     b.addCase(updateBudget.rejected, (s, a) => { 
//       s.saveStatus = 'error'; 
//       s.error = a.payload;
//     });

//     // delete
//     b.addCase(deleteBudget.fulfilled, (s, a) => {
//       s.budgets = s.budgets.filter(b => b.id !== a.payload);
//     });
//   },
// });

// export const { clearDashboard, resetSaveStatus } = budgetSlice.actions;
// export default budgetSlice.reducer;
// ==========================================================================================================================
// src/features/Budget/slice/budgetSlice.ts

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../app/store';

// const BASE = 'http://localhost:8000';

// const getToken = (state: RootState): string => {
//   const tokenData = state.userLoginAuth?.user?.tokens;
//   if (!tokenData?.access) {
//     console.error('No access token available');
//     return '';
//   }
//   return tokenData.access;
// };

// const authHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

// // ── Existing Thunks ── (keep all existing ones)
// export const fetchBudgets = createAsyncThunk(
//   'budget/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
      
//       const res = await axios.get(`${BASE}/budgets/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { 
//       console.error('fetchBudgets error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const fetchBudgetDashboard = createAsyncThunk(
//   'budget/fetchDashboard',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
      
//       const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { 
//       console.error('fetchBudgetDashboard error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// // ← NEW: Current Month Thunk
// export const fetchCurrentMonthBudget = createAsyncThunk(
//   'budget/fetchCurrentMonth',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
      
//       if (!token) {
//         return rejectWithValue({ message: 'No access token available' });
//       }
      
//       const res = await axios.get(`${BASE}/budgets/current-month/`, {
//         headers: authHeaders(token),
//       });
//       return res.data;
//     } catch (e: any) {
//       console.error('fetchCurrentMonthBudget error:', e.response?.data);
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const createBudget = createAsyncThunk(
//   'budget/create',
//   async (data: any, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
      
//       const res = await axios.post(`${BASE}/budgets/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { 
//       console.error('createBudget error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const updateBudget = createAsyncThunk(
//   'budget/update',
//   async ({ id, data }: { id: number; data: any }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
      
//       const res = await axios.put(`${BASE}/budgets/${id}/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { 
//       console.error('updateBudget error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const deleteBudget = createAsyncThunk(
//   'budget/delete',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
      
//       await axios.delete(`${BASE}/budgets/${id}/`, { headers: authHeaders(token) });
//       return id;
//     } catch (e: any) { 
//       console.error('deleteBudget error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const updateCategorySpend = createAsyncThunk(
//   'budget/updateSpend',
//   async (
//     { budgetId, categoryId, spent }: { budgetId: number; categoryId: number; spent: number },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
      
//       const res = await axios.patch(
//         `${BASE}/budgets/${budgetId}/update-spend/`,
//         { category_id: categoryId, spent },
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) { 
//       console.error('updateCategorySpend error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// export const saveSnapshot = createAsyncThunk(
//   'budget/saveSnapshot',
//   async (
//     { budgetId, payload }: { budgetId: number; payload: any },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
      
//       const res = await axios.post(
//         `${BASE}/budgets/${budgetId}/save-snapshot/`,
//         payload,
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) { 
//       console.error('saveSnapshot error:', e.response?.data);
//       return rejectWithValue(e.response?.data); 
//     }
//   }
// );

// // ── State ────────────────────────────────────────────────────

// interface BudgetState {
//   budgets:     any[];
//   dashboard:   any | null;
//   currentMonth: any | null;  // ← NEW
//   loading:     boolean;
//   dashLoading: boolean;
//   currentMonthLoading: boolean;  // ← NEW
//   error:       any;
//   saveStatus:  'idle' | 'saving' | 'saved' | 'error';
// }

// const initialState: BudgetState = {
//   budgets:     [],
//   dashboard:   null,
//   currentMonth: null,  // ← NEW
//   loading:     false,
//   dashLoading: false,
//   currentMonthLoading: false,  // ← NEW
//   error:       null,
//   saveStatus:  'idle',
// };

// // ── Slice ────────────────────────────────────────────────────

// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     clearDashboard: (s) => { s.dashboard = null; },
//     resetSaveStatus: (s) => { s.saveStatus = 'idle'; },
//     clearCurrentMonth: (s) => { s.currentMonth = null; },  // ← NEW
//   },
//   extraReducers: (b) => {
//     // fetch all
//     b.addCase(fetchBudgets.pending, (s) => { 
//       s.loading = true; 
//       s.error = null; 
//     });
//     b.addCase(fetchBudgets.fulfilled, (s, a) => { 
//       s.loading = false; 
//       s.budgets = a.payload; 
//     });
//     b.addCase(fetchBudgets.rejected, (s, a) => { 
//       s.loading = false; 
//       s.error = a.payload; 
//     });

//     // dashboard
//     b.addCase(fetchBudgetDashboard.pending, (s) => { 
//       s.dashLoading = true; 
//     });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { 
//       s.dashLoading = false; 
//       s.dashboard = a.payload; 
//     });
//     b.addCase(fetchBudgetDashboard.rejected, (s) => { 
//       s.dashLoading = false; 
//     });

//     // ← NEW: current month
//     b.addCase(fetchCurrentMonthBudget.pending, (s) => {
//       s.currentMonthLoading = true;
//       s.error = null;
//     });
//     b.addCase(fetchCurrentMonthBudget.fulfilled, (s, a) => {
//       s.currentMonthLoading = false;
//       s.currentMonth = a.payload;
//     });
//     b.addCase(fetchCurrentMonthBudget.rejected, (s, a) => {
//       s.currentMonthLoading = false;
//       s.error = a.payload;
//     });

//     // create
//     b.addCase(createBudget.pending, (s) => { 
//       s.saveStatus = 'saving'; 
//     });
//     b.addCase(createBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       s.budgets.unshift(a.payload);
//     });
//     b.addCase(createBudget.rejected, (s, a) => { 
//       s.saveStatus = 'error'; 
//       s.error = a.payload;
//     });

//     // update
//     b.addCase(updateBudget.pending, (s) => { 
//       s.saveStatus = 'saving'; 
//     });
//     b.addCase(updateBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       const idx = s.budgets.findIndex(b => b.id === a.payload.id);
//       if (idx >= 0) s.budgets[idx] = a.payload;
//     });
//     b.addCase(updateBudget.rejected, (s, a) => { 
//       s.saveStatus = 'error'; 
//       s.error = a.payload;
//     });

//     // delete
//     b.addCase(deleteBudget.fulfilled, (s, a) => {
//       s.budgets = s.budgets.filter(b => b.id !== a.payload);
//     });
//   },
// });

// export const { clearDashboard, resetSaveStatus, clearCurrentMonth } = budgetSlice.actions;
// export default budgetSlice.reducer;



// src/features/Budget/slice/budgetSlice.ts

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../app/store';

// const BASE = 'http://localhost:8000';

// const getToken = (state: RootState): string => {
//   const tokenData = state.userLoginAuth?.user?.tokens;
//   if (!tokenData?.access) {
//     console.error('No access token available');
//     return '';
//   }
//   return tokenData.access;
// };

// const authHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

// export const fetchBudgets = createAsyncThunk(
//   'budget/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.get(`${BASE}/budgets/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchBudgetDashboard = createAsyncThunk(
//   'budget/fetchDashboard',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchCurrentMonthBudget = createAsyncThunk(
//   'budget/fetchCurrentMonth',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.get(`${BASE}/budgets/current-month/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const createBudget = createAsyncThunk(
//   'budget/create',
//   async (data: any, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.post(`${BASE}/budgets/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const updateBudget = createAsyncThunk(
//   'budget/update',
//   async ({ id, data }: { id: number; data: any }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.put(`${BASE}/budgets/${id}/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const deleteBudget = createAsyncThunk(
//   'budget/delete',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       await axios.delete(`${BASE}/budgets/${id}/`, { headers: authHeaders(token) });
//       return id;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // Update spend for a specific category + specific month
// export const updateCategorySpend = createAsyncThunk(
//   'budget/updateSpend',
//   async (
//     {
//       budgetId,
//       categoryId,
//       spent,
//       month,
//     }: { budgetId: number; categoryId: number; spent: number; month?: string },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.patch(
//         `${BASE}/budgets/${budgetId}/update-spend/`,
//         { category_id: categoryId, spent, month },
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // Update period entry allocations for a specific month
// export const updateMonthAllocations = createAsyncThunk(
//   'budget/updateMonthAllocations',
//   async (
//     {
//       budgetId,
//       month,
//       entries,
//     }: { budgetId: number; month: string; entries: { category_id: number; allocated: number; spent: number }[] },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.post(
//         `${BASE}/budgets/${budgetId}/month-allocations/`,
//         { month, entries },
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const saveSnapshot = createAsyncThunk(
//   'budget/saveSnapshot',
//   async (
//     { budgetId, payload }: { budgetId: number; payload: any },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.post(
//         `${BASE}/budgets/${budgetId}/save-snapshot/`,
//         payload,
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // ── State ────────────────────────────────────────────────────

// interface BudgetState {
//   budgets: any[];
//   dashboard: any | null;
//   currentMonth: any | null;
//   loading: boolean;
//   dashLoading: boolean;
//   currentMonthLoading: boolean;
//   monthSaving: boolean;
//   error: any;
//   saveStatus: 'idle' | 'saving' | 'saved' | 'error';
// }

// const initialState: BudgetState = {
//   budgets: [],
//   dashboard: null,
//   currentMonth: null,
//   loading: false,
//   dashLoading: false,
//   currentMonthLoading: false,
//   monthSaving: false,
//   error: null,
//   saveStatus: 'idle',
// };

// // ── Slice ────────────────────────────────────────────────────

// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     clearDashboard: (s) => { s.dashboard = null; },
//     resetSaveStatus: (s) => { s.saveStatus = 'idle'; },
//     clearCurrentMonth: (s) => { s.currentMonth = null; },
//   },
//   extraReducers: (b) => {
//     b.addCase(fetchBudgets.pending, (s) => { s.loading = true; s.error = null; });
//     b.addCase(fetchBudgets.fulfilled, (s, a) => { s.loading = false; s.budgets = a.payload; });
//     b.addCase(fetchBudgets.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

//     b.addCase(fetchBudgetDashboard.pending, (s) => { s.dashLoading = true; });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { s.dashLoading = false; s.dashboard = a.payload; });
//     b.addCase(fetchBudgetDashboard.rejected, (s) => { s.dashLoading = false; });

//     b.addCase(fetchCurrentMonthBudget.pending, (s) => { s.currentMonthLoading = true; s.error = null; });
//     b.addCase(fetchCurrentMonthBudget.fulfilled, (s, a) => { s.currentMonthLoading = false; s.currentMonth = a.payload; });
//     b.addCase(fetchCurrentMonthBudget.rejected, (s, a) => { s.currentMonthLoading = false; s.error = a.payload; });

//     b.addCase(createBudget.pending, (s) => { s.saveStatus = 'saving'; });
//     b.addCase(createBudget.fulfilled, (s, a) => { s.saveStatus = 'saved'; s.budgets.unshift(a.payload); });
//     b.addCase(createBudget.rejected, (s, a) => { s.saveStatus = 'error'; s.error = a.payload; });

//     b.addCase(updateBudget.pending, (s) => { s.saveStatus = 'saving'; });
//     b.addCase(updateBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       const idx = s.budgets.findIndex(bgt => bgt.id === a.payload.id);
//       if (idx >= 0) s.budgets[idx] = a.payload;
//     });
//     b.addCase(updateBudget.rejected, (s, a) => { s.saveStatus = 'error'; s.error = a.payload; });

//     b.addCase(deleteBudget.fulfilled, (s, a) => {
//       s.budgets = s.budgets.filter(bgt => bgt.id !== a.payload);
//     });

//     b.addCase(updateMonthAllocations.pending, (s) => { s.monthSaving = true; });
//     b.addCase(updateMonthAllocations.fulfilled, (s, a) => {
//       s.monthSaving = false;
//       if (s.dashboard) s.dashboard = { ...s.dashboard, ...a.payload };
//     });
//     b.addCase(updateMonthAllocations.rejected, (s, a) => { s.monthSaving = false; s.error = a.payload; });
//   },
// });

// export const { clearDashboard, resetSaveStatus, clearCurrentMonth } = budgetSlice.actions;
// export default budgetSlice.reducer;

// src/features/Budget/slice/budgetSlice.ts

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../app/store';

// // ... (getToken and authHeaders helpers remain the same) ...
// const BASE = '/api';

// const getToken = (state: RootState): string => {
//   const tokenData = state.userLoginAuth?.user?.tokens;
//   if (!tokenData?.access) {
//     console.error('No access token available');
//     return '';
//   }
//   return tokenData.access;
// };

// const authHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });


// // ... (fetchBudgets, fetchBudgetDashboard, fetchCurrentMonthBudget remain the same) ...
// export const fetchBudgets = createAsyncThunk(
//   'budget/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.get(`${BASE}/budgets/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchBudgetDashboard = createAsyncThunk(
//   'budget/fetchDashboard',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchCurrentMonthBudget = createAsyncThunk(
//   'budget/fetchCurrentMonth',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.get(`${BASE}/budgets/current-month/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const createBudget = createAsyncThunk(
//   'budget/create',
//   async (data: any, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.post(`${BASE}/budgets/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const updateBudget = createAsyncThunk(
//   'budget/update',
//   async ({ id, data }: { id: number; data: any }, { getState, rejectWithValue, dispatch }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       // We use PUT for update as per the new backend serializer logic
//       const res = await axios.put(`${BASE}/budgets/${id}/`, data, { headers: authHeaders(token) });
//       // FIX: After updating, fetch the fresh dashboard data to ensure the UI is in sync
//       dispatch(fetchBudgetDashboard(id));
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // ... (deleteBudget, updateCategorySpend, updateMonthAllocations, saveSnapshot remain the same) ...
// export const deleteBudget = createAsyncThunk(
//   'budget/delete',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       await axios.delete(`${BASE}/budgets/${id}/`, { headers: authHeaders(token) });
//       return id;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const updateCategorySpend = createAsyncThunk(
//   'budget/updateSpend',
//   async (
//     {
//       budgetId,
//       categoryId,
//       spent,
//       month,
//     }: { budgetId: number; categoryId: number; spent: number; month?: string },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.patch(
//         `${BASE}/budgets/${budgetId}/update-spend/`,
//         { category_id: categoryId, spent, month },
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // budgetSlice.ts — update the type signature
// export const updateMonthAllocations = createAsyncThunk(
//   'budget/updateMonthAllocations',
//   async (
//     {
//       budgetId,
//       month,
//       entries,
//     }: {
//       budgetId: number;
//       month: string;
//       entries: {
//         category_id:    number;
//         subcategory_id?: number | null;
//         allocated:      number;
//         spent:          number;
//       }[];
//     },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.post(
//         `/api/budgets/${budgetId}/month-allocations/`,
//         { month, entries },
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const saveSnapshot = createAsyncThunk(
//   'budget/saveSnapshot',
//   async (
//     { budgetId, payload }: { budgetId: number; payload: any },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       if (!token) return rejectWithValue({ message: 'No access token available' });
//       const res = await axios.post(
//         `${BASE}/budgets/${budgetId}/save-snapshot/`,
//         payload,
//         { headers: authHeaders(token) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );
// export const fetchSalesPersons = createAsyncThunk(
//   'budget/fetchSalesPersons',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth?.user?.tokens.access;
//       const res = await axios.get('/api/budgets/sales-persons/', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchTeamSummary = createAsyncThunk(
//   'budget/fetchTeamSummary',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth?.user?.tokens.access;
//       const res = await axios.get('/api/budgets/team-summary/', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // ── State ────────────────────────────────────────────────────
// // ... (State interface and initialState remain the same) ...
// interface BudgetState {
//   budgets: any[];
//   salesPersons: any[]; // New
//   teamSummary: any[]; 
//   dashboard: any | null;
//   currentMonth: any | null;
//   loading: boolean;
//   dashLoading: boolean;
//   currentMonthLoading: boolean;
//   monthSaving: boolean;
//   error: any;
//   saveStatus: 'idle' | 'saving' | 'saved' | 'error';
// }

// const initialState: BudgetState = {
//   budgets: [],
//   salesPersons: [], // Initialize as empty array here
//   teamSummary: [],
//   dashboard: null,
//   currentMonth: null,
//   loading: false,
//   dashLoading: false,
//   currentMonthLoading: false,
//   monthSaving: false,
//   error: null,
//   saveStatus: 'idle',
// };


// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     clearDashboard: (s) => {
//       s.dashboard = null;
//     },
//     resetSaveStatus: (s) => {
//       s.saveStatus = 'idle';
//     },
//     clearCurrentMonth: (s) => {
//       s.currentMonth = null;
//     },
//   },
//   extraReducers: (b) => {
//     b.addCase(fetchBudgets.pending, (s) => { s.loading = true; s.error = null; });
//     b.addCase(fetchBudgets.fulfilled, (s, a) => { s.loading = false; s.budgets = a.payload; });
//     b.addCase(fetchBudgets.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

//     b.addCase(fetchBudgetDashboard.pending, (s) => { s.dashLoading = true; });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { s.dashLoading = false; s.dashboard = a.payload; });
//     b.addCase(fetchBudgetDashboard.rejected, (s, a) => { s.dashLoading = false; s.error = a.payload; });

//     b.addCase(createBudget.pending, (s) => { s.saveStatus = 'saving'; });
//     b.addCase(createBudget.fulfilled, (s, a) => { s.saveStatus = 'saved'; s.budgets.unshift(a.payload); });
//     b.addCase(createBudget.rejected, (s, a) => { s.saveStatus = 'error'; s.error = a.payload; });

//     b.addCase(updateBudget.pending, (s) => { s.saveStatus = 'saving'; });
//     b.addCase(updateBudget.fulfilled, (s, a) => {
//       s.saveStatus = 'saved';
//       // FIX: Update the list and also the active dashboard if it matches
//       const idx = s.budgets.findIndex(bgt => bgt.id === a.payload.id);
//       if (idx >= 0) s.budgets[idx] = a.payload;
//       if (s.dashboard && s.dashboard.id === a.payload.id) {
//           s.dashboard = { ...s.dashboard, ...a.payload };
//       }
//     });
//     b.addCase(updateBudget.rejected, (s, a) => { s.saveStatus = 'error'; s.error = a.payload; });

//     b.addCase(deleteBudget.fulfilled, (s, a) => {
//       s.budgets = s.budgets.filter(bgt => bgt.id !== a.payload);
//     });
//     b.addCase(fetchCurrentMonthBudget.pending, (s) => { 
//       s.currentMonthLoading = true; 
//       s.error = null; 
//   });
//   b.addCase(fetchCurrentMonthBudget.fulfilled, (s, a) => { 
//       s.currentMonthLoading = false; 
//       s.currentMonth = a.payload;       // ← this is what Home.tsx reads
//   });
//   b.addCase(fetchCurrentMonthBudget.rejected, (s, a) => { 
//       s.currentMonthLoading = false; 
//       s.error = a.payload; 
//   });
//     b.addCase(updateMonthAllocations.pending, (s) => { s.monthSaving = true; });
//     b.addCase(updateMonthAllocations.fulfilled, (s, a) => {
//       s.monthSaving = false;
//       // When month allocations are saved, the backend returns the whole dashboard.
//       // Update the dashboard state with this fresh data.
//       if (s.dashboard) s.dashboard = a.payload;
//     });
//     b.addCase(updateMonthAllocations.rejected, (s, a) => { s.monthSaving = false; s.error = a.payload; });
//   },
// });

// export const { clearDashboard, resetSaveStatus, clearCurrentMonth } = budgetSlice.actions;
// export default budgetSlice.reducer;


// // src/features/Budget/slice/budgetSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../app/store';

// const BASE = '/api';

// const getToken = (state: RootState): string => {
//   const tokenData = state.userLoginAuth?.user?.tokens;
//   return tokenData?.access || '';
// };

// const authHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

// // --- Thunks ---

// export const fetchSalesPersons = createAsyncThunk(
//   'budget/fetchSalesPersons',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.get(`${BASE}/budgets/sales-persons/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const fetchTeamSummary = createAsyncThunk(
//   'budget/fetchTeamSummary',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.get(`${BASE}/budgets/team-summary/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const fetchBudgets = createAsyncThunk(
//   'budget/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.get(`${BASE}/budgets/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const fetchBudgetDashboard = createAsyncThunk(
//   'budget/fetchDashboard',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// // RESTORED: Needed by Home.tsx
// export const fetchCurrentMonthBudget = createAsyncThunk(
//   'budget/fetchCurrentMonth',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.get(`${BASE}/budgets/current-month/`, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const createBudget = createAsyncThunk(
//   'budget/create',
//   async (data: any, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.post(`${BASE}/budgets/`, data, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const updateBudget = createAsyncThunk(
//   'budget/update',
//   async ({ id, data }: { id: number; data: any }, { getState, rejectWithValue, dispatch }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.put(`${BASE}/budgets/${id}/`, data, { headers: authHeaders(token) });
//       dispatch(fetchBudgetDashboard(id));
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const deleteBudget = createAsyncThunk(
//   'budget/delete',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       await axios.delete(`${BASE}/budgets/${id}/`, { headers: authHeaders(token) });
//       return id;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// export const updateMonthAllocations = createAsyncThunk(
//   'budget/updateMonthAllocations',
//   async ({ budgetId, month, entries }: { budgetId: number; month: string; entries: any[] }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.post(`${BASE}/budgets/${budgetId}/month-allocations/`, { month, entries }, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );

// // RESTORED: Needed by Dashboard
// export const saveSnapshot = createAsyncThunk(
//   'budget/saveSnapshot',
//   async ({ budgetId, payload }: { budgetId: number; payload: any }, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);
//       const res = await axios.post(`${BASE}/budgets/${budgetId}/save-snapshot/`, payload, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) { return rejectWithValue(e.response?.data); }
//   }
// );
// export const fetchGlobalCategories = createAsyncThunk(
//   'budget/fetchGlobalCategories',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = state.userLoginAuth?.user?.tokens?.access;
//       // You'll need an endpoint that returns all your predefined categories/subs
//       const res = await axios.get('/api/budget-categories/', { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );
// // --- Slice ---

// interface BudgetState {
//   budgets: any[];
//   categories: any[];
//   salesPersons: any[];
//   teamSummary: any[];
//   dashboard: any | null;
//   currentMonth: any | null;
//   loading: boolean;
//   dashLoading: boolean;
//   currentMonthLoading: boolean;
//   monthSaving: boolean;
//   error: any;
//   saveStatus: 'idle' | 'saving' | 'saved' | 'error';
// }

// const initialState: BudgetState = {
//   budgets: [],
//   categories: [],
//   salesPersons: [],
//   teamSummary: [],
//   dashboard: null,
//   currentMonth: null,
//   loading: false,
//   dashLoading: false,
//   currentMonthLoading: false,
//   monthSaving: false,
//   error: null,
//   saveStatus: 'idle',
// };

// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     clearDashboard: (s) => { s.dashboard = null; },
//     resetSaveStatus: (s) => { s.saveStatus = 'idle'; },
//     clearCurrentMonth: (s) => { s.currentMonth = null; },
//   },
//   extraReducers: (b) => {
//     b.addCase(fetchSalesPersons.fulfilled, (s, a) => { s.salesPersons = a.payload; });
//     b.addCase(fetchTeamSummary.fulfilled, (s, a) => { s.teamSummary = a.payload; });

//     b.addCase(fetchBudgets.pending, (s) => { s.loading = true; });
//     b.addCase(fetchBudgets.fulfilled, (s, a) => { s.loading = false; s.budgets = a.payload; });
    
//     b.addCase(fetchBudgetDashboard.pending, (s) => { s.dashLoading = true; });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { s.dashLoading = false; s.dashboard = a.payload; });
    
//     b.addCase(fetchCurrentMonthBudget.pending, (s) => { s.currentMonthLoading = true; });
//     b.addCase(fetchCurrentMonthBudget.fulfilled, (s, a) => { s.currentMonthLoading = false; s.currentMonth = a.payload; });

//     b.addCase(createBudget.pending, (s) => { s.saveStatus = 'saving'; });
//     b.addCase(createBudget.fulfilled, (s, a) => { s.saveStatus = 'saved'; s.budgets.unshift(a.payload); });
//     b.addCase(createBudget.rejected, (s) => { s.saveStatus = 'error'; });

//     b.addCase(updateBudget.pending, (s) => { s.saveStatus = 'saving'; });
//     b.addCase(updateBudget.fulfilled, (s) => { s.saveStatus = 'saved'; });

//     b.addCase(deleteBudget.fulfilled, (s, a) => { s.budgets = s.budgets.filter(b => b.id !== a.payload); });

//     b.addCase(updateMonthAllocations.pending, (s) => { s.monthSaving = true; });
//     b.addCase(updateMonthAllocations.fulfilled, (s, a) => { s.monthSaving = false; s.dashboard = a.payload; });
//   },
// });

// export const { clearDashboard, resetSaveStatus, clearCurrentMonth } = budgetSlice.actions;
// export default budgetSlice.reducer;


// src/features/Budget/slice/budgetSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../app/store';

// const BASE = '/api';

// const getToken = (state: RootState): string => state.userLoginAuth?.user?.tokens?.access || '';
// const authHeaders = (token: string) => ({ 
//     Authorization: `Bearer ${token}`, 
//     'Content-Type': 'application/json' 
// });

// // ─── THUNKS ───────────────────────────────────────────────────────────────────

// export const fetchSalesPersons = createAsyncThunk('budget/fetchSalesPersons', async (_, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.get(`${BASE}/budgets/sales-persons/`, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// export const fetchGlobalCategories = createAsyncThunk('budget/fetchGlobalCategories', async (_, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.get(`${BASE}/budget-categories/`, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// export const addGlobalCategory = createAsyncThunk('budget/addGlobalCategory', async (name: string, { getState, dispatch }) => {
//   await axios.post(`${BASE}/budget-categories/`, { name }, { headers: authHeaders(getToken(getState() as RootState)) });
//   dispatch(fetchGlobalCategories());
// });

// export const addGlobalSubCategory = createAsyncThunk('budget/addGlobalSubCategory', async (data: { categoryId: number, name: string }, { getState, dispatch }) => {
//   await axios.post(`${BASE}/budget-subcategories/`, { category: data.categoryId, name: data.name }, { headers: authHeaders(getToken(getState() as RootState)) });
//   dispatch(fetchGlobalCategories());
// });

// export const fetchTeamSummary = createAsyncThunk('budget/fetchTeamSummary', async (_, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.get(`${BASE}/budgets/team-summary/`, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// export const fetchBudgets = createAsyncThunk('budget/fetchAll', async (_, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.get(`${BASE}/budgets/`, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// export const fetchBudgetDashboard = createAsyncThunk('budget/fetchDashboard', async (id: number, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// // RESTORED: Needed by Home.tsx
// // export const fetchCurrentMonthBudget = createAsyncThunk('budget/fetchCurrentMonth', async (_, { getState, rejectWithValue }) => {
// //   try {
// //     const res = await axios.get(`${BASE}/budgets/current-month/`, { headers: authHeaders(getToken(getState() as RootState)) });
// //     return res.data;
// //   } catch (e: any) { return rejectWithValue(e.response?.data); }
// // });
// export const fetchCurrentMonthBudget = createAsyncThunk(
//   'budget/fetchCurrentMonth',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);

//       // ── Read globalFilter ──────────────────────────────────
//       const globalFilter = (state as any).globalFilter;
//       const selectedYear  = globalFilter?.selectedYear;
//       const selectedMonth = globalFilter?.selectedMonth;
//       const filterType    = globalFilter?.filterType;

//       // Build query params
//       const query = new URLSearchParams();
//       if (selectedYear) {
//         query.set('year', String(selectedYear));
//       }
//       if (filterType === 'monthly' && selectedMonth) {
//         query.set('month', selectedMonth);
//       }

//       const url = `${BASE}/budgets/current-month/${
//         query.toString() ? '?' + query.toString() : ''
//       }`;

//       const res = await axios.get(url, {
//         headers: authHeaders(token),
//       });
//       return res.data;

//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchBudgetEmployeeSummary = createAsyncThunk(
//   'budget/fetchEmployeeSummary',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         `${BASE}/budgets/${id}/employee-summary/`,
//         { headers: authHeaders(getToken(getState() as RootState)) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const createBudget = createAsyncThunk('budget/create', async (data: any, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.post(`${BASE}/budgets/`, data, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// export const updateBudget = createAsyncThunk('budget/update', async ({ id, data }: { id: number; data: any }, { getState, rejectWithValue, dispatch }) => {
//   try {
//     const res = await axios.put(`${BASE}/budgets/${id}/`, data, { headers: authHeaders(getToken(getState() as RootState)) });
//     dispatch(fetchBudgetDashboard(id));
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// export const deleteBudget = createAsyncThunk('budget/delete', async (id: number, { getState, rejectWithValue }) => {
//   try {
//     await axios.delete(`${BASE}/budgets/${id}/`, { headers: authHeaders(getToken(getState() as RootState)) });
//     return id;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// export const updateMonthAllocations = createAsyncThunk('budget/updateMonthAllocations', async (data: { budgetId: number, month: string, entries: any[] }, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.post(`${BASE}/budgets/${data.budgetId}/month-allocations/`, { month: data.month, entries: data.entries }, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });

// // RESTORED: Needed by BudgetDashboard
// export const saveSnapshot = createAsyncThunk('budget/saveSnapshot', async (data: { budgetId: number, payload: any }, { getState, rejectWithValue }) => {
//   try {
//     const res = await axios.post(`${BASE}/budgets/${data.budgetId}/save-snapshot/`, data.payload, { headers: authHeaders(getToken(getState() as RootState)) });
//     return res.data;
//   } catch (e: any) { return rejectWithValue(e.response?.data); }
// });
// export const deleteGlobalCategory = createAsyncThunk(
//   'budget/deleteGlobalCategory',
//   async (id: number, { getState, dispatch }) => {
//     await axios.delete(`${BASE}/budget-categories/${id}/`, {
//       headers: authHeaders(getToken(getState() as RootState))
//     });
//     dispatch(fetchGlobalCategories());
//   }
// );

// export const deleteGlobalSubCategory = createAsyncThunk(
//   'budget/deleteGlobalSubCategory',
//   async (id: number, { getState, dispatch }) => {
//     await axios.delete(`${BASE}/budget-subcategories/${id}/`, {
//       headers: authHeaders(getToken(getState() as RootState))
//     });
//     dispatch(fetchGlobalCategories());
//   }
// );
// export const fetchPerUserAchievement = createAsyncThunk(
//   'budget/fetchPerUserAchievement',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/per-user-rank-a/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchAdminBudgetSummary = createAsyncThunk(
//   'budget/fetchAdminSummary',
//   async (
//     params: { month?: string; year?: number } = {},
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const token = getToken(state);

//       // Build query string
//       const query = new URLSearchParams();
//       if (params.year)  query.set('year',  String(params.year));
//       if (params.month) query.set('month', params.month);

//       const url = `${BASE}/admin-budget-summary/${
//         query.toString() ? '?' + query.toString() : ''
//       }`;

//       const res = await axios.get(url, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // Add to extraReducers


// // ─── SLICE ────────────────────────────────────────────────────────────────────

// interface BudgetState {
//   budgets: any[];
//   salesPersons: any[];
//   categories: any[];
//   teamSummary: any[];
//   dashboard: any | null;
//   currentMonth: any | null;
//   loading: boolean;
//   dashLoading: boolean;
//   monthSaving: boolean;
//   saveStatus: 'idle' | 'saving' | 'saved' | 'error';
//   teamSummaryError: string | null;
//   perUserAchievement: any[];
//   adminSummary: any | null;
//   adminSummaryLoading: boolean;
//   employeeSummary: any | null;
//   empSummaryLoading: boolean;
// }

// const initialState: BudgetState = {
//   budgets: [],
//   salesPersons: [],
//   categories: [],
//   teamSummary: [],
//   dashboard: null,
//   currentMonth: null,
//   loading: false,
//   dashLoading: false,
//   monthSaving: false,
//   saveStatus: 'idle',
//   teamSummaryError: null,
//   perUserAchievement: [],
//   adminSummary: null,
//   adminSummaryLoading: false,
//   employeeSummary: null,
//   empSummaryLoading: false,
// };

// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     resetSaveStatus: (s) => { s.saveStatus = 'idle'; },
//     clearDashboard: (s) => { s.dashboard = null; },
//     clearCurrentMonth: (s) => { s.currentMonth = null; },
//   },
//   extraReducers: (b) => {
//     b.addCase(fetchSalesPersons.fulfilled, (s, a) => { s.salesPersons = a.payload; });
//     b.addCase(fetchGlobalCategories.fulfilled, (s, a) => { s.categories = a.payload; });
//     b.addCase(fetchTeamSummary.fulfilled, (s, a) => { s.teamSummary = a.payload; });

//     b.addCase(fetchBudgets.pending, (s) => { s.loading = true; });
//     b.addCase(fetchBudgets.fulfilled, (s, a) => { s.loading = false; s.budgets = a.payload; });

//     b.addCase(fetchBudgetDashboard.pending, (s) => { s.dashLoading = true; });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { s.dashLoading = false; s.dashboard = a.payload; });

//     b.addCase(fetchCurrentMonthBudget.fulfilled, (s, a) => { s.currentMonth = a.payload; });

//     b.addCase(createBudget.pending, (s) => { s.saveStatus = 'saving'; });
//     b.addCase(createBudget.fulfilled, (s, a) => { 
//         s.saveStatus = 'saved'; 
//         s.budgets.unshift(a.payload); 
//     });
//     b.addCase(createBudget.rejected, (s) => { s.saveStatus = 'error'; });

//     b.addCase(updateBudget.fulfilled, (s) => { s.saveStatus = 'saved'; });
//     b.addCase(deleteBudget.fulfilled, (s, a) => { s.budgets = s.budgets.filter(b => b.id !== a.payload); });
//     b.addCase(updateMonthAllocations.fulfilled, (s, a) => { s.dashboard = a.payload; });
//     b.addCase(fetchPerUserAchievement.fulfilled, (s, a) => {
//   s.perUserAchievement = a.payload;
  
// });
// b.addCase(fetchBudgetEmployeeSummary.pending, (s) => { s.empSummaryLoading = true; });
// b.addCase(fetchBudgetEmployeeSummary.fulfilled, (s, a) => {
//   s.empSummaryLoading = false;
//   s.employeeSummary = a.payload;
// });
// b.addCase(fetchBudgetEmployeeSummary.rejected, (s) => { s.empSummaryLoading = false; });
// b.addCase(fetchAdminBudgetSummary.pending,   (s) => { s.adminSummaryLoading = true; });
// b.addCase(fetchAdminBudgetSummary.fulfilled, (s, a) => {
//   s.adminSummaryLoading = false;
//   s.adminSummary = a.payload;
// });
// b.addCase(fetchAdminBudgetSummary.rejected,  (s) => { s.adminSummaryLoading = false; });
//   },
// });

// export const { resetSaveStatus, clearDashboard, clearCurrentMonth } = budgetSlice.actions;
// export default budgetSlice.reducer;

// // src/features/Budget/slice/budgetSlice.ts
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import type { RootState } from '../../../app/store';

// const BASE = '/api';

// const getToken = (state: RootState): string =>
//   state.userLoginAuth?.user?.tokens?.access || '';

// const authHeaders = (token: string) => ({
//   Authorization: `Bearer ${token}`,
//   'Content-Type': 'application/json',
// });

// // ─── THUNKS ───────────────────────────────────────────────────────────────────

// export const fetchSalesPersons = createAsyncThunk(
//   'budget/fetchSalesPersons',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/budgets/sales-persons/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchGlobalCategories = createAsyncThunk(
//   'budget/fetchGlobalCategories',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/budget-categories/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const addGlobalCategory = createAsyncThunk(
//   'budget/addGlobalCategory',
//   async (name: string, { getState, dispatch }) => {
//     await axios.post(
//       `${BASE}/budget-categories/`,
//       { name },
//       { headers: authHeaders(getToken(getState() as RootState)) }
//     );
//     dispatch(fetchGlobalCategories());
//   }
// );

// export const addGlobalSubCategory = createAsyncThunk(
//   'budget/addGlobalSubCategory',
//   async (data: { categoryId: number; name: string }, { getState, dispatch }) => {
//     await axios.post(
//       `${BASE}/budget-subcategories/`,
//       { category: data.categoryId, name: data.name },
//       { headers: authHeaders(getToken(getState() as RootState)) }
//     );
//     dispatch(fetchGlobalCategories());
//   }
// );

// export const deleteGlobalCategory = createAsyncThunk(
//   'budget/deleteGlobalCategory',
//   async (id: number, { getState, dispatch }) => {
//     await axios.delete(`${BASE}/budget-categories/${id}/`, {
//       headers: authHeaders(getToken(getState() as RootState)),
//     });
//     dispatch(fetchGlobalCategories());
//   }
// );

// export const deleteGlobalSubCategory = createAsyncThunk(
//   'budget/deleteGlobalSubCategory',
//   async (id: number, { getState, dispatch }) => {
//     await axios.delete(`${BASE}/budget-subcategories/${id}/`, {
//       headers: authHeaders(getToken(getState() as RootState)),
//     });
//     dispatch(fetchGlobalCategories());
//   }
// );

// export const fetchTeamSummary = createAsyncThunk(
//   'budget/fetchTeamSummary',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/budgets/team-summary/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchBudgets = createAsyncThunk(
//   'budget/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/budgets/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchBudgetDashboard = createAsyncThunk(
//   'budget/fetchDashboard',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/budgets/${id}/dashboard/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchCurrentMonthBudget = createAsyncThunk(
//   'budget/fetchCurrentMonth',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state      = getState() as RootState;
//       const token      = getToken(state);
//       const globalFilter = (state as any).globalFilter;
//       const selectedYear  = globalFilter?.selectedYear;
//       const selectedMonth = globalFilter?.selectedMonth;
//       const filterType    = globalFilter?.filterType;

//       const query = new URLSearchParams();
//       if (selectedYear) query.set('year', String(selectedYear));
//       if (filterType === 'monthly' && selectedMonth) query.set('month', selectedMonth);

//       const url = `${BASE}/budgets/current-month/${
//         query.toString() ? '?' + query.toString() : ''
//       }`;

//       const res = await axios.get(url, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchBudgetEmployeeSummary = createAsyncThunk(
//   'budget/fetchEmployeeSummary',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/budgets/${id}/employee-summary/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const createBudget = createAsyncThunk(
//   'budget/create',
//   async (data: any, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.post(`${BASE}/budgets/`, data, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const updateBudget = createAsyncThunk(
//   'budget/update',
//   async (
//     { id, data }: { id: number; data: any },
//     { getState, rejectWithValue, dispatch }
//   ) => {
//     try {
//       const res = await axios.put(`${BASE}/budgets/${id}/`, data, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       dispatch(fetchBudgetDashboard(id));
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const deleteBudget = createAsyncThunk(
//   'budget/delete',
//   async (id: number, { getState, rejectWithValue }) => {
//     try {
//       await axios.delete(`${BASE}/budgets/${id}/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return id;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const updateMonthAllocations = createAsyncThunk(
//   'budget/updateMonthAllocations',
//   async (
//     data: { budgetId: number; month: string; entries: any[] },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.post(
//         `${BASE}/budgets/${data.budgetId}/month-allocations/`,
//         { month: data.month, entries: data.entries },
//         { headers: authHeaders(getToken(getState() as RootState)) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const saveSnapshot = createAsyncThunk(
//   'budget/saveSnapshot',
//   async (
//     data: { budgetId: number; payload: any },
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const res = await axios.post(
//         `${BASE}/budgets/${data.budgetId}/save-snapshot/`,
//         data.payload,
//         { headers: authHeaders(getToken(getState() as RootState)) }
//       );
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchPerUserAchievement = createAsyncThunk(
//   'budget/fetchPerUserAchievement',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE}/per-user-rank-a/`, {
//         headers: authHeaders(getToken(getState() as RootState)),
//       });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// export const fetchAdminBudgetSummary = createAsyncThunk(
//   'budget/fetchAdminSummary',
//   async (
//     params: { month?: string; year?: number } = {},
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const token = getToken(getState() as RootState);
//       const query = new URLSearchParams();
//       if (params.year)  query.set('year',  String(params.year));
//       if (params.month) query.set('month', params.month);

//       const url = `${BASE}/admin-budget-summary/${
//         query.toString() ? '?' + query.toString() : ''
//       }`;

//       const res = await axios.get(url, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );

// // ── NEW THUNK ─────────────────────────────────────────────────────────────────
// export const fetchAdminPerUserBudget = createAsyncThunk(
//   'budget/fetchAdminPerUserBudget',
//   async (
//     params: { month?: string; year?: number } = {},
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const token = getToken(getState() as RootState);
//       const query = new URLSearchParams();
//       if (params.year)  query.set('year',  String(params.year));
//       if (params.month) query.set('month', params.month);

//       const url = `${BASE}/admin-per-user-budget/${
//         query.toString() ? '?' + query.toString() : ''
//       }`;

//       const res = await axios.get(url, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );
// export const fetchUserBudgetDashboard = createAsyncThunk(
//   'budget/fetchUserDashboard',
//   async (
//     params: { month?: string; year?: number } = {},
//     { getState, rejectWithValue }
//   ) => {
//     try {
//       const token = getToken(getState() as RootState);
//       const query = new URLSearchParams();
//       if (params.year)  query.set('year',  String(params.year));
//       if (params.month) query.set('month', params.month);

//       const url = `${BASE}/user-budget-dashboard/${
//         query.toString() ? '?' + query.toString() : ''
//       }`;

//       const res = await axios.get(url, { headers: authHeaders(token) });
//       return res.data;
//     } catch (e: any) {
//       return rejectWithValue(e.response?.data);
//     }
//   }
// );
// // ─── STATE INTERFACE ──────────────────────────────────────────────────────────

// interface BudgetState {
//   budgets: any[];
//   salesPersons: any[];
//   categories: any[];
//   teamSummary: any[];
//   dashboard: any | null;
//   currentMonth: any | null;
//   loading: boolean;
//   dashLoading: boolean;
//   monthSaving: boolean;
//   saveStatus: 'idle' | 'saving' | 'saved' | 'error';
//   teamSummaryError: string | null;
//   perUserAchievement: any[];
//   adminSummary: any | null;
//   adminSummaryLoading: boolean;
//   employeeSummary: any | null;
//   empSummaryLoading: boolean;
//   // NEW
//   adminPerUserBudget: any[];
//   adminPerUserLoading: boolean;
//   userDashboard: any | null;
//   userDashboardLoading: boolean;
// }

// const initialState: BudgetState = {
//   budgets: [],
//   salesPersons: [],
//   categories: [],
//   teamSummary: [],
//   dashboard: null,
//   currentMonth: null,
//   loading: false,
//   dashLoading: false,
//   monthSaving: false,
//   saveStatus: 'idle',
//   teamSummaryError: null,
//   perUserAchievement: [],
//   adminSummary: null,
//   adminSummaryLoading: false,
//   employeeSummary: null,
//   empSummaryLoading: false,
//   // NEW
//   adminPerUserBudget: [],
//   adminPerUserLoading: false,
//   userDashboard: null,
//   userDashboardLoading: false,
// };

// // ─── SLICE ────────────────────────────────────────────────────────────────────

// const budgetSlice = createSlice({
//   name: 'budget',
//   initialState,
//   reducers: {
//     resetSaveStatus: (s) => { s.saveStatus = 'idle'; },
//     clearDashboard:    (s) => { s.dashboard    = null; },
//     clearCurrentMonth: (s) => { s.currentMonth = null; },
//   },
//   extraReducers: (b) => {
//     b.addCase(fetchSalesPersons.fulfilled,    (s, a) => { s.salesPersons = a.payload; });
//     b.addCase(fetchGlobalCategories.fulfilled,(s, a) => { s.categories   = a.payload; });
//     b.addCase(fetchTeamSummary.fulfilled,     (s, a) => { s.teamSummary  = a.payload; });

//     b.addCase(fetchBudgets.pending,           (s)    => { s.loading = true;  });
//     b.addCase(fetchBudgets.fulfilled,         (s, a) => { s.loading = false; s.budgets = a.payload; });

//     b.addCase(fetchBudgetDashboard.pending,   (s)    => { s.dashLoading = true;  });
//     b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { s.dashLoading = false; s.dashboard = a.payload; });

//     b.addCase(fetchCurrentMonthBudget.fulfilled, (s, a) => { s.currentMonth = a.payload; });

//     b.addCase(createBudget.pending,   (s)    => { s.saveStatus = 'saving'; });
//     b.addCase(createBudget.fulfilled, (s, a) => { s.saveStatus = 'saved';  s.budgets.unshift(a.payload); });
//     b.addCase(createBudget.rejected,  (s)    => { s.saveStatus = 'error';  });

//     b.addCase(updateBudget.fulfilled, (s)    => { s.saveStatus = 'saved'; });
//     b.addCase(deleteBudget.fulfilled, (s, a) => { s.budgets = s.budgets.filter(b => b.id !== a.payload); });

//     b.addCase(updateMonthAllocations.fulfilled, (s, a) => { s.dashboard = a.payload; });

//     b.addCase(fetchPerUserAchievement.fulfilled, (s, a) => { s.perUserAchievement = a.payload; });

//     b.addCase(fetchBudgetEmployeeSummary.pending,   (s)    => { s.empSummaryLoading = true;  });
//     b.addCase(fetchBudgetEmployeeSummary.fulfilled, (s, a) => { s.empSummaryLoading = false; s.employeeSummary = a.payload; });
//     b.addCase(fetchBudgetEmployeeSummary.rejected,  (s)    => { s.empSummaryLoading = false; });

//     b.addCase(fetchAdminBudgetSummary.pending,   (s)    => { s.adminSummaryLoading = true;  });
//     b.addCase(fetchAdminBudgetSummary.fulfilled, (s, a) => { s.adminSummaryLoading = false; s.adminSummary = a.payload; });
//     b.addCase(fetchAdminBudgetSummary.rejected,  (s)    => { s.adminSummaryLoading = false; });
//     b.addCase(fetchUserBudgetDashboard.pending,   (s) => { s.userDashboardLoading = true; });
//     b.addCase(fetchUserBudgetDashboard.fulfilled, (s, a) => {s.userDashboardLoading = false;s.userDashboard = a.payload;});
//     b.addCase(fetchUserBudgetDashboard.rejected,  (s) => { s.userDashboardLoading = false; });
//     // NEW
//     b.addCase(fetchAdminPerUserBudget.pending,   (s)    => { s.adminPerUserLoading = true;  });
//     b.addCase(fetchAdminPerUserBudget.fulfilled, (s, a) => { s.adminPerUserLoading = false; s.adminPerUserBudget = a.payload; });
//     b.addCase(fetchAdminPerUserBudget.rejected,  (s)    => { s.adminPerUserLoading = false; });
//   },
// });

// export const { resetSaveStatus, clearDashboard, clearCurrentMonth } = budgetSlice.actions;
// export default budgetSlice.reducer;


// src/features/Budget/slice/budgetSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import axiosInstance from '../../../app/axiosInstance';

// ─── THUNKS ───────────────────────────────────────────────────────────────────

export const fetchSalesPersons = createAsyncThunk(
  'budget/fetchSalesPersons',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/budgets/sales-persons/');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchGlobalCategories = createAsyncThunk(
  'budget/fetchGlobalCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/budget-categories/');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const addGlobalCategory = createAsyncThunk(
  'budget/addGlobalCategory',
  async (name: string, { dispatch }) => {
    await axiosInstance.post('/budget-categories/', { name });
    dispatch(fetchGlobalCategories());
  }
);

export const addGlobalSubCategory = createAsyncThunk(
  'budget/addGlobalSubCategory',
  async (data: { categoryId: number; name: string }, { dispatch }) => {
    await axiosInstance.post('/budget-subcategories/', {
      category: data.categoryId,
      name:     data.name,
    });
    dispatch(fetchGlobalCategories());
  }
);

export const deleteGlobalCategory = createAsyncThunk(
  'budget/deleteGlobalCategory',
  async (id: number, { dispatch }) => {
    await axiosInstance.delete(`/budget-categories/${id}/`);
    dispatch(fetchGlobalCategories());
  }
);

export const deleteGlobalSubCategory = createAsyncThunk(
  'budget/deleteGlobalSubCategory',
  async (id: number, { dispatch }) => {
    await axiosInstance.delete(`/budget-subcategories/${id}/`);
    dispatch(fetchGlobalCategories());
  }
);

export const fetchTeamSummary = createAsyncThunk(
  'budget/fetchTeamSummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/budgets/team-summary/');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

const asArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

export const fetchBudgets = createAsyncThunk(
  'budget/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/budgets/');
      return asArray(res.data);
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchBudgetDashboard = createAsyncThunk(
  'budget/fetchDashboard',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/budgets/${id}/dashboard/`);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchCurrentMonthBudget = createAsyncThunk(
  'budget/fetchCurrentMonth',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state        = getState() as RootState;
      const globalFilter = (state as any).globalFilter;
      const selectedYear  = globalFilter?.selectedYear;
      const selectedMonth = globalFilter?.selectedMonth;
      const filterType    = globalFilter?.filterType;

      const query = new URLSearchParams();
      if (selectedYear) query.set('year', String(selectedYear));
      if (filterType === 'monthly' && selectedMonth) {
        query.set('month', selectedMonth);
      }

      const url = `/budgets/current-month/${
        query.toString() ? '?' + query.toString() : ''
      }`;

      const res = await axiosInstance.get(url);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchBudgetEmployeeSummary = createAsyncThunk(
  'budget/fetchEmployeeSummary',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/budgets/${id}/employee-summary/`);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const createBudget = createAsyncThunk(
  'budget/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/budgets/', data);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/update',
  async (
    { id, data }: { id: number; data: any },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axiosInstance.put(`/budgets/${id}/`, data);
      dispatch(fetchBudgetDashboard(id));
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/budgets/${id}/`);
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const updateMonthAllocations = createAsyncThunk(
  'budget/updateMonthAllocations',
  async (
    data: { budgetId: number; month: string; entries: any[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(
        `/budgets/${data.budgetId}/month-allocations/`,
        { month: data.month, entries: data.entries }
      );
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const saveSnapshot = createAsyncThunk(
  'budget/saveSnapshot',
  async (
    data: { budgetId: number; payload: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(
        `/budgets/${data.budgetId}/save-snapshot/`,
        data.payload
      );
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchPerUserAchievement = createAsyncThunk(
  'budget/fetchPerUserAchievement',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/per-user-rank-a/');
      return asArray(res.data);
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchAdminBudgetSummary = createAsyncThunk(
  'budget/fetchAdminSummary',
  async (
    params: { month?: string; year?: number; pic?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();
      if (params.year)  query.set('year',  String(params.year));
      if (params.month) query.set('month', params.month);
      if (params.pic && params.pic !== 'all') query.set('pic', params.pic);

      const url = `/admin-budget-summary/${
        query.toString() ? '?' + query.toString() : ''
      }`;

      const res = await axiosInstance.get(url);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchAdminPerUserBudget = createAsyncThunk(
  'budget/fetchAdminPerUserBudget',
  async (
    params: { month?: string; year?: number; pic?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();
      if (params.year)  query.set('year',  String(params.year));
      if (params.month) query.set('month', params.month);
      if (params.pic && params.pic !== 'all') query.set('pic', params.pic);

      const url = `/admin-per-user-budget/${
        query.toString() ? '?' + query.toString() : ''
      }`;

      const res = await axiosInstance.get(url);
      return asArray(res.data);
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

export const fetchUserBudgetDashboard = createAsyncThunk(
  'budget/fetchUserDashboard',
  async (
    params: { month?: string; year?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams();
      if (params.year)  query.set('year',  String(params.year));
      if (params.month) query.set('month', params.month);

      const url = `/user-budget-dashboard/${
        query.toString() ? '?' + query.toString() : ''
      }`;

      const res = await axiosInstance.get(url);
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data);
    }
  }
);

// ─── STATE INTERFACE ──────────────────────────────────────────────────────────

interface BudgetState {
  budgets:              any[];
  salesPersons:         any[];
  categories:           any[];
  teamSummary:          any[];
  dashboard:            any | null;
  currentMonth:         any | null;
  loading:              boolean;
  dashLoading:          boolean;
  monthSaving:          boolean;
  saveStatus:           'idle' | 'saving' | 'saved' | 'error';
  teamSummaryError:     string | null;
  perUserAchievement:   any[];
  adminSummary:         any | null;
  adminSummaryLoading:  boolean;
  employeeSummary:      any | null;
  empSummaryLoading:    boolean;
  adminPerUserBudget:   any[];
  adminPerUserLoading:  boolean;
  userDashboard:        any | null;
  userDashboardLoading: boolean;
}

const initialState: BudgetState = {
  budgets:              [],
  salesPersons:         [],
  categories:           [],
  teamSummary:          [],
  dashboard:            null,
  currentMonth:         null,
  loading:              false,
  dashLoading:          false,
  monthSaving:          false,
  saveStatus:           'idle',
  teamSummaryError:     null,
  perUserAchievement:   [],
  adminSummary:         null,
  adminSummaryLoading:  false,
  employeeSummary:      null,
  empSummaryLoading:    false,
  adminPerUserBudget:   [],
  adminPerUserLoading:  false,
  userDashboard:        null,
  userDashboardLoading: false,
};

// ─── SLICE ────────────────────────────────────────────────────────────────────

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    resetSaveStatus:   (s) => { s.saveStatus   = 'idle'; },
    clearDashboard:    (s) => { s.dashboard    = null;   },
    clearCurrentMonth: (s) => { s.currentMonth = null;   },
  },
  extraReducers: (b) => {
    b.addCase(fetchSalesPersons.fulfilled,     (s, a) => { s.salesPersons = asArray(a.payload); });
    b.addCase(fetchGlobalCategories.fulfilled, (s, a) => { s.categories   = asArray(a.payload); });
    b.addCase(fetchTeamSummary.fulfilled,      (s, a) => { s.teamSummary  = asArray(a.payload); });

    b.addCase(fetchBudgets.pending,   (s)    => { s.loading = true;  });
    b.addCase(fetchBudgets.fulfilled, (s, a) => { s.loading = false; s.budgets = asArray(a.payload); });
    b.addCase(fetchBudgets.rejected,  (s)    => { s.loading = false; });

    b.addCase(fetchBudgetDashboard.pending,   (s)    => { s.dashLoading = true;  });
    b.addCase(fetchBudgetDashboard.fulfilled, (s, a) => { s.dashLoading = false; s.dashboard = a.payload; });
    b.addCase(fetchBudgetDashboard.rejected,  (s)    => { s.dashLoading = false; });

    b.addCase(fetchCurrentMonthBudget.fulfilled, (s, a) => { s.currentMonth = a.payload; });

    b.addCase(createBudget.pending,   (s)    => { s.saveStatus = 'saving'; });
    b.addCase(createBudget.fulfilled, (s, a) => {
      s.saveStatus = 'saved';
      s.budgets.unshift(a.payload);
    });
    b.addCase(createBudget.rejected, (s) => { s.saveStatus = 'error'; });

    b.addCase(updateBudget.fulfilled, (s) => { s.saveStatus = 'saved'; });
    b.addCase(deleteBudget.fulfilled, (s, a) => {
      s.budgets = s.budgets.filter(budget => budget.id !== a.payload);
    });

    b.addCase(updateMonthAllocations.fulfilled, (s, a) => { s.dashboard = a.payload; });

    b.addCase(fetchPerUserAchievement.fulfilled, (s, a) => {
      s.perUserAchievement = asArray(a.payload);
    });

    b.addCase(fetchBudgetEmployeeSummary.pending,   (s)    => { s.empSummaryLoading = true;  });
    b.addCase(fetchBudgetEmployeeSummary.fulfilled, (s, a) => {
      s.empSummaryLoading = false;
      s.employeeSummary   = a.payload;
    });
    b.addCase(fetchBudgetEmployeeSummary.rejected, (s) => { s.empSummaryLoading = false; });

    b.addCase(fetchAdminBudgetSummary.pending,   (s)    => { s.adminSummaryLoading = true;  });
    b.addCase(fetchAdminBudgetSummary.fulfilled, (s, a) => {
      s.adminSummaryLoading = false;
      s.adminSummary        = a.payload;
    });
    b.addCase(fetchAdminBudgetSummary.rejected, (s) => { s.adminSummaryLoading = false; });

    b.addCase(fetchUserBudgetDashboard.pending,   (s)    => { s.userDashboardLoading = true;  });
    b.addCase(fetchUserBudgetDashboard.fulfilled, (s, a) => {
      s.userDashboardLoading = false;
      s.userDashboard        = a.payload;
    });
    b.addCase(fetchUserBudgetDashboard.rejected, (s) => { s.userDashboardLoading = false; });

    b.addCase(fetchAdminPerUserBudget.pending,   (s)    => { s.adminPerUserLoading = true;  });
    b.addCase(fetchAdminPerUserBudget.fulfilled, (s, a) => {
      s.adminPerUserLoading = false;
      s.adminPerUserBudget  = asArray(a.payload);
    });
    b.addCase(fetchAdminPerUserBudget.rejected, (s) => { s.adminPerUserLoading = false; });
  },
});

export const {
  resetSaveStatus,
  clearDashboard,
  clearCurrentMonth,
} = budgetSlice.actions;

export default budgetSlice.reducer;
