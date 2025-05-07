import React, { useState } from 'react';
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
import { forgotPassword, clearError } from '../../redux/slices/authSlice';
import { COLORS, FONTS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await dispatch(forgotPassword(email)).unwrap();
      Alert.alert(
        'Reset Link Sent',
        'A password reset link has been sent to your email',
        [{ text: 'OK', onPress: () => navigation.navigate('VerifyOtp', { email }) }]
      );
    } catch (err) {
      // Error is handled in the reducer
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (error) {
    Alert.alert('Error', error, [
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
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address to receive a password reset link
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
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
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.muted,
    borderRadius: 8,
    paddingHorizontal: 16,
    ...FONTS.body4,
    color: COLORS.text,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
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

export default ForgotPasswordScreen;
