import React from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { UserStackParamList } from '../types/StackTypes';
import DetalhesSalaScreen from '../../screens/DetalhesSalaScreen';
import BottomTabs from './BottomTabs';
import AlterarSenhaScreen from '../../screens/AlterarSenhaScreen';
import NotificationScreen from '../../screens/NotificationScreen';
import ConcluirLimpezaForm from '../../screens/ConcluirLimpezaForm';
import LimpezasAndamentoScreen from '../../screens/LimpezasAndamentoScreen';


const Stack = createStackNavigator<UserStackParamList>();

export const UserNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>

    <Stack.Screen
      name='Tabs'
      component={BottomTabs}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen name='DetalhesSala' options={{ headerTitle: 'Detalhes da sala'}} component={DetalhesSalaScreen} />
    
    <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} />
        
    <Stack.Screen name='Notifications' options={{ headerShown: false }} component={NotificationScreen} />

    <Stack.Screen name='LimpezasAndamento' component={LimpezasAndamentoScreen} />

    <Stack.Screen name='ConcluirLimpeza' component={ConcluirLimpezaForm} />

    {/* <Stack.Screen /> */}
    
  </Stack.Navigator>
);

