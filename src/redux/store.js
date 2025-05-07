import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import healthReducer from './slices/healthSlice';
import patientsReducer from './slices/patientsSlice';
import brainTestReducer from './slices/brainTestSlice';
import parkinsonTestReducer from './slices/parkinsonTestSlice';
import alzheimerReducer  from './slices/alzheimerSlice';
import epilepsyReducer from './slices/epilepsySlice'; // Ensure this is correctly imported


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    health: healthReducer,
    patients: patientsReducer,
    brainTest: brainTestReducer,
    parkinsonTest: parkinsonTestReducer,
    alzheimer: alzheimerReducer, // Ensure this is correctly imported
    epilepsy: epilepsyReducer,
    // alzheimer: alzheimerReducer,
    // epilepsy: epilepsyReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
