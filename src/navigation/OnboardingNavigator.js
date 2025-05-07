import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

import LoginScreen from '../screens/onboarding/LoginScreen';
import PatientList from '../screens/onboarding/PatientList';

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name ="PatientList" component={PatientList} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
