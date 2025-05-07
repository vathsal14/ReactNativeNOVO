import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
//import PatientListScreen from '../PatientListScreen';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchID from 'react-native-touch-id';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
//import TouchID from 'react-native-touch-id';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (username && password) {
      try {
        if (username === 'test@gmail.com' && password === 'test') {
          console.log('Navigating to PatientListScreen');
          navigation.navigate('PatientListScreen'); // Ensure the name matches the Stack.Screen name
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      } catch (error) {
        console.log('Navigation error:', error);
        Alert.alert('Error', 'Something went wrong');
      }
    } else {
      Alert.alert('Error', 'Please enter username and password');
    }
  };

  const handleTouchID = () => {
    const optionalConfigObject = {
      title: 'Authentication Required', // Android
      imageColor: COLORS.primary, // Android
      imageErrorColor: COLORS.error, // Android
      sensorDescription: 'Touch sensor', // Android
      sensorErrorDescription: 'Failed', // Android
      cancelText: 'Cancel', // Android
      fallbackLabel: 'Use Passcode', // iOS
    };
    TouchID.authenticate('Authenticate with Touch ID', optionalConfigObject)
      .then(() => {
        Alert.alert('Success', 'Authenticated successfully');
        navigation.navigate('PatientListScreen'); // Navigate on successful authentication
      })
      .catch(() => {
        Alert.alert('Error', 'Authentication failed');
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} />
        </View>


        <View style={styles.formContainer}>
          <Text style={styles.title}>Hospital Login</Text>
          <View style={styles.inputContainer}>
            {/* Email Icon */}
            <Icon name="mail-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={[styles.input, {paddingLeft: 10}]}
              placeholder="Email"
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            {/* Password Icon */}
            <Icon name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
            {/* <Icon name="lock-closed-outline" size={20} color="#888" style={styles.icon} /> */}
            <TextInput
              style={[styles.input, {paddingLeft: 10}]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            {/* Eye Icon for Show/Hide Password */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.touchIdButton} onPress={handleTouchID}>
          <Icon name="finger-print" size={40} color={COLORS.primary} style={styles.touchIdIcon} />
          <Text style={styles.touchIdText}>Use Fingerprint</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
-
      </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      padding:20,
      justifyContent: 'center',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 0,
    },
    logo: {
      width: 250,
      height: 150,
      resizeMode: 'contain',
      marginTop:0,
    },
    title: {
      ...FONTS.h2,
      color: COLORS.primaryDark,
      textAlign: 'center',
      marginBottom: 40,
      fontFamily: 'Inter-Bold',
      fontSize: 24,
      lineHeight: 30,
      fontWeight: 'bold',
      //textDecorationLine: 'underline',
    },
    formContainer: {
      width: '106%',
      height: '56%',
      backgroundColor: COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:0,
      marginBottom: 50,
      borderWidth: 1,
      borderColor: COLORS.primary,
      padding: 20,
      borderRadius: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 8,
      backgroundColor: COLORS.white,
      paddingHorizontal: 10,
      marginBottom: 25,
      height: 50,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: COLORS.text,
      paddingLeft: 10, // Add padding to avoid overlap with the icon
    },
    eyeIcon: {
      position: 'absolute',
      right: 10,
      top: 15,
      zIndex: 1,
    },
    loginButton: {
      backgroundColor: COLORS.primaryDark,
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    loginButtonText: {
      ...FONTS.h4,
      color: COLORS.white,
    },
    touchIdContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    touchIdText: {
      marginTop: 8,
      ...FONTS.body4,
      color: COLORS.primaryDark,
    },
    touchIdButton:{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    touchIdIcon: {
      marginBottom: 8,
      color: COLORS.primary,
    },
    icon: {
      marginLeft: 10, // Add spacing to the left of the icon
      marginRight: 10, // Add spacing to the right of the icon
      color: '#888', // Ensure the color is visible
    },
    forgotPassword:{
      ...FONTS.body5,
      color:COLORS.primary,
      textAlign:'center',
      marginTop:50,
    },
  });

export default LoginScreen;
