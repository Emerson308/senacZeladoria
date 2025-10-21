
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons"
import { AdminStackParamList } from "../types/StackTypes";
import SalasScreen from "../../screens/SalasScreen";
import { colors } from "../../../styles/colors";
import UsuariosScreen from "../../screens/UsuariosScreen";
import PerfilScreen from "../../screens/PerfilScreen";
import RegistrosLimpezaScreen from "../../screens/RegistrosLimpezaScreen";
import { AuthContext } from "../../AuthContext";
import { Platform, View, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotifications } from "../../contexts/NotificationsContext";
import EstatisticasLimpeza from "../../screens/EstatisticasLimpeza";




const Tab = createBottomTabNavigator<AdminStackParamList>()


interface HomeTabIconProps{
    focused: boolean,
    color: string,
    size: number
}
const HomeTabIcon = ({focused, color, size}: HomeTabIconProps) => {
    const {contagemNotificacoesNaoLidas} = useNotifications()

    const count = contagemNotificacoesNaoLidas

    const iconName = focused ? 'home' : 'home-outline'

    return (
        <View
            className=" relative"
            style={{
                width: size,
                height: size
            }}
        >
            {/* <View className="flex-1"> */}
                <Ionicons name={iconName} size={size} color={color}/>
                {(count === 0) ? null :
                    (
                    <View className=" rounded-full absolute bg-sred aspect-square h-4 -right-2 -top-1">
                        {/* <Text className="text-xs text-white" ></Text> */}
                    </View>    
                    )                                
                }

            {/* </View> */}
        </View>                    
    )
}


export default function BottomTabs(){

    const authContext = useContext(AuthContext)

    if(!authContext){
        return null
    }


    const insets = useSafeAreaInsets()

    const {userRole} = authContext

    const commonScreenOptions = {
        tabBarActiveTintColor: colors.sblue,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle:{
            height: 60,
            marginBottom: insets.bottom
        }

    }

    if(userRole === 'admin'){
        return(
            <Tab.Navigator
                safeAreaInsets={{bottom: 0}}
                screenOptions={({ route }) => ({
                    ...commonScreenOptions,
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName: keyof typeof Ionicons.glyphMap = 'home';
                        if( route.name === 'Home' ){
                            iconName = focused ? 'home' : 'home-outline'
                            return <HomeTabIcon focused={focused} size={size} color={color}  />
                        } else if(route.name === 'EstatisticasLimpeza'){
                            iconName = focused ? 'pie-chart' : 'pie-chart-outline'
                        } else if(route.name === 'RegistrosLimpeza'){
                            iconName = focused ? 'reader' : 'reader-outline'
                        } else if (route.name === 'Usuarios'){
                            iconName = focused ? 'people' : 'people-outline'
                        } else if(route.name === 'Perfil'){
                            iconName = focused ? 'person' : 'person-outline'
                            
                        }
    
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })
                }
                
            >
                <Tab.Screen
                    name="Home"
                    component={SalasScreen}
                />

                <Tab.Screen
                    name="EstatisticasLimpeza"
                    component={EstatisticasLimpeza}
                    options={{title: 'Estatísticas'}}
                />
    
                <Tab.Screen
                    name="RegistrosLimpeza"
                    component={RegistrosLimpezaScreen}
                    options={{title: 'Registros'}} //Necessário para não conflitar com o nome da stack
                />
    
                <Tab.Screen
                    name="Usuarios"
                    component={UsuariosScreen}
                />
    
                <Tab.Screen
                    name="Perfil"
                    component={PerfilScreen}
                />
    
    
            </Tab.Navigator>
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
                        return <HomeTabIcon focused={focused} size={size} color={color}  />
                    } else if(route.name === 'Perfil'){
                        iconName = focused ? 'person' : 'person-outline'
                        
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.sblue,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
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
            />
            
        </Tab.Navigator>
    )
}






