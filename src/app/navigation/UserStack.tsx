// navigation/UserStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserDashboardScreen from '../screens/UserDashboardScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export const UserNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
    {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
  </Stack.Navigator>
);