import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminStackParamList } from '../types/StackTypes';
import BottomTabs from './BottomTabs';
import DetalhesSalaScreen from '../../screens/DetalhesSalaScreen';
import AlterarSenhaScreen from '../../screens/AlterarSenhaScreen';
import FormSalaScreen from '../../screens/FormSalaScreen';
import NotificationScreen from '../../screens/NotificationScreen';
import LimpezasAndamentoScreen from '../../screens/LimpezasAndamentoScreen';
import ConcluirLimpezaForm from '../../screens/ConcluirLimpezaForm';
import QRCodeScanner from '../../screens/QrCodeScanner';


const Stack = createStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>

    <Stack.Screen name="Tabs" options={{headerShown: false}} component={BottomTabs} />

    <Stack.Screen name="DetalhesSala" component={DetalhesSalaScreen} />

    <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} />
    
    <Stack.Screen name='FormSala' options={{ headerShown: false }} component={FormSalaScreen} />

    <Stack.Screen name='Notifications' options={{ headerShown: false }} component={NotificationScreen} />

    <Stack.Screen name='LimpezasAndamento' component={LimpezasAndamentoScreen} />

    <Stack.Screen name='ConcluirLimpeza' component={ConcluirLimpezaForm} />
    
    <Stack.Screen name='QrCodeScanner' component={QRCodeScanner} />


    
  </Stack.Navigator>
);

