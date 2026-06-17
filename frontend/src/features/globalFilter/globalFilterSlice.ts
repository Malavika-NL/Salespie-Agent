// src/features/globalFilter/globalFilterSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const now = new Date();
const currentFYYear = now.getMonth() >= 3
  ? now.getFullYear()
  : now.getFullYear() - 1;

export const FY_MONTHS = [
  'April','May','June','July','August','September',
  'October','November','December','January','February','March',
];

interface GlobalFilterState {
  filterType:    'monthly' | 'yearly';
  selectedMonth: string;
  selectedYear:  number;
  selectedPic:   string;
}

const initialState: GlobalFilterState = {
  filterType:    'yearly',
  selectedMonth: now.toLocaleString('default', { month: 'long' }),
  selectedYear:  currentFYYear,
  selectedPic:   'all',
};

const globalFilterSlice = createSlice({
  name: 'globalFilter',
  initialState,
  reducers: {
    setFilterType: (state, action: PayloadAction<'monthly' | 'yearly'>) => {
      state.filterType = action.payload;
    },
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    setSelectedPic: (state, action: PayloadAction<string>) => {
      state.selectedPic = action.payload;
    },
    resetFilter: (state) => {
      state.filterType    = 'yearly';
      state.selectedMonth = now.toLocaleString('default', { month: 'long' });
      state.selectedYear  = currentFYYear;
      state.selectedPic   = 'all';
    },
  },
});

export const {
  setFilterType,
  setSelectedMonth,
  setSelectedYear,
  setSelectedPic,
  resetFilter,
} = globalFilterSlice.actions;

export default globalFilterSlice.reducer;
