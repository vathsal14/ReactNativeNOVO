import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  testResults: {
    datScan: {
      caudateR: '3.28',
      caudateL: '3.2',
      putamenR: '2.53',
      putamenL: '2.71',
    },
    updrs: {
      npdtot: '3',
    },
    smellTest: {
      upsitPercentage: '11',
    },
    cognitive: {
      cogchq: '1',
    },
  },
  testHistory: [],
  isLoading: false,
  error: null,
};

const parkinsonTestSlice = createSlice({
  name: 'parkinsonTest',
  initialState,
  reducers: {
    updateTestResults: (state, action) => {
      state.testResults = action.payload;
    },
    addToTestHistory: (state, action) => {
      state.testHistory.push({
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      });
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  updateTestResults,
  addToTestHistory,
  setLoading,
  setError,
  clearError,
} = parkinsonTestSlice.actions;

export default parkinsonTestSlice.reducer;