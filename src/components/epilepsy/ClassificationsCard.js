import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ClassificationsCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Classifications :</Text>
      <View style={styles.content}>
        {/* This area is empty in the screenshot */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 100,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C63FF',
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
});

export default ClassificationsCard;