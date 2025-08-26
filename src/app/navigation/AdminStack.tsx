// navigation/AdminStack.tsx
import React, { useEffect, useState } from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { UserStackParamList } from '../types/UserStackTypes';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { colors } from '../../styles/colors';
import { usuarioLogado } from '../servicos/servicoAutenticacao';
import { UserData } from '../types/apiTypes';
import {Ionicons} from '@expo/vector-icons'

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import { AdminStackParamList } from '../types/AdminStackTypes';
import Logout from '../screens/logout';
import AdminDetalhesSala from '../screens/DetalhesSala';

// import SettingsScreen from '../screens/SettingsScreen';

function MenuButton() {
  const navigation = useNavigation<DrawerScreenProps<any>['navigation']>();
  return (
    <Ionicons 
      name='menu' 
      size={30} 
      color='black' 
      style={{ marginRight: 15 }} 
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
    />
  );
}


const Stack = createStackNavigator<AdminStackParamList>();

export const AdminContentStack = () => (
  <Stack.Navigator screenOptions={{}}>
    <Stack.Screen name="Home" options={{
      headerShown: true,
      headerTitle: 'Salas',
      headerRight: () => <MenuButton/>
      }} component={AdminDashboardScreen} />

    <Stack.Screen name="DetalhesSala" options={{
      headerShown: true,
      headerTitle: 'Detalhes da sala',
      headerRight: () => <MenuButton/>
      }} component={AdminDetalhesSala} />

    
    {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
  </Stack.Navigator>
);

const AdminDrawer = createDrawerNavigator()

export const AdminNavigator = () => {
  return (
    <AdminDrawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerActiveTintColor: colors.sblue,
        drawerActiveBackgroundColor: colors.sgray,
        drawerInactiveTintColor: 'white',
        drawerInactiveBackgroundColor: colors.sblue,
        drawerItemStyle: {
          marginTop: 15, 
          borderRadius: 20, 
          paddingLeft: 5, 
          // backgroundColor: colors.sblue,

        },
        drawerLabelStyle: {
          fontSize: 18,
          // color: 'white',
          fontWeight: 'bold',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props}/>}
    >

      <AdminDrawer.Screen
        name='AdminDrawer'
        component={AdminContentStack}
        options={{
          title: 'Salas',
          drawerIcon: ({color, size}) => (
            <Ionicons name='home-outline' color={color} size={size}/>
          )
          
        }}
      />

      <AdminDrawer.Screen 
        name='logout'
        component={Logout}
        options={{
          title: 'Sair',
          drawerIcon: ({color, size}) => (
            <Ionicons name='log-out-outline' color={color} size={size}/>
          )

        }}
      />
      

    </AdminDrawer.Navigator>
  )
}

export function CustomDrawerContent(props: DrawerContentComponentProps){

  const [dadosUsuario, setDadosUsuario] = useState<UserData|null>()

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try{
        const userData: UserData | null = await usuarioLogado()
        setDadosUsuario(userData)
      } catch(erro: any){

      }
    }

    carregarDadosUsuario()
  }, [])

  return (
    <DrawerContentScrollView {...props}>
      {/* Seus estilos personalizados aqui */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bem-vindo, {dadosUsuario ? dadosUsuario.username : 'Usuário'}!</Text>
      </View>

      {/* Renderiza os itens de tela padrão */}
      <DrawerItemList {...props} />

      {/* Adicione outros componentes ou botões aqui */}
      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0</Text>
      </View> */}
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
  },
});


