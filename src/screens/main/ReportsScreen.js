import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const ReportsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reports Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  text: {
    fontSize: 18,
    color: COLORS.black,
  },
});

export default ReportsScreen;
