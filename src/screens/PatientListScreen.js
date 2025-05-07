import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PatientListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Patient List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PatientListScreen;
