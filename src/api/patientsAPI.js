import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

const patientsAPI = {
  getPrescriptions: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/patients/prescriptions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
  getTestReports: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/patients/test-reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
  getPatients: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/patients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },
};

export default patientsAPI;
