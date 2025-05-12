// This service handles interactions with the Alzheimer's model
import axios from 'axios';

// API endpoint for the Alzheimer's model
const API_URL = 'http://10.0.2.2:5000/api/alzheimer-prediction'; // Use 10.0.2.2 to access localhost from Android emulator

const AlzheimerModelService = {


  /**
   * Predicts Alzheimer's disease risk using the PKL model
   * @param {Object} features - The features input by the user
   * @returns {Promise<Object>} - The prediction result with risk percentage
   */
  async predictRisk(features) {
    try {
      console.log('Sending features to Alzheimer\'s PKL model:', features);
      
      // Format the features for the API request
      // The backend expects a specific format for the features
      const modelFeatures = {
        hippocampus_volume: features.hippocampus_volume,
        cortical_thickness: features.cortical_thickness,
        ventricle_volume: features.ventricle_volume,
        white_matter_hyperintensities: features.white_matter_hyperintensities,
        brain_glucose_metabolism: features.brain_glucose_metabolism,
        amyloid_deposition: features.amyloid_deposition,
        tau_protein_level: features.tau_protein_level
      };
      
      console.log('Sending features to backend:', JSON.stringify(modelFeatures));
      
      // Send the features to the backend API
      const response = await axios.post(API_URL, modelFeatures, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      });
      
      console.log('Received response:', JSON.stringify(response.data));
      
      // Extract the prediction result from the response
      const { riskPercentage, confidence } = response.data;
      
      // Determine risk level based on the risk percentage
      let riskLevel = 'Low';
      let riskColor = '#4CAF50';
      
      if (riskPercentage > 60) {
        riskLevel = 'High';
        riskColor = '#F44336';
      } else if (riskPercentage > 30) {
        riskLevel = 'Moderate';
        riskColor = '#FF9800';
      }
      
      // Return prediction result
      return {
        riskPercentage: parseFloat(riskPercentage).toFixed(1),
        riskLevel,
        riskColor,
        features: modelFeatures,
        confidence: confidence || 0.85,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error predicting Alzheimer\'s risk:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      console.error('Error status:', error.response ? error.response.status : 'No status');
      
      // For network errors, provide a more specific message
      if (error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. Please try again.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to predict Alzheimer\'s risk: ' + (error.message || 'Unknown error'));
      }
    }
  },




};

export default AlzheimerModelService;
