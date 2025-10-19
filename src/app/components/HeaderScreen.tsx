import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usuarioLogado } from "../servicos/servicoUsuarios";
import { RegistroSala, Usuario } from "../types/apiTypes";
import { Alert, Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, Avatar, Searchbar, TouchableRipple } from "react-native-paper";
import { AuthContext } from "../AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import {Ionicons} from "@expo/vector-icons"






type HeaderScreenProps = {
    searchBar: {
        searchText: string,
        setSearchText: (texto: string) => void
        searchLabel: string,
        searchResults?: {
            activeFilters: boolean,
            filtersResult: number
        }
    },
    notifications?: {
        notificationsCount?: number,
        notificationsNavigate: () => void
    }
    qrCodeNavigate?: () => void
    headerText: string,
    headerNavButtons?: boolean,
    onlyGoBackHeader?: boolean
    showFilterOptions?: (visibility: boolean) => void,
    userGroups?: number[]
}

export default function HeaderScreen({
    searchBar, 
    headerNavButtons=false, 
    headerText, 
    userGroups, 
    showFilterOptions,
    qrCodeNavigate,
    notifications
}: HeaderScreenProps){

    const navigation = useNavigation()

    return(
        <View className="bg-white py-2 border-b-2 border-gray-200 gap-2 px-5" >
            <View className=" flex-row h-20 gap-4 items-center">
                <Text className=" text-2xl flex-1">{headerText}</Text>
                {(headerNavButtons && userGroups) && 
                    <>
                        <TouchableRipple onPress={() => qrCodeNavigate?.()} 
                            borderless={true} 
                            className=" rounded-full p-3 aspect-square"

                        >
                            <Ionicons name="qr-code-outline" size={32}/>                   
                        </TouchableRipple>
                        {userGroups.includes(1) &&
                            <TouchableRipple onPress={() => navigation.navigate('Notifications')}
                                borderless={true}
                                className=" rounded-full p-3 aspect-square"
                            >
                                <Ionicons name="notifications-outline" size={32}/>
                            </TouchableRipple>                    
                        }
                    </>
                }

            </View>

            <View className="">
                <View className=" flex-row h-20 gap-4 items-center">
                    <View className="flex-1 flex-col">
                        <Searchbar
                            placeholder={searchBar.searchLabel}
                            value={searchBar.searchText}
                            onChangeText={searchBar.setSearchText}
                            placeholderTextColor={colors.sgray}
                            iconColor={colors.sgray}
                            // submitBehavior="blurAndSubmit"
                            // mode="view"
                            className=" "
                            style={{}}
                            theme={{colors: {primary: colors.sblue, elevation: {level3: colors.sgray + '20'}}}}
                        />
                    </View>
                
                    {showFilterOptions && 
                        <>
                            <TouchableOpacity 
                                className="border rounded-md bg-sgray/15 p-3 aspect-square items-center justify-center"
                                onPress={() => showFilterOptions ? showFilterOptions(true) : null}
                                >
                                <Ionicons name="filter" size={32} color={'black'}/>
                            </TouchableOpacity>                    
                        </>
                    }
                </View>
                {!searchBar.searchResults?.activeFilters ? null : 
                    <Text className=" text-base text-sgray ml-2">{searchBar.searchResults.filtersResult} resultados.</Text>
                }
            </View>
        </View>
        
    )

}