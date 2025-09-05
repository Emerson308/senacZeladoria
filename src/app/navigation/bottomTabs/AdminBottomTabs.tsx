
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons"
import { AdminStackParamList } from "../types/AdminStackTypes";
import AdminDashboardScreen from "../../screens/AdminDashboardScreen";
import { colors } from "../../../styles/colors";
import Logout from "../../screens/logout";
import UsuariosScreen from "../../screens/UsuariosScreen";
import PerfilScreen from "../../screens/perfilScreen";





const Tab = createBottomTabNavigator<AdminStackParamList>()

export default function AdminBottomTabs(){
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if( route.name === 'Home' ){
                        iconName = focused ? 'home' : 'home-outline'
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
                component={AdminDashboardScreen}
                options={{title: 'Início',}}
            />

            <Tab.Screen
                name="Usuarios"
                component={UsuariosScreen}
                options={{title: 'Usuários', headerShown: true}}
            />

            <Tab.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{title: 'Perfil'}}
            />


        </Tab.Navigator>
    )
}






