// navigation/AdminStack.tsx
import React, { useEffect, useState } from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { UserStackParamList } from '../types/UserStackTypes';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { colors } from '../../../styles/colors';
// import { usuarioLogado } from '../../servicos/servicoAutenticacao';
import { usuarioLogado } from '../../servicos/servicoUsuarios';
import { Usuario } from '../../types/apiTypes';
import {Ionicons} from '@expo/vector-icons'

import SalasScreen from '../../screens/SalasScreen';
import { AdminStackParamList } from '../types/AdminStackTypes';
import Logout from '../../screens/logout';
// import AdminDetalhesSala from '../../screens/AdminDetalhesSala';
import BottomTabs from './BottomTabs';
import UsuariosScreen from '../../screens/UsuariosScreen';
import DetalhesSalaScreen from '../../screens/DetalhesSalaScreen';
import AlterarSenhaScreen from '../../screens/AlterarSenhaScreen';
import FormSalaScreen from '../../screens/FormSalaScreen';


const Stack = createStackNavigator<AdminStackParamList>();

export const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="AdminTabs" options={{
      headerShown: false,
      headerTitle: 'Salas',
      // headerRight: () => <MenuButton/>
      }} component={BottomTabs} />

    <Stack.Screen name="DetalhesSala" options={{
      // headerShown: true,
      headerTitle: 'Detalhes da sala',
      // headerRight: () => <MenuButton/>
      }} component={DetalhesSalaScreen} />

    <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} />
    
    <Stack.Screen name='FormSalaPart1' options={{ headerShown: false }} component={FormSalaScreen} />
    
    {/* <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} /> */}
    
    {/* <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} /> */}

    <Stack.Screen name='Logout' component={Logout} options={{
      headerShown: false,
    }}/>

  </Stack.Navigator>
);

