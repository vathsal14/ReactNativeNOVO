import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.novoneurotech.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response;
  },

  loginWithSocial: async (provider, token) => {
    const response = await api.post('/auth/social-login', { provider, token });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  verifyOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response;
  },

  validateToken: async (token) => {
    const response = await api.get('/auth/validate-token', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    return { success: true };
  },
};

export default authAPI;
