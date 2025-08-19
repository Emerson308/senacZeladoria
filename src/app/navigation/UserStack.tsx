// navigation/UserStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import DetalhesSala from '../screens/DetalhesSala';
import { RootStackParamList } from '../types/telaTypes';
// import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const UserNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={UserDashboardScreen} />
    <Stack.Screen name='DetalhesSala' component={DetalhesSala} />
    {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
  </Stack.Navigator>
);