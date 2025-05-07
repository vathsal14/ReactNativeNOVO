import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Header = ({ doctorName = 'Dr. Alex' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <Text style={styles.title}>NOVO NeuroTech</Text>
      </View>
      <View style={styles.rightSection}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.doctorImage}
        />
        <Text style={styles.doctorName}>{doctorName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  doctorName: {
    fontSize: 14,
    color: '#333333',
  },
});

export default Header;