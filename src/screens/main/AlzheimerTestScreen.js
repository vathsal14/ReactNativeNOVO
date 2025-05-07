import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setMriScan, setRiskPercentage } from '../../redux/slices/alzheimerSlice';

import Header from '../../components/common/Header';
import BackButton from '../../components/common/BackButton';
import UploadButton from '../../components/common/UploadButton';
import AlzheimerResult from '../../components/Alzheimer/AlzheimerResult';
import RiskIndicator from '../../components/Alzheimer/RiskIndicator';

const AlzheimerTestScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { mriScan, riskPercentage } = useSelector((state) => state.alzheimer);
  const [showResult, setShowResult] = useState(false);

  const handleUpload = (source) => {
    dispatch(setMriScan(source));
    // Reset results when new scan is uploaded
    setShowResult(false);
  };

  const handleShowResult = () => {
    if (!mriScan) {
      Alert.alert('Error', 'Please upload an MRI scan first');
      return;
    }
    
    // Simulate analysis - in a real app, this would call an API
    const simulatedRisk = Math.floor(Math.random() * 100);
    dispatch(setRiskPercentage(simulatedRisk));
    setShowResult(true);
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <BackButton title="Alzheimer's Test" />
          <UploadButton title="Upload MRI Scan" onUpload={handleUpload} />
        </View>
        
        <View style={styles.imageContainer}>
          {mriScan ? (
            <Image source={mriScan} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>image</Text>
            </View>
          )}
        </View>
        
        <AlzheimerResult onPress={handleShowResult} />
        
        {showResult && <RiskIndicator percentage={riskPercentage} />}
      </View>
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
  imageContainer: {
    aspectRatio: 1.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default AlzheimerTestScreen;