import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/auth/LoginScreen2';
import PatientDetailsScreen from '../screens/main/PatientDetailsScreen';
import PatientListScreen from '../screens/main/PatientListScreen';
import BrainTestScreen from '../screens/main/BrainTestScreen';
import ParkinsonTestScreen from '../screens/main/ParkinsonTestScreen';
import ParkinsonTestResultScreen from '../screens/main/ParkinsonTestResultScreen';
import AlzheimerTestScreen from '../screens/main/AlzheimerTestScreen';
import EpilepsyTestScreen from '../screens/main/EpilepsyTestScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MainTab">
      <Stack.Screen
        name="MainTab"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientListScreen"
        component={PatientListScreen}
        options={{ headerShown: false, title: 'Patient List' }}
      />
      <Stack.Screen
        name="PatientDetailsScreen"
        component={PatientDetailsScreen}
        options={{
          title: 'Patient Details',
          headerStyle: { backgroundColor: '#6C63FF' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="ParkinsonTestScreen"
        component={ParkinsonTestScreen}
        options={{ headerShown: false, title: 'Parkinson Test' }}
      />
      <Stack.Screen
        name="ParkinsonTestResultScreen"
        component={ParkinsonTestResultScreen}
        options={{ headerShown: false, title: 'Parkinson Test Result' }}
      />
      <Stack.Screen
        name="BrainTestScreen"
        component={BrainTestScreen}
        options={{ headerShown: false, title: 'Brain Test' }}
      />
      <Stack.Screen
        name="LoginScreen2"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen name="AlzheimerTestScreen" component={AlzheimerTestScreen}  options={{ title: 'Alzheimer Test', headerShown: false }} />
       <Stack.Screen name="EpilepsyTestScreen" component={EpilepsyTestScreen}  options={{ title: 'Epliepsy Test', headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

