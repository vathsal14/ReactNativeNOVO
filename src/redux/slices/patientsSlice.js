import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import patientsAPI from '../../api/patientsAPI'; // Replace with your actual API module

// Mock API call to fetch patients
export const fetchPatients = createAsyncThunk('patients/fetchPatients', async () => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Ronald Reagan', age: 45, sex: 'M', lastVisit: '12/05/2023', status: 'Active'},
        { id: 2, name: 'Anna Karenina', age: 40, sex: 'F', lastVisit: '12/01/2023', status: 'Active' },
        { id: 3, name: 'Nikola Noir', age: 76, sex: 'M', lastVisit: '12/05/2023', status: 'Active' },
        { id: 4, name: 'Asadh Lob', age: 55, sex: 'M', lastVisit: '12/03/2023', status: 'Active' },
        { id: 5, name: 'Tan Wei Ling', age: 79, sex: 'F', lastVisit: '12/04/2024', status: 'overdue' },
        { id: 6, name: 'Alicia Rodriguez', age: 44, sex: 'F', lastVisit: '12/05/2023', status: 'Active' },
        { id: 7, name: 'Adrian Fernandez', age: 65, sex: 'M', lastVisit: '12/02/2023', status: 'Active' },
        { id: 8, name: 'Melissa Peralta', age: 45, sex: 'F', lastVisit: '12/02/2023', status: 'overdue' },
        { id: 9, name: 'Natanya James', age: 58, sex: 'F', lastVisit: '12/02/2023', status: 'Active' },
        { id: 10, name: 'Christopher deJesus', age: 55, sex: 'M', lastVisit: '12/05/2023', status: 'Active' },
        { id: 11, name: 'Ronald Reagan', age: 63, sex: 'M', lastVisit: '12/02/2023', status: 'Active' },
        { id: 12, name: 'Stephanie De Cruz', age: 79, sex: 'F', lastVisit: '12/05/2023', status: 'Active' },
        { id: 13, name: 'Vanessa Gomez', age: 46, sex: 'F', lastVisit: '12/02/2023', status: 'Active' },
        { id: 14, name: 'Daniel Rodriguez', age: 86, sex: 'M', lastVisit: '12/06/2023', status: 'Active' },
        { id: 15, name: 'Ronald Reagan', age: 72, sex: 'M', lastVisit: '12/04/2023', status: 'Active' },
      ]);
    }, 500);
  });
});

// Async thunk to fetch prescriptions
export const fetchPrescriptions = createAsyncThunk(
  'patients/fetchPrescriptions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState(); // Assuming auth contains the token
      const response = await patientsAPI.getPrescriptions(auth.token); // Replace with your API call
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch prescriptions');
    }
  }
);

// Async thunk to fetch test reports
export const fetchTestReports = createAsyncThunk(
  'patients/fetchTestReports',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState(); // Assuming auth contains the token
      const response = await patientsAPI.getTestReports(auth.token); // Replace with your API call
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch test reports');
    }
  }
);

const initialState = {
  list: [],
  filteredList: [],
  selectedPatient: null,
  prescriptions: [],
  testReports: [],
  status: 'idle',
  error: null,
  searchQuery: '',
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    searchPatients: (state, action) => {
      state.searchQuery = action.payload;
      if (action.payload) {
        state.filteredList = state.list.filter((patient) =>
          patient.name.toLowerCase().includes(action.payload.toLowerCase())
        );
      } else {
        state.filteredList = [...state.list];
      }
    },
    selectPatient: (state, action) => {
      state.selectedPatient = state.list.find((patient) => patient.id === action.payload);
    },
    addPrescription: (state, action) => {
      if (state.selectedPatient) {
        state.prescriptions.push({
          ...action.payload,
          patientId: state.selectedPatient.id, // Tie prescription to the selected patient
        });
      }
    },
    setPrescriptions: (state, action) => {
      state.prescriptions = action.payload;
    },
    setTestReports: (state, action) => {
      state.testReports = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.filteredList = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPrescriptions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch prescriptions';
      })
      .addCase(fetchTestReports.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTestReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.testReports = action.payload;
      })
      .addCase(fetchTestReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch test reports';
      });
  },
});

export const { searchPatients, selectPatient, addPrescription, setPrescriptions, setTestReports } = patientsSlice.actions;

// Selector to get the selected patient
export const selectSelectedPatient = (state) => state.patients.selectedPatient;

// Selector to get the selected patient's prescriptions
export const selectPatientPrescriptions = (state) => state.patients.prescriptions.filter(
  (prescription) => prescription.patientId === state.patients.selectedPatient?.id
);

// Selector to get the selected patient's test reports
export const selectPatientTestReports = (state) => state.patients.testReports;

export default patientsSlice.reducer;
