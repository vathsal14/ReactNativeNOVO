import React, { useState, useRef,
   // useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, clearError } from '../../redux/slices/authSlice';
import { COLORS, FONTS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const VerifyOtpScreen = ({ navigation, route }) => {
  const { email } = route.params || { email: '' };
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if current one is filled
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }

    try {
      await dispatch(verifyOtp({ email, otp: otpString })).unwrap();
    } catch (err) {
      // Error is handled in the reducer
    }
  };

  const handleResend = () => {
    // Implement resend OTP logic
    Alert.alert('Resend OTP', 'A new verification code has been sent to your email');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (error) {
    Alert.alert('Verification Error', error, [
      { text: 'OK', onPress: () => dispatch(clearError()) },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>NT</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>We have sent a verification code to your email</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code?</Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.backContainer} onPress={handleBack}>
          <Icon name="chevron-left" size={16} color={COLORS.textLight} />
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  formContainer: {
    marginTop: 40,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body4,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.muted,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: COLORS.text,
  },
  verifyButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    ...FONTS.body4,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  resendLink: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  backContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  backText: {
    ...FONTS.body5,
    color: COLORS.textLight,
    marginLeft: 4,
  },
});

export default VerifyOtpScreen;
