import React from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { UserStackParamList } from '../types/UserStackTypes';
import DetalhesSalaScreen from '../../screens/DetalhesSalaScreen';
import BottomTabs from './BottomTabs';
import AlterarSenhaScreen from '../../screens/AlterarSenhaScreen';


const Stack = createStackNavigator<UserStackParamList>();

export const UserNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>

    <Stack.Screen
      name='UserTabs'
      component={BottomTabs}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen name='DetalhesSala' options={{ headerTitle: 'Detalhes da sala'}} component={DetalhesSalaScreen} />
    
    <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} />
        
  </Stack.Navigator>
);

