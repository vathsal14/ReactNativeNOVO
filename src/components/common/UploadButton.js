import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const UploadButton = ({ title, onUpload }) => {
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // For Android 13+ (API level 33+)
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Photos Permission',
              message: 'App needs access to your photos to select MRI scans.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } 
        // For Android 12 and below
        else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your storage to select MRI scans.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS doesn't need explicit permission for photo library
  };

  const handleUpload = async () => {
    const hasPermission = await requestStoragePermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied', 
        'You need to grant photo access permission to upload MRI scans. Please go to your device settings and enable permissions for this app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Try Again', 
            onPress: () => requestStoragePermission() 
          }
        ]
      );
      return;
    }
    
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };
    
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick image: ' + response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        console.log('Selected image:', source);
        onUpload(source);
        Alert.alert('Success', 'MRI scan uploaded successfully');
      } else {
        console.log('Unexpected response from image picker:', response);
        Alert.alert('Error', 'Failed to select image');
      }
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleUpload}>
      <Text style={styles.buttonText}>+ {title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  buttonText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default UploadButton;