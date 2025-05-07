import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ title }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.arrow}>←</Text>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  arrow: {
    fontSize: 18,
    marginRight: 8,
    color: '#6C63FF',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C63FF',
  },
});

export default BackButton;