// navigation/UserStack.tsx
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

import DetalhesSalaScreen from '../../screens/DetalhesSalaScreen';
// import Logout from '../../screens/logout';
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
        headerTitle: 'Salas'
      }}
    />

    <Stack.Screen name='DetalhesSala' options={{ headerTitle: 'Detalhes da sala'}} component={DetalhesSalaScreen} />
    
    <Stack.Screen name='AlterarSenha' options={{ headerShown: false }} component={AlterarSenhaScreen} />
        
  </Stack.Navigator>
);

