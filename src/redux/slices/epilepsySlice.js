import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bandValues: {
    delta_power: '',
    theta_power: '',
    alpha_power: '',
    beta_power: '',
  },
  resultPercentage: 0,
  statistics: {
    mean: '',
    variance: '',
    std_dev: '',
    skewness: '',
    kurtosis: '',
    entropy: '',
  },
  frequency: {
    fit_mean: '',
    fit_variance: '',
    fit_std_dev: '',
    fit_skewness: '',
    fit_kurtosis: '',
  },
};

const epilepsySlice = createSlice({
  name: 'epilepsy',
  initialState,
  reducers: {
    setBandValues: (state, action) => {
      state.bandValues = { ...state.bandValues, ...action.payload };
    },
    setResultPercentage: (state, action) => {
      state.resultPercentage = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = { ...state.statistics, ...action.payload };
    },
    setFrequency: (state, action) => {
      state.frequency = { ...state.frequency, ...action.payload };
    },
  },
});

export const { setBandValues, setResultPercentage, setStatistics, setFrequency } = epilepsySlice.actions;
export default epilepsySlice.reducer;
