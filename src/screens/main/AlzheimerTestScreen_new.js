import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ActivityIndicator, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setRiskPercentage, setLoading, setError } from '../../redux/slices/alzheimerSlice';

import Header from '../../components/common/Header';
import BackButton from '../../components/common/BackButton';
import AlzheimerResult from '../../components/Alzheimer/AlzheimerResult';
import RiskIndicator from '../../components/Alzheimer/RiskIndicator';
import AlzheimerModelService from '../../api/alzheimerModelService';

const AlzheimerTestScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { riskPercentage, isLoading, error } = useSelector((state) => state.alzheimer);
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [features, setFeatures] = useState(null);
  
  // State for MRI-derived structural features
  const [hippocampusVolume, setHippocampusVolume] = useState('');
  const [corticalThickness, setCorticalThickness] = useState('');
  const [ventricleVolume, setVentricleVolume] = useState('');
  const [whiteMatters, setWhiteMatters] = useState('');
  
  // State for functional and molecular biomarkers
  const [brainGlucose, setBrainGlucose] = useState('');
  const [amyloidDeposition, setAmyloidDeposition] = useState('');
  const [tauProteinLevel, setTauProteinLevel] = useState('');
  
  // State for clinical assessment scores
  const [mmseScore, setMmseScore] = useState('');
  const [cdrScore, setCdrScore] = useState('');
  const [age, setAge] = useState('');

  const validateInputs = () => {
    if (!hippocampusVolume || !corticalThickness || !ventricleVolume || 
        !whiteMatters || !brainGlucose || !amyloidDeposition || 
        !tauProteinLevel) {
      Alert.alert('Missing Data', 'Please fill in all required fields to get an accurate assessment.');
      return false;
    }
    return true;
  };

  const handleShowResult = async () => {
    // Validate inputs before processing
    if (!validateInputs()) return;
    
    try {
      // Show loading indicator
      dispatch(setLoading(true));
      setShowResult(true);
      
      // Create features object with all inputs
      const manualFeatures = {
        hippocampus_volume: parseFloat(hippocampusVolume),
        cortical_thickness: parseFloat(corticalThickness),
        ventricle_volume: parseFloat(ventricleVolume),
        white_matter_hyperintensities: parseFloat(whiteMatters),
        brain_glucose_metabolism: parseFloat(brainGlucose),
        amyloid_deposition: parseFloat(amyloidDeposition),
        tau_protein_level: parseFloat(tauProteinLevel),
        mmse_score: mmseScore ? parseFloat(mmseScore) : 25,
        cdr_score: cdrScore ? parseFloat(cdrScore) : 0.5,
        age: age ? parseFloat(age) : 65
      };
      
      // Get prediction from model
      const result = await AlzheimerModelService.predictRisk(manualFeatures);
      
      // Update state with prediction result
      dispatch(setRiskPercentage(parseFloat(result.riskPercentage)));
      setPredictionResult(result);
      setFeatures(manualFeatures);
      dispatch(setError(null));
    } catch (error) {
      console.error('Error getting prediction:', error);
      dispatch(setError('Failed to get prediction from model. Please try again.'));
      Alert.alert('Error', 'Failed to get prediction from model');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Alzheimer's Risk Assessment" />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        
        {/* Manual input form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Enter MRI-derived features and clinical assessment scores:</Text>
          
          <Text style={styles.sectionTitle}>MRI-derived Structural Features:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Hippocampus Volume (cm³)"
            value={hippocampusVolume}
            onChangeText={setHippocampusVolume}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Cortical Thickness (mm)"
            value={corticalThickness}
            onChangeText={setCorticalThickness}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Ventricle Volume (cm³)"
            value={ventricleVolume}
            onChangeText={setVentricleVolume}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="White Matter Hyperintensities"
            value={whiteMatters}
            onChangeText={setWhiteMatters}
            keyboardType="numeric"
          />
          
          <Text style={styles.sectionTitle}>Functional and Molecular Biomarkers:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Brain Glucose Metabolism (SUV)"
            value={brainGlucose}
            onChangeText={setBrainGlucose}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Amyloid Deposition (SUVR)"
            value={amyloidDeposition}
            onChangeText={setAmyloidDeposition}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Tau Protein Level (SUVR)"
            value={tauProteinLevel}
            onChangeText={setTauProteinLevel}
            keyboardType="numeric"
          />
          
          <Text style={styles.sectionTitle}>Clinical Assessment Scores:</Text>
          <TextInput
            style={styles.inputField}
            placeholder="MMSE Score"
            value={mmseScore}
            onChangeText={setMmseScore}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="CDR Score"
            value={cdrScore}
            onChangeText={setCdrScore}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputField}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>
        
        <AlzheimerResult onPress={handleShowResult} />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {showResult && !isLoading && predictionResult && (
          <View style={styles.resultContainer}>
            <RiskIndicator percentage={predictionResult.riskPercentage} />
            
            <View style={styles.predictionDetails}>
              <Text style={styles.detailsTitle}>Assessment Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Risk Level:</Text>
                <Text style={[styles.detailValue, { color: predictionResult.riskColor }]}>
                  {predictionResult.riskLevel}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence:</Text>
                <Text style={styles.detailValue}>
                  {(predictionResult.confidence * 100).toFixed(0)}%
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assessment Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            {features && (
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Features Used in Assessment</Text>
                
                <View style={styles.featureRow}>
                  <Text style={styles.featureLabel}>Hippocampus Volume:</Text>
                  <Text style={styles.featureValue}>{features.hippocampus_volume.toFixed(2)} cm³</Text>
                </View>
                
                <View style={styles.featureRow}>
                  <Text style={styles.featureLabel}>Cortical Thickness:</Text>
                  <Text style={styles.featureValue}>{features.cortical_thickness.toFixed(2)} mm</Text>
                </View>
                
                <View style={styles.featureRow}>
                  <Text style={styles.featureLabel}>Ventricle Volume:</Text>
                  <Text style={styles.featureValue}>{features.ventricle_volume.toFixed(2)} cm³</Text>
                </View>
                
                <View style={styles.featureRow}>
                  <Text style={styles.featureLabel}>White Matter Hyperintensities:</Text>
                  <Text style={styles.featureValue}>{features.white_matter_hyperintensities.toFixed(2)}</Text>
                </View>
                
                <View style={styles.featureRow}>
                  <Text style={styles.featureLabel}>Brain Glucose Metabolism:</Text>
                  <Text style={styles.featureValue}>{features.brain_glucose_metabolism.toFixed(2)} SUV</Text>
                </View>
                
                <View style={styles.featureRow}>
                  <Text style={styles.featureLabel}>Amyloid Deposition:</Text>
                  <Text style={styles.featureValue}>{features.amyloid_deposition.toFixed(2)} SUVR</Text>
                </View>
                
                <View style={styles.featureRow}>
                  <Text style={styles.featureLabel}>Tau Protein Level:</Text>
                  <Text style={styles.featureValue}>{features.tau_protein_level.toFixed(2)} SUVR</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 8,
    color: '#555555',
  },
  inputField: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginVertical: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 16,
  },
  predictionDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  featureLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 3,
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
    textAlign: 'right',
  },
});

export default AlzheimerTestScreen;
