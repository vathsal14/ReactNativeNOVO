import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setRiskPercentage, setLoading } from '../../redux/slices/alzheimerSlice';
import AlzheimerModelService from '../../api/alzheimerModelService';
import Header from '../../components/common/Header';
import BackButton from '../../components/common/BackButton';

const AlzheimerInputScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
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
  
  // State for loading and results
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  
  const validateInputs = () => {
    if (!hippocampusVolume || !corticalThickness || !ventricleVolume || 
        !whiteMatters || !brainGlucose || !amyloidDeposition || 
        !tauProteinLevel || !mmseScore || !cdrScore || !age) {
      Alert.alert('Missing Data', 'Please fill in all fields to get an accurate assessment.');
      return false;
    }
    return true;
  };
  
  const handleGetRiskAssessment = async () => {
    if (!validateInputs()) return;
    
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      // Create features object with all inputs
      const features = {
        hippocampus_volume: parseFloat(hippocampusVolume),
        cortical_thickness: parseFloat(corticalThickness),
        ventricle_volume: parseFloat(ventricleVolume),
        white_matter_hyperintensities: parseFloat(whiteMatters),
        brain_glucose_metabolism: parseFloat(brainGlucose),
        amyloid_deposition: parseFloat(amyloidDeposition),
        tau_protein_level: parseFloat(tauProteinLevel),
        mmse_score: parseFloat(mmseScore),
        cdr_score: parseFloat(cdrScore),
        age: parseFloat(age)
      };
      
      // Get prediction from model
      const prediction = await AlzheimerModelService.predictRisk(features);
      
      // Update state with prediction result
      setPredictionResult(prediction);
      dispatch(setRiskPercentage(parseFloat(prediction.riskPercentage)));
      
      // Navigate to results screen
      navigation.navigate('AlzheimerTestResult');
    } catch (error) {
      console.error('Error getting prediction:', error);
      Alert.alert('Error', 'Failed to get prediction from model');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };
  
  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <BackButton title="Alzheimer's Assessment" />
        </View>
        
        <Text style={styles.sectionTitle}>MRI-derived Structural Features</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hippocampus Volume (cm³):</Text>
          <TextInput
            style={styles.input}
            value={hippocampusVolume}
            onChangeText={setHippocampusVolume}
            placeholder="2.5-4.5"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cortical Thickness (mm):</Text>
          <TextInput
            style={styles.input}
            value={corticalThickness}
            onChangeText={setCorticalThickness}
            placeholder="2.0-3.5"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ventricle Volume (cm³):</Text>
          <TextInput
            style={styles.input}
            value={ventricleVolume}
            onChangeText={setVentricleVolume}
            placeholder="15-40"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>White Matter Hyperintensities:</Text>
          <TextInput
            style={styles.input}
            value={whiteMatters}
            onChangeText={setWhiteMatters}
            placeholder="0-10"
            keyboardType="numeric"
          />
        </View>
        
        <Text style={styles.sectionTitle}>Functional and Molecular Biomarkers</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Brain Glucose Metabolism (SUV):</Text>
          <TextInput
            style={styles.input}
            value={brainGlucose}
            onChangeText={setBrainGlucose}
            placeholder="4.0-7.0"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amyloid Deposition (SUVR):</Text>
          <TextInput
            style={styles.input}
            value={amyloidDeposition}
            onChangeText={setAmyloidDeposition}
            placeholder="0-2.5"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tau Protein Level (SUVR):</Text>
          <TextInput
            style={styles.input}
            value={tauProteinLevel}
            onChangeText={setTauProteinLevel}
            placeholder="0.8-2.0"
            keyboardType="numeric"
          />
        </View>
        
        <Text style={styles.sectionTitle}>Clinical Assessment</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>MMSE Score:</Text>
          <TextInput
            style={styles.input}
            value={mmseScore}
            onChangeText={setMmseScore}
            placeholder="0-30"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>CDR Score:</Text>
          <TextInput
            style={styles.input}
            value={cdrScore}
            onChangeText={setCdrScore}
            placeholder="0-3"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Age:</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="50-90+"
            keyboardType="numeric"
          />
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.loadingText}>Processing data with model...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.assessButton} 
            onPress={handleGetRiskAssessment}
          >
            <Text style={styles.assessButtonText}>Get Risk Assessment</Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  assessButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  assessButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlzheimerInputScreen;
