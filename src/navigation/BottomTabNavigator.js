import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CustomTabBar from '../components/CustomTabBar';

import HomeScreen from '../screens/main/HomeScreen';
import PatientListScreen from '../screens/main/PatientListScreen';
import PatientDetailsScreen from '../screens/main/PatientDetailsScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ReportsScreen from '../screens/main/ReportsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: true, title: 'Home' }}
    />
  </Stack.Navigator>
);

// Patient Stack
const PatientStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="PatientList"
      component={PatientListScreen}
      options={{ headerShown: true, title: 'Patients' }}
    />
    <Stack.Screen
      name="PatientDetails"
      component={PatientDetailsScreen}
      options={{ headerShown: true, title: 'Patient Details' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator with Custom TabBar
const MainTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />} // Ensure all props are passed
    screenOptions={{
      headerShown: false, // Hide the tab navigator header
    }}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="Patients" component={PatientStack} options={{ tabBarLabel: 'Patients' }} />
    <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    <Tab.Screen name="Reports" component={ReportsScreen} options={{ tabBarLabel: 'Reports' }} />
  </Tab.Navigator>
);

// Root Navigator
const BottomTabNavigator = () => (
  <NavigationContainer>
    <MainTabNavigator />
  </NavigationContainer>
);

export default BottomTabNavigator;
