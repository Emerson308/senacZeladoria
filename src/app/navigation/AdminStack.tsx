// navigation/AdminStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

export const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="AdminDashboard" options={{headerShown: true}} component={AdminDashboardScreen} />
    {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
  </Stack.Navigator>
);