import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mriScan: null,
  riskPercentage: 0,
  isLoading: false,
  error: null,
  resultPercentage: 0,
};

export const alzheimerSlice = createSlice({
  name: 'alzheimer',
  initialState,
  reducers: {
    setMriScan: (state, action) => {
      state.mriScan = action.payload;
    },
    setRiskPercentage: (state, action) => {
      state.riskPercentage = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetAlzheimerTest: () => initialState,
    setResultPercentage: (state, action) => {
      state.resultPercentage = action.payload;
    },
  },
});

export const {
  setMriScan,
  setRiskPercentage,
  setLoading,
  setError,
  resetAlzheimerTest,
  setResultPercentage,
} = alzheimerSlice.actions;

export default alzheimerSlice.reducer;
