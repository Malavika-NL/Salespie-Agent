import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface StageState {
  stages: string | null;
  ranks: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

// Initial state for the slice
const initialState: StageState = {
  stages: null,
  ranks: null,
  status: "idle",
  error: null,
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    saveStageData: (state, action: PayloadAction<{ stages: string; ranks: string }>) => {
      state.stages = action.payload.stages;
      state.ranks = action.payload.ranks;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { saveStageData, setLoading, setError, clearError } = stageSlice.actions;
export default stageSlice.reducer;
