import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateTestResults } from '../../redux/slices/parkinsonTestSlice';
import ParkinsonModelService from '../../api/parkinsonModelService';

const ParkinsonTestScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get test results from Redux store
  const testResults = useSelector((state) => state.parkinsonTest.testResults);

  // Local state for form values
  const [datScanValues, setDatScanValues] = useState({
    caudateR: parseFloat(testResults?.datScan?.caudateR || '3.28'),
    caudateL: parseFloat(testResults?.datScan?.caudateL || '3.2'),
    putamenR: parseFloat(testResults?.datScan?.putamenR || '2.53'),
    putamenL: parseFloat(testResults?.datScan?.putamenL || '2.71'),
  });

  const [updrsValue, setUpdrsValue] = useState(''); // Initialize as empty
  const [smellTestValue, setSmellTestValue] = useState(''); // Initialize as empty
  const [cognitiveValue, setCognitiveValue] = useState(''); // Initialize as empty

  // State to store calculated results
  const [calculatedResults, setCalculatedResults] = useState(null);
  // State to track loading state during model prediction
  const [isLoading, setIsLoading] = useState(false);
  // State to store model prediction results
  const [predictionResult, setPredictionResult] = useState(null);

  // Handle file upload
  const handleUploadReports = async () => {
    try {


      // Process the selected files


    } catch (err) {

    }
  };

  // Process uploaded files
  const processUploadedFiles = async (files) => {
    try {
      // Simulate file upload to server
      Alert.alert('Uploading', 'Uploading files...');
      
      // In a real app, you would upload these files to your server
      // For demonstration, we'll just read the first file if it's a JSON
      if (files.length > 0 && files[0].name.endsWith('.json')) {

        try {
            const jsonData = JSON.parse(files[0].content);
          
          // Update local state with parsed data if it matches our format
          if (jsonData.datScan) {
            setDatScanValues(jsonData.datScan);
          }
          if (jsonData.updrs) {
            setUpdrsValue(jsonData.updrs.npdtot);
          }
          if (jsonData.smellTest) {
            setSmellTestValue(jsonData.smellTest.upsitPercentage);
          }
          if (jsonData.cognitive) {
            setCognitiveValue(jsonData.cognitive.cogchq);
          }
          
          Alert.alert('Success', 'Test results updated from uploaded file');
        } catch (e) {
          Alert.alert('Error', 'Invalid JSON format in the uploaded file');
        }
      } else {
        Alert.alert('Success', 'Files uploaded successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process uploaded files');
      console.error(error);
    }
  };

  // Save test results to Redux store and get prediction from model
  const saveTestResults = async () => {
    const results = {
      datScan: datScanValues,
      updrs: { npdtot: updrsValue || '0' },
      smellTest: { upsitPercentage: smellTestValue || '0' },
      cognitive: { cogchq: cognitiveValue || '0' },
    };
    
    // Save to Redux store
    dispatch(updateTestResults(results));
    
    // Get prediction from model
    try {
      setIsLoading(true);
      const prediction = await ParkinsonModelService.predictRisk(results);
      setPredictionResult(prediction);
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting prediction:', error);
      Alert.alert('Error', 'Failed to get prediction from model');
      setIsLoading(false);
    }
  };

  // Calculate and display results
  const viewTestResults = async () => {
    // Save test results and get prediction from model
    await saveTestResults();

    // Calculate sum and average (for reference)
    const datScanSum =
      parseFloat(datScanValues.caudateR) +
      parseFloat(datScanValues.caudateL) +
      parseFloat(datScanValues.putamenR) +
      parseFloat(datScanValues.putamenL);

    const totalTests = 4 + 1 + 1 + 1; // 4 DAT Scan + 1 UPDRS + 1 Smell Test + 1 Cognitive
    const totalSum = datScanSum + parseFloat(updrsValue || 0) + parseFloat(smellTestValue || 0) + parseFloat(cognitiveValue || 0);
    const average = totalSum / totalTests;

    // Set calculated results (for reference)
    setCalculatedResults({
      datScanSum,
      totalSum,
      average,
    });

    // Navigate to results screen
    navigation.navigate('ParkinsonTestResult');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>NOVO NeuroTech</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.doctorName}>Dr. Alex</Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="#5856D6" />
          <Text style={styles.backButtonText}>Parkinson Test</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadReports}>
          <Icon name="add" size={16} color="#5856D6" />
          <Text style={styles.uploadButtonText}>Upload Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Test Results Form */}
      <View style={styles.formContainer}>
        {/* DAT Scan Test */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>DAT Scan Test :</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Caudate-R</Text>
            <Text style={styles.resultValue}>{datScanValues.caudateR}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Caudate-L</Text>
            <Text style={styles.resultValue}>{datScanValues.caudateL}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Putamen-R</Text>
            <Text style={styles.resultValue}>{datScanValues.putamenR}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Putamen-L</Text>
            <Text style={styles.resultValue}>{datScanValues.putamenL}</Text>
          </View>
        </View>

        {/* UPDRS Test Results */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>UPDRS Test Results :</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>NPDTOT</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={updrsValue}
              onChangeText={(text) => setUpdrsValue(text ? parseFloat(text) : '')}
            />
          </View>
        </View>

        {/* Smell Test */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Smell Test :</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>UPSIT Percentage</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={smellTestValue}
              onChangeText={(text) => setSmellTestValue(text ? parseFloat(text) : '')}
            />
          </View>
        </View>

        {/* Cognitive Assessment */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Cognitive Assessment :</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>COGCHQ</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cognitiveValue}
              onChangeText={(text) => setCognitiveValue(text ? parseFloat(text) : '')}
            />
          </View>
        </View>
      </View>

      {/* Display model prediction if available */}
      {predictionResult && (
        <View style={[styles.resultCard, { borderColor: predictionResult.riskColor, borderWidth: 1 }]}>
          <Text style={styles.resultCardTitle}>Parkinson's Risk Assessment</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Risk Percentage:</Text>
            <Text style={[styles.resultValue, { color: predictionResult.riskColor, fontWeight: 'bold' }]}>
              {predictionResult.riskPercentage}%
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Risk Level:</Text>
            <Text style={[styles.resultValue, { color: predictionResult.riskColor, fontWeight: 'bold' }]}>
              {predictionResult.riskLevel}
            </Text>
          </View>
          <Text style={styles.resultNote}>This assessment is based on the model prediction using your test data.</Text>
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5856D6" />
          <Text style={styles.loadingText}>Processing data with model...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.actionButton} onPress={viewTestResults}>
        <Text style={styles.actionButtonText}>
          {predictionResult ? 'View Detailed Results' : 'Get Risk Assessment'}
        </Text>
      </TouchableOpacity>

      {/* Calculated Results */}
      {calculatedResults && (
        <View
          style={[
            styles.resultCard,
            {
              borderColor: calculatedResults.percentage >= 20 ? 'red' : 'green',
              borderWidth: 2,
            },
          ]}
        >
          <Text
            style={[
              styles.resultCardTitle,
              { color: calculatedResults.percentage >= 20 ? 'red' : 'green' },
            ]}
          >
            {calculatedResults.percentage >= 20
              ? 'Positive: Danger Result'
              : 'Negative: Safe Result'}
          </Text>

          {/* <Text style={styles.resultCardText}>
            DAT Scan Sum: {calculatedResults.datScanSum}
          </Text>
          <Text style={styles.resultCardText}>
            Total Sum: {calculatedResults.totalSum}
          </Text>
          <Text style={styles.resultCardText}>
            Average: {calculatedResults.average}
          </Text> */}
          <Text style={styles.resultCardText}>
            Percentage: {calculatedResults.percentage}%
          </Text>

          {/* Show Precautions */}
          {calculatedResults.percentage >= 20 ? (
            <View>
              {/* Precautions */}
              <View style={styles.precautionsContainer}>
                <Text style={styles.precautionsTitle}>Precautions:</Text>
                <Text style={styles.precautionsText}>
                  - Consult a neurologist immediately.
                </Text>
                <Text style={styles.precautionsText}>
                  - Follow a healthy diet and exercise regularly.
                </Text>
                <Text style={styles.precautionsText}>
                  - Avoid stress and maintain a positive mindset.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.safeContainer}>
              <Text style={styles.safeText}>
                The patient is safe. No immediate action is required.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Medications Section */}
      {/* <View style={styles.medicationsContainer}>
        <Text style={styles.medicationsTitle}>Recommended Medications:</Text>
        <View style={styles.medicationItem}>
          <Ionicons name="medkit-outline" size={20} color={COLORS.primary} style={styles.medicationIcon} />
          <Text style={styles.medicationText}>Levodopa</Text>
        </View>
        <View style={styles.medicationItem}>
          <Ionicons name="medkit-outline" size={20} color={COLORS.primary} style={styles.medicationIcon} />
          <Text style={styles.medicationText}>Carbidopa</Text>
        </View>
        <View style={styles.medicationItem}>
          <Ionicons name="medkit-outline" size={20} color={COLORS.primary} style={styles.medicationIcon} />
          <Text style={styles.medicationText}>Dopamine Agonists</Text>
        </View>
        <View style={styles.medicationItem}>
          <Ionicons name="medkit-outline" size={20} color={COLORS.primary} style={styles.medicationIcon} />
          <Text style={styles.medicationText}>MAO-B Inhibitors</Text>
        </View>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5856D6',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 14,
    color: '#333333',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    color: '#5856D6',
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5856D6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  uploadButtonText: {
    color: '#5856D6',
    marginLeft: 4,
    fontSize: 14,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5856D6',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    width: 80,
    textAlign: 'center',
    color: '#333333',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  actionButton: {
    backgroundColor: '#5856D6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultCardText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  precautionsContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
  precautionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  precautionsText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  safeContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#F5FFF5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'green',
  },
  safeText: {
    fontSize: 14,
    color: 'green',
  },
  medicationsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
  medicationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationIcon: {
    marginRight: 8,
  },
  medicationText: {
    fontSize: 14,
    color: '#333333',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
  resultNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default ParkinsonTestScreen;