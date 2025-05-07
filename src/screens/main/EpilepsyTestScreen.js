import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setResultPercentage } from '../../redux/slices/epilepsySlice';

import Header from '../../components/common/Header';
import BackButton from '../../components/common/BackButton';
import UploadButton from '../../components/common/UploadButton';
import StatisticsCard from '../../components/epilepsy/StatisticsCard';
import FrequencyCard from '../../components/epilepsy/FrequencyCard';
import BandValuesCard from '../../components/epilepsy/BandValuesCard';
import ClassificationsCard from '../../components/epilepsy/ClassificationsCard';

const EpilepsyTestScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { resultPercentage } = useSelector((state) => state.epilepsy);
  const [showResult, setShowResult] = useState(false);

  const handleUpload = () => {
    // In a real app, this would process the uploaded report
    // For now, we'll just use the existing values in the Redux store
    Alert.alert('Success', 'Report uploaded successfully');
  };

  const handleShowResult = () => {
    // In a real app, this would analyze the data
    // For now, we'll just use the hardcoded value from the design
    dispatch(setResultPercentage(50));
    setShowResult(true);
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <BackButton title="Epilepsy Test" />
            <UploadButton title="Upload Reports" onUpload={handleUpload} />
          </View>
          
          <StatisticsCard />
          <FrequencyCard />
          <BandValuesCard />
          
          <View style={styles.resultContainer}>
            <TouchableOpacity style={styles.resultButton} onPress={handleShowResult}>
              <Text style={styles.resultButtonText}>Epilepsy Test Result</Text>
            </TouchableOpacity>
            
            {showResult && (
              <View style={styles.percentageContainer}>
                <Text style={styles.percentageText}>{resultPercentage} %</Text>
              </View>
            )}
          </View>
          
          <ClassificationsCard />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  resultButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 16,
  },
  resultButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  percentageContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  percentageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EpilepsyTestScreen;