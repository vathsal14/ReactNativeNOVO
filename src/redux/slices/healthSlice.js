import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import healthAPI from '../../api/healthAPI';

export const fetchHealthMetrics = createAsyncThunk(
  'health/fetchHealthMetrics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await healthAPI.getHealthMetrics(auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMedications = createAsyncThunk(
  'health/fetchMedications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await healthAPI.getMedications(auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'health/fetchAppointments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await healthAPI.getAppointments(auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  metrics: null,
  medications: [],
  appointments: [],
  activities: [],
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    clearHealthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchHealthMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch health metrics';
      })
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.loading = false;
        state.medications = action.payload;
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch medications';
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch appointments';
      });
  },
});

export const { clearHealthError } = healthSlice.actions;
export default healthSlice.reducer;
