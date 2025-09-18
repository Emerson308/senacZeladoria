
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons"
import { AdminStackParamList } from "../types/AdminStackTypes";
import SalasScreen from "../../screens/SalasScreen";
import { colors } from "../../../styles/colors";
import UsuariosScreen from "../../screens/UsuariosScreen";
import PerfilScreen from "../../screens/PerfilScreen";
import RegistrosLimpezaScreen from "../../screens/RegistrosLimpezaScreen";
import { AuthContext } from "../../AuthContext";





const Tab = createBottomTabNavigator<AdminStackParamList>()

export default function BottomTabs(){

    const authContext = useContext(AuthContext)

    if(!authContext){
        return null
    }

    const {userRole} = authContext

    if(userRole === 'admin'){

        return(
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName: keyof typeof Ionicons.glyphMap = 'home';
                        if( route.name === 'Home' ){
                            iconName = focused ? 'home' : 'home-outline'
                        } else if(route.name === 'RegistrosLimpeza'){
                            iconName = focused ? 'reader' : 'reader-outline'
                        } else if (route.name === 'Usuarios'){
                            iconName = focused ? 'people' : 'people-outline'
                        } else if(route.name === 'Perfil'){
                            iconName = focused ? 'person' : 'person-outline'
                            
                        }
    
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: colors.sblue,
                    tabBarInactiveTintColor: 'gray',
                    headerShown: true,
                })
                }
                
            >
                <Tab.Screen
                    name="Home"
                    component={SalasScreen}
                    options={{title: 'Início',}}
                />
    
                <Tab.Screen
                    name="RegistrosLimpeza"
                    component={RegistrosLimpezaScreen}
                    options={{title: 'Registros'}}
    
                />
    
                <Tab.Screen
                    name="Usuarios"
                    component={UsuariosScreen}
                    options={{title: 'Usuários', headerShown: true}}
                />
    
                <Tab.Screen
                    name="Perfil"
                    component={PerfilScreen}
                    options={{title: 'Perfil', headerShown: false}}
                />
    
    
            </Tab.Navigator>
        )
    } else{
        return(
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName: keyof typeof Ionicons.glyphMap = 'home';
                        if( route.name === 'Home' ){
                            iconName = focused ? 'home' : 'home-outline'
                        } else if(route.name === 'Perfil'){
                            iconName = focused ? 'person' : 'person-outline'
                            
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: colors.sblue,
                    tabBarInactiveTintColor: 'gray',
                    headerShown: true,
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={SalasScreen}
                    options={{title: 'Início'}}
                />

                <Tab.Screen
                    name="Perfil"
                    component={PerfilScreen}
                    options={{title: 'Perfil'}}
                />
                
            </Tab.Navigator>
        )
        
    }

}






