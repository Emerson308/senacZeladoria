// navigation/UserStack.tsx
import React, { useEffect, useState } from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import DetalhesSala from '../screens/DetalhesSala';
import { RootStackParamList } from '../types/telaTypes';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { colors } from '../../styles/colors';
import { usuarioLogado } from '../servicos/servicoAutenticacao';
import { UserData } from '../types/apiTypes';
import Logout from '../screens/logout';
import {Ionicons} from '@expo/vector-icons'

// import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const UserContentStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={UserDashboardScreen} />
    <Stack.Screen name='DetalhesSala' options={{headerShown: false}} component={DetalhesSala} />
    {/* <Stack.Screen name='Logout' component={Logout} /> */}

    {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
  </Stack.Navigator>
);

const Drawer = createDrawerNavigator()

export const UserNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerItemStyle: {marginTop: 15, borderRadius: 20, paddingLeft: 5, backgroundColor: colors.sblue},
        drawerLabelStyle: {
          fontSize: 18,
          color: 'white',
          fontWeight: 'bold',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      >

      <Drawer.Screen 
        name='UserDrawer'
        component={UserContentStack}
        options={{
          title: 'Salas',
          headerShown: true,
          drawerIcon: ({color, size}) => (
            <Ionicons name='home-outline' color={'white'} size={size}/>
          )
          
        }}
        />

      <Drawer.Screen 
        name='logout'
        component={Logout}
        options={{
          title: 'Sair',
          headerShown: false,
          drawerIcon: ({color, size}) => (
            <Ionicons name='log-out-outline' color={'white'} size={size}/>
          )

        }}
      />
    </Drawer.Navigator>
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

// export default CustomDrawerContent;