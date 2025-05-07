import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RiskIndicator = ({ percentage = 0 }) => {
  // Determine color based on risk percentage
  const getColor = () => {
    if (percentage < 30) return '#4CAF50'; // Green for low risk
    if (percentage < 70) return '#FF9800'; // Orange for medium risk
    return '#F44336'; // Red for high risk
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Risk Percentage:</Text>
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, { backgroundColor: getColor() }]}>
          <Text style={styles.indicatorText}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  indicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default RiskIndicator;