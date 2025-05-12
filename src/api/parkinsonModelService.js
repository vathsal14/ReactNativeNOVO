import axios from 'axios';
import Constants from 'expo-constants';

// API endpoint for the Parkinson's model
// In development, use 10.0.2.2 (Android emulator's localhost)
// In production, use the Render deployed backend URL
const API_URL = __DEV__ 
  ? 'http://10.0.2.2:5001/api/parkinson-prediction'
  : 'https://parkinsons-prediction-apii.onrender.com/api/parkinson-prediction';

// You can also set this in app.json under expo.extra and access via Constants.expoConfig.extra

// This service handles interactions with the Parkinson's model
const ParkinsonModelService = {
  /**
   * Predicts Parkinson's disease risk using the model
   * @param {Object} testData - The test data to be sent to the model
   * @returns {Promise<Object>} - The prediction result with risk percentage
   */
  async predictRisk(testData) {
    try {
      console.log('Sending Parkinson\'s test data to backend:', JSON.stringify(testData));
      
      // Send the test data to the backend API
      const response = await axios.post(API_URL, testData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      });
      
      console.log('Received Parkinson\'s prediction response:', JSON.stringify(response.data));
      
      // Extract the prediction result from the response
      const { riskPercentage, riskLevel, riskColor, confidence, model_used } = response.data;
      
      // Return prediction result
      return {
        riskPercentage,
        riskLevel,
        riskColor,
        confidence: confidence || 0.85,
        modelUsed: model_used,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error predicting Parkinson\'s risk:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      console.error('Error status:', error.response ? error.response.status : 'No status');
      
      // For network errors, provide a more specific message
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. Please try again.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to predict Parkinson\'s risk: ' + (error.message || 'Unknown error'));
      }
    }
  }
};

export default ParkinsonModelService;
