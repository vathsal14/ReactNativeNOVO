import React,{useEffect, useState} from 'react';
import{view, ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native'; // Import Platform
import HomeScreen from './src/screens/main/HomeScreen.js';
import PatientDetailsScreen from './src/screens/main/PatientDetailsScreen.js';
import CalendarScreen from './src/screens/main/CalendarScreen.js';
//import ProfileScreen from './src/screens/main/ProfileScreen.js';
import ReportsScreen from './src/screens/main/ReportsScreen.js';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen.js';
import LoginScreen from './src/screens/auth/LoginScreen2.js';
import VerifyOtpScreen from './src/screens/auth/VerifyOtpScreen.js';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen.js';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen.js';
//import DoctorScreen from './src/screens/main/DoctorScreen.js';
import PatientListScreen from './src/screens/main/PatientListScreen.js';
import BrainTestScreen from './src/screens/main/BrainTestScreen.js';
import ParkinsonTestScreen from './src/screens/main/ParkinsonTestScreen.js';
import BottomTabNavigator from './src/navigation/BottomTabNavigator.js';
import AlzheimerTestScreen from './src/screens/main/AlzheimerTestScreen.js';
import EpilepsyTestScreen from './src/screens/main/EpilepsyTestScreen.js';

//import CustomTabBar from './src/components/CustomTabBar.js';
//import AppointmentsScreen from './src/screens/main/AppointmentsScreen.js';
//import DocumentsScreen from './src/screens/main/DocumentsScreen.js';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              //Platform.OS === 'ios', // Enable gestures only on iOS
            }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false, title: 'Onboarding' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, title: 'Login' }} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ headerShown: false, title: 'Verify OTP' }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false, title: 'Forgot Password' }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false, title: 'Reset Password' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen name="PatientDetailsScreen" component={PatientDetailsScreen} options={{ headerShown: false, title: 'Patient Details' }} />
            <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false, title: 'Calendar' }} />
            {/* <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, title: 'Profile' }} /> */}
            <Stack.Screen name="Reports" component={ReportsScreen} options={{ headerShown: false, title: 'Reports' }} />
            <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false, title: 'Main' }} />
            {/* <Stack.Screen name = "parkinsonTestResultScreen" component={ParkinsonTestScreen} options={{ headerShown: false, title: 'Parkinson Test Result' }} /> */}
            <Stack.Screen name="BrainTestScreen" component={BrainTestScreen} options={{ headerShown: false, title: 'Brain Test' }} />
            <Stack.Screen name="PatientListScreen" component={PatientListScreen} options={{ headerShown: false, title: 'Patient List' }} />
            <Stack.Screen name="ParkinsonTestScreen" component={ParkinsonTestScreen} options={{ headerShown: false, title: 'Parkinson Test' }} />
            <Stack.Screen name="AlzheimerTestScreen" component={AlzheimerTestScreen} options={{ headerShown: false, title: 'Alzheimer Test' }} />
            <Stack.Screen name="EpilepsyTestScreen" component={EpilepsyTestScreen} options={{ headerShown: false, title: 'Epilepsy Test' }} />
            {/* <Stack.Screen name="Doctor" component={DoctorScreen} options={{ headerShown: false, title: 'Doctor' }} /> */}
          </Stack.Navigator>
          {/* <AppNavigator />
           */}
          {/* <BottomTabNavigator /> */}
         
          {/* This is where you can add your custom tab bar */}
          {/* <CustomTabBar /> */}
          {/* Add your custom tab bar here if needed */}

          
        </NavigationContainer>
      
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
