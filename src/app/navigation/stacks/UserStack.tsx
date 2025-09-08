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
import { UserData } from '../../types/apiTypes';
import {Ionicons} from '@expo/vector-icons'

import UserDashboardScreen from '../../screens/UserDashboardScreen';
import DetalhesSala from '../../screens/UserDetalhesSala';
import Logout from '../../screens/logout';
import UserBottomTabs from '../bottomTabs/UserBottomTabs';

// import ProfileScreen from '../screens/ProfileScreen';

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


const Stack = createStackNavigator<UserStackParamList>();

export const UserNavigator = () => (
  <Stack.Navigator screenOptions={{}}>
    <Stack.Screen
      name='UserTabs'
      component={UserBottomTabs}
      options={{
        headerShown: false,
        headerTitle: 'Salas'
      }}
    />

    <Stack.Screen name='DetalhesSala' options={{headerShown: true, headerTitle: 'Detalhes da sala'}} component={DetalhesSala} />
    
    <Stack.Screen name='Logout' component={Logout} options={{
      headerShown: false,
    }}/>
    
    {/* <Stack.Screen name='Logout' component={Logout} /> */}

    {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
  </Stack.Navigator>
);

// const Drawer = createDrawerNavigator()



// export const UserNavigator = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         drawerPosition: 'right',
//         headerShown: false,
//         drawerActiveTintColor: colors.sblue,
//         drawerActiveBackgroundColor: colors.sgray,
//         drawerInactiveTintColor: 'white',
//         drawerInactiveBackgroundColor: colors.sblue,
        
//         drawerItemStyle: {marginTop: 15, borderRadius: 20, paddingLeft: 5},
//         drawerLabelStyle: {
//           fontSize: 18,
//           // color: 'white',
//           fontWeight: 'bold',
//         },
//       }}
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       >

//       <Drawer.Screen 
//         name='UserDrawer'
//         component={UserContentStack}
//         options={{
//           title: 'Salas',
//           drawerIcon: ({color, size}) => (
//             <Ionicons name='home-outline' color={color} size={size}/>
//           )
          
//         }}
//         />

//       <Drawer.Screen 
//         name='logout'
//         component={Logout}
//         options={{
//           title: 'Sair',
//           drawerIcon: ({color, size}) => (
//             <Ionicons name='log-out-outline' color={color} size={size}/>
//           )

//         }}
//       />
//     </Drawer.Navigator>
//   )
// }

// export function CustomDrawerContent(props: DrawerContentComponentProps){

//   const [dadosUsuario, setDadosUsuario] = useState<UserData|null>()

//   useEffect(() => {
//     const carregarDadosUsuario = async () => {
//       try{
//         const userData: UserData | null = await usuarioLogado()
//         setDadosUsuario(userData)
//       } catch(erro: any){

//       }
//     }

//     carregarDadosUsuario()
//   }, [])

//   return (
//     <DrawerContentScrollView {...props}>
//       {/* Seus estilos personalizados aqui */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Bem-vindo, {dadosUsuario ? dadosUsuario.username : 'Usuário'}!</Text>
//       </View>

//       {/* Renderiza os itens de tela padrão */}
//       <DrawerItemList {...props} />

//       {/* Adicione outros componentes ou botões aqui */}
//       {/* <View style={styles.footer}>
//         <Text style={styles.footerText}>Versão 1.0</Text>
//       </View> */}
//     </DrawerContentScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   header: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: '#f8f8f8',
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   footer: {
//     padding: 10,
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#888',
//   },
// });

// // export default CustomDrawerContent;