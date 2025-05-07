import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
//import { NavigationContainer } from '@react-navigation/native';

// Navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingNavigator from './OnboardingNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, isOnboarded } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboarded ? (
        <Stack.Screen name="OnboardingNavigator" component={OnboardingNavigator} />
      ) : !isAuthenticated ? (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
