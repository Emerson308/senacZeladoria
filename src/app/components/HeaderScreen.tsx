import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usuarioLogado } from "../servicos/servicoUsuarios";
import { RegistroSala, Usuario } from "../types/apiTypes";
import { Alert, Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, Avatar, Searchbar, TextInput, TouchableRipple } from "react-native-paper";
import { AuthContext } from "../AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import { getRegistrosService } from "../servicos/servicoSalas";
import RegistroCard from "../components/RegistroCard";
import Toast from "react-native-toast-message";
import {Ionicons} from "@expo/vector-icons"






interface HeaderScreenProps{
    searchBar: {
        searchText: string,
        setSearchText: (texto: string) => void
        searchLabel: string
    },
    headerNavButtons?: boolean,
    // filterOptions?: boolean,
    headerText: string,
    showFilterOptions?: (visibility: boolean) => void,
    userGroups?: number[]
}


export default function HeaderScreen({searchBar, headerNavButtons=false, headerText, userGroups, showFilterOptions}: HeaderScreenProps){

    return(
        <View className="bg-white py-2 border-b-2 border-gray-200 gap-2 px-5" >
            <View className=" flex-row h-20 gap-4 items-center">
                <Text className=" text-2xl flex-1">{headerText}</Text>
                {(headerNavButtons && userGroups) && 
                    <>
                        <TouchableRipple onPress={() => console.log('qr-code')} 
                            borderless={true} 
                            className=" rounded-full p-2 aspect-square"
                        >
                            <Ionicons name="qr-code-outline" size={32}/>                   
                        </TouchableRipple>
                        {userGroups.includes(1) &&
                            <TouchableRipple onPress={() => console.log('Notifications')}
                                borderless={true}
                                className=" rounded-full p-2 aspect-square"
                            >
                                <Ionicons name="notifications-outline" size={32}/>
                            </TouchableRipple>                    
                        }
                    </>
                }

            </View>

            <View className=" flex-row h-20 gap-4 items-center">
                <Searchbar
                    placeholder={searchBar.searchLabel}
                    value={searchBar.searchText}
                    onChangeText={searchBar.setSearchText}
                    // submitBehavior="blurAndSubmit"
                    // mode="view"
                    className=" flex-1"
                    style={{flex: 1}}
                    theme={{colors: {primary: colors.sblue, elevation: {level3: colors.sgray + '20'}}}}
                />
                {showFilterOptions && 
                    <>
                        <TouchableOpacity 
                            className="border rounded-md bg-sgray/15 p-2 aspect-square items-center justify-center"
                            onPress={() => showFilterOptions ? showFilterOptions(true) : null}
                        >
                            <Ionicons name="filter" size={32} color={'black'}/>
                        </TouchableOpacity>                    
                    </>
                }
            </View>
        </View>
        
    )

}