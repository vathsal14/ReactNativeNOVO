// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   KeyboardAvoidingView,
//   ScrollView,
//   //ActivityIndicator,
//   Alert,
//   Image,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { login, clearError } from '../redux/slices/authSlice';

// import { COLORS, FONTS } from '../../constants/theme';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// //import ReactNativeBiometrics from 'react-native-biometrics';


// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [secure, setSecure] = useState(true);
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);

//   // useEffect(() => {
//   //   const autoLogin = async () => {
//   //     try {
//   //       console.log('Attempting auto-login...');
//   //       const result = await dispatch(login({ email: 'doctor@gmail.com', password: '12345' })).unwrap();
//   //       console.log('Auto-login successful:', result);
//   //       if (result) {
//   //         navigation.reset({
//   //           index: 0,
//   //           routes: [{ name: 'DoctorScreen' }], // Ensure 'DoctorScreen' matches the registered route name
//   //         });
//   //       }
//   //     } catch (loginError) {
//   //       console.error('Auto-login failed:', loginError);
//   //       if (navigation.isFocused()) {
//   //         Alert.alert('Login Error', 'Automatic login failed');
//   //       }
//   //     }
//   //   };

//   //   autoLogin();
//   // }, [dispatch, navigation]);

//   // const handleLogin = async () => {
//   //   try {
//   //     const result = await dispatch(login({ email, password })).unwrap();
//   //     console.log('Login successful:', result);
//   //     navigation.reset({
//   //       index: 0,
//   //       routes: [{ name: 'DoctorScreen' }], // Ensure 'DoctorScreen' matches the registered route name
//   //     });
//   //   } catch (loginError) {
//   //     console.error('Login failed:', loginError);
//   //     Alert.alert('Login Error', 'Login failed. Navigating to another page.');
//   //     navigation.reset({
//   //       index: 0,
//   //       routes: [{ name: 'DoctorScreen' }], // Ensure 'DoctorScreen' matches the registered route name
//   //     });
//   //   }
//   // };
//   // const handleLogin = async () => {
//   //   try {
//   //     console.log('Attempting login with:', email, password);
//   //     const result = await dispatch(login({ email, password })).unwrap();
//   //     console.log('Login successful:', result);
//   //     navigation.reset({
//   //       index: 0,
//   //       routes: [{ name: 'DoctorScreen' }],
//   //     });
//   //   } catch (loginError) {
//   //     console.error('Login failed:', loginError);
//   //     Alert.alert('Login Error', 'Login failed. Navigating to another page.');
//   //     navigation.reset({
//   //       index: 0,
//   //       routes: [{ name: 'DoctorScreen' }],
//   //     });
//   //   }
//   // };
//   const handleLogin = () => {
//     // You can later add real login logic here.
//     navigation.replace('DoctorScreen');
//   };

//   useEffect(() => {
//     if (error) {
//       Alert.alert('Login Error', error, [
//         { text: 'OK', onPress: () => dispatch(clearError()) },
//       ]);
//     }
//   }, [error, dispatch]);

//   const handleForgotPassword = () => {
//     navigation.navigate('ForgotPassword');
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding">
//       <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
//         <View style={styles.logoContainer}>
//           <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} />
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Hospital Login</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor={COLORS.textLight}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor={COLORS.textLight}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={secure}
//             />
//             <TouchableOpacity
//               style={styles.eyeIcon}
//               onPress={() => setSecure(!secure)}
//             >
//               <Icon name={secure ? 'eye-slash' : 'eye'} size={20} color={COLORS.textLight} />
//             </TouchableOpacity>
//           </View>
//           {/* <TouchableOpacity
//             style={styles.loginButton}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color={COLORS.white} />
//             ) : (
//               <Text style={styles.loginButtonText}>Login</Text>
//             )}
//           </TouchableOpacity> */}
//           <TouchableOpacity
//   style={styles.loginButton}
//   onPress={handleLogin}
// >
//   <Text style={styles.loginButtonText}>Login</Text>
// </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.touchIdContainer}
//         //onPress={handleBiometricLogin}
//         >
//           <Icon name="fingerprint" size={24} color={COLORS.primaryDark} />
//           <Text style={styles.touchIdText}>Touch ID</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleForgotPassword}>
//           <Text style={styles.forgotPasswordText}>Forgot password?</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   title: {
//     ...FONTS.h2,
//     color: COLORS.primaryDark,
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   formContainer: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 15,
//     width: '100%',
//     position: 'relative',
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: COLORS.muted,
//     borderRadius: 8,
//     paddingHorizontal: 20,
//     ...FONTS.body4,
//     color: COLORS.text,
//     backgroundColor: COLORS.white,
//     width: '100%',
//   },
//   eyeIcon: {
//     position: 'absolute',
//     right: 12,
//     top: 15,
//     zIndex: 1,
//   },
//   loginButton: {
//     backgroundColor: COLORS.primary,
//     height: 50,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     width: '100%',
//   },
//   loginButtonText: {
//     ...FONTS.h4,
//     color: COLORS.white,
//   },
//   touchIdContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 30,
//   },
//   touchIdText: {
//     marginTop: 8,
//     ...FONTS.body4,
//     color: COLORS.primaryDark,
//   },
//   forgotPasswordText: {
//     ...FONTS.body5,
//     color: COLORS.primary,
//     textAlign: 'center',
//     marginTop: 15,
//   },
// });

// export default LoginScreen;
