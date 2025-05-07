import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';

const UploadButton = ({ title, onUpload }) => {
  const handleUpload = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error: ', response.errorMessage);
//       } else {
//         const source = { uri: response.assets[0].uri };
//         onUpload(source);
//       }
  //  });
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