// import axios from 'axios';
// import { API_BASE_URL } from '../config/constants';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// const healthAPI = {
//   // Fetch health metrics for a patient
//   fetchHealthMetrics: async (patientId, token) => {
//     try {
//       const response = await api.get(`/health/metrics/${patientId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Update health metrics
//   updateHealthMetrics: async (patientId, data, token) => {
//     try {
//       const response = await api.put(`/health/metrics/${patientId}`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Add new health record
//   addHealthRecord: async (patientId, record, token) => {
//     try {
//       const response = await api.post(`/health/records/${patientId}`, record, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getMedications: async (token) => {
//     const response = await api.get('/health/medications', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response;
//   },

//   getAppointments: async (token) => {
//     const response = await api.get('/health/appointments', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response;
//   },

//   getActivities: async (token) => {
//     const response = await api.get('/health/activities', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response;
//   },

//   addMedication: async (token, medicationData) => {
//     const response = await api.post('/health/medications', medicationData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response;
//   },

//   addAppointment: async (token, appointmentData) => {
//     const response = await api.post('/health/appointments', appointmentData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response;
//   },
// };

// export default healthAPI;

import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const healthAPI = {
  // Fetch health metrics for a patient
  fetchHealthMetrics: async (patientId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health/metrics/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add other health-related API functions as needed
};

export default healthAPI;
