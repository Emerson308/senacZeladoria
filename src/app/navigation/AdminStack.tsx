// navigation/AdminStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

export const AdminNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
  </Stack.Navigator>
);