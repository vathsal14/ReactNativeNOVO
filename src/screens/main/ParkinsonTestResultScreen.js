import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ParkinsonModelService from '../../api/parkinsonModelService';

const ParkinsonTestResultScreen = () => {
  const navigation = useNavigation();
  const testResults = useSelector((state) => state.parkinsonTest.testResults);
  
  // State for model prediction results
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get prediction from model when component mounts
  useEffect(() => {
    const getPrediction = async () => {
      try {
        setIsLoading(true);
        const prediction = await ParkinsonModelService.predictRisk(testResults);
        setPredictionResult(prediction);
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting prediction:', error);
        // Fallback to simple calculation if model fails
        const fallbackScore = calculateFallbackScore();
        setPredictionResult({
          riskPercentage: fallbackScore,
          riskLevel: getRiskLevel(fallbackScore).level,
          riskColor: getRiskLevel(fallbackScore).color,
          confidence: 0.7,
          timestamp: new Date().toISOString()
        });
        setIsLoading(false);
      }
    };
    
    getPrediction();
  }, [testResults]);
  
  // Fallback calculation if model fails
  const calculateFallbackScore = () => {
    const caudateRatio = (parseFloat(testResults.datScan.caudateR) + 
                          parseFloat(testResults.datScan.caudateL)) / 2;
    const putamenRatio = (parseFloat(testResults.datScan.putamenR) + 
                          parseFloat(testResults.datScan.putamenL)) / 2;
    const updrsScore = parseFloat(testResults.updrs.npdtot);
    const smellScore = parseFloat(testResults.smellTest.upsitPercentage);
    const cognitiveScore = parseFloat(testResults.cognitive.cogchq);
    
    // Simple weighted calculation (for demonstration only)
    const score = (
      (3 - caudateRatio) * 10 + 
      (3 - putamenRatio) * 15 + 
      updrsScore * 5 + 
      (30 - smellScore) * 0.5 + 
      cognitiveScore * 10
    ) / 10;
    
    return Math.min(Math.max(score, 0), 100).toFixed(1);
  };
  
  const getRiskLevel = (score) => {
    const numScore = parseFloat(score);
    if (numScore < 30) return { level: 'Low', color: '#4CAF50' };
    if (numScore < 60) return { level: 'Moderate', color: '#FF9800' };
    return { level: 'High', color: '#F44336' };
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="#5856D6" />
          <Text style={styles.backButtonText}>Back to Test</Text>
        </TouchableOpacity>
      </View>
      
      {/* Results Summary */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Parkinson's Test Results</Text>
        
        {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5856D6" />
          <Text style={styles.loadingText}>Processing data with model...</Text>
        </View>
      ) : (
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, { borderColor: predictionResult.riskColor }]}>
            <Text style={[styles.scoreText, { color: predictionResult.riskColor }]}>
              {predictionResult.riskPercentage}%
            </Text>
          </View>
          <Text style={[styles.riskLevel, { color: predictionResult.riskColor }]}>
            {predictionResult.riskLevel} Risk
          </Text>
          <Text style={styles.confidenceText}>
            Model Confidence: {(predictionResult.confidence * 100).toFixed(0)}%
          </Text>
        </View>
      )}
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Test Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>DAT Scan</Text>
            <Text style={styles.summaryValue}>
              {((parseFloat(testResults.datScan.caudateR) + 
                parseFloat(testResults.datScan.caudateL) + 
                parseFloat(testResults.datScan.putamenR) + 
                parseFloat(testResults.datScan.putamenL)) / 4).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>UPDRS Score</Text>
            <Text style={styles.summaryValue}>{testResults.updrs.npdtot}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Smell Test</Text>
            <Text style={styles.summaryValue}>{testResults.smellTest.upsitPercentage}%</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cognitive Score</Text>
            <Text style={styles.summaryValue}>{testResults.cognitive.cogchq}</Text>
          </View>
        </View>
        
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>Recommendations</Text>
          <Text style={styles.recommendationText}>
            Based on the test results, we recommend scheduling a follow-up appointment
            with your neurologist to discuss these findings in detail. Continue with
            your current medication regimen and monitor for any changes in symptoms.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Share Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.secondaryButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
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
  resultContainer: {
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
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  recommendationContainer: {
    marginBottom: 24,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
  },
  actionButton: {
    backgroundColor: '#5856D6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5856D6',
  },
  secondaryButtonText: {
    color: '#5856D6',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
});

export default ParkinsonTestResultScreen;