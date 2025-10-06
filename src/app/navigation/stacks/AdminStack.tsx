import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminStackParamList } from '../types/AdminStackTypes';
import BottomTabs from './BottomTabs';
import DetalhesSalaScreen from '../../screens/DetalhesSalaScreen';
import AlterarSenhaScreen from '../../screens/AlterarSenhaScreen';
import FormSalaScreen from '../../screens/FormSalaScreen';


const Stack = createStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>

    <Stack.Screen name="AdminTabs" options={{headerShown: false}} component={BottomTabs} />

    <Stack.Screen name="DetalhesSala" component={DetalhesSalaScreen} />

    <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} />
    
    <Stack.Screen name='FormSala' options={{ headerShown: false }} component={FormSalaScreen} />
    

  </Stack.Navigator>
);

