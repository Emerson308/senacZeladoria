
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
import { Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";




const Tab = createBottomTabNavigator<AdminStackParamList>()

export default function BottomTabs(){

    const authContext = useContext(AuthContext)

    if(!authContext){
        return null
    }

    const insets = useSafeAreaInsets()

    const {userRole} = authContext

    if(userRole === 'admin'){
        return(
            // <SafeAreaView className=" flex-1" edges={['bottom']}>

            <Tab.Navigator
                safeAreaInsets={{bottom: 0}}
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
                    tabBarHideOnKeyboard: true,
                    tabBarStyle: {
                        height: 60,
                        marginBottom: insets.bottom,
                    }
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
            // </SafeAreaView>
        )
    }

    return(
        <Tab.Navigator
            safeAreaInsets={{bottom: 10}}
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
                tabBarStyle: {marginBottom: insets.bottom}
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
                options={{title: 'Perfil', headerShown: false}}
            />
            
        </Tab.Navigator>
    )
}






