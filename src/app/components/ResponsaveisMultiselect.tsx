import React, {useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text, ImageSourcePropType, Alert, FlatList, ListRenderItemInfo, Image } from "react-native";
import { Modal, Portal, List, Searchbar } from "react-native-paper";
import { colors } from "../../styles/colors";

import { Ionicons } from '@expo/vector-icons'
import { Usuario } from "../types/apiTypes";
import { apiURL } from "../api/axiosConfig";


interface ResponsaveisMultiselectProps{
        visible: boolean,
        hideModal: () => void,
        zeladores: Usuario[],
        selectedResponsaveisProps: string[],
        setSelectedResponsaveisProps: (usernameList: string[]) => void
        refreshZeladores: () => void
    
}

export default function ResponsaveisMultiselect({visible, hideModal, zeladores, selectedResponsaveisProps, setSelectedResponsaveisProps,  refreshZeladores}: ResponsaveisMultiselectProps){

    
    const [responsaveisInputText, setResponsaveisInputText] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [selectedResponsaveis, setSelectedResponsaveis] = useState<string[]>([...selectedResponsaveisProps])
    
    const zeladoresFiltrados = zeladores.filter(zelador => {
        if(!responsaveisInputText){
            return true
        }
        return zelador.username.toLowerCase().includes(responsaveisInputText.toLowerCase())
    })

    const contadorZeladores = zeladoresFiltrados.length

    const toggleUserSelection = (user: string) => {
        // const isSelected = selectedResponsaveis.some(u => u === user);
        if(selectedResponsaveis.includes(user)){
            setSelectedResponsaveisProps(selectedResponsaveis.filter(u => u !== user));
            setSelectedResponsaveis(selectedResponsaveis.filter(u => u !== user));
        } else{
            setSelectedResponsaveisProps([...selectedResponsaveis, user]);
            setSelectedResponsaveis([...selectedResponsaveis, user]);
        }
    };

    const renderZelador = ({item}: ListRenderItemInfo<Usuario>) => {
        // const isSelected = selectedResponsaveis.some(u => u === item.username);
        const isSelected = selectedResponsaveis.includes(item.username);
        return (
            <TouchableOpacity
                onPress={() => toggleUserSelection(item.username)}
                className=" h-20 flex-row items-center p-2 gap-2 rounded-md justify-between pr-4 bg-white shadow-sm"
            >
                <View className=" flex-row items-center gap-3">
                    <View className=" border h-full aspect-square rounded-md">
                        {item.profile.profile_picture ?
                        <Image source={{uri: apiURL + item.profile.profile_picture}} className=" flex-1"/>
                        :
                        <View className="flex-1 bg-black/20 justify-center items-center">
                            <Ionicons name="image-outline" size={24} color={'white'}/>
                        </View>
                        }
                    </View>
                    <Text className=" text-xl" numberOfLines={1} ellipsizeMode="tail">{item.username}</Text>
                </View>
                <View className=" border-2 p-1 rounded-lg aspect-square justify-center items-center">
                    {isSelected ? 
                        <Ionicons name="checkmark" size={22}/>
                        :
                        <Ionicons name="checkmark" size={22} className=" opacity-0"/>
                    }
                </View>

            </TouchableOpacity>
        )
        
    }

    return (
        <Portal>
        <Modal
            visible={visible}
            onDismiss={() => {
                setSelectedResponsaveis([...selectedResponsaveisProps])
                hideModal()
            }}
            contentContainerStyle={{
                marginHorizontal: 16,
                borderRadius: 15,
                backgroundColor: 'white'
            }}
            >
            <View style={{
                flexDirection: 'row',
                paddingTop: 16,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 16,
                paddingHorizontal: 16
            }}
            >
                <Text className=" text-black text-xl">Zeladores</Text>
                
            </View>
            <View className=" flex-col px-4 gap-2 pb-4">
                <View className=" gap-1">
                    <Searchbar
                        placeholder={'Pesquisar zelador'}
                        value={responsaveisInputText}
                        onChangeText={setResponsaveisInputText}
                        placeholderTextColor={colors.sgray}
                        iconColor={colors.sgray}
                        // submitBehavior="blurAndSubmit"
                        // mode="view"
                        className=" "
                        // style={{flex: 1}}
                        theme={{colors: {primary: colors.sblue, elevation: {level3: colors.sgray + '20'}}}}
                    />            
                    <Text className=" ml-1 text-gray-400">{contadorZeladores > 0 ? contadorZeladores + ' resultados.' : 'Nenhum resultado.'}</Text>
                </View>

                <FlatList
                    data={zeladoresFiltrados}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderZelador}
                    className=" max-h-96 h-96"
                    contentContainerClassName=" gap-2"
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true)
                        refreshZeladores()
                        setRefreshing(false)
                    }}


                />

                <View className=" flex-row gap-2">
                    {/* <TouchableOpacity
                        className=" flex-1 h-14 border-2 items-center justify-center rounded-full"
                        onPress={() => {
                            setSelectedResponsaveis([...selectedResponsaveisProps])
                            hideModal()
                        }}
                    >
                        <Text className=" text-base">Cancelar</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        className=" flex-1 h-14 items-center justify-center rounded-full bg-sblue"
                        onPress={() => {
                            // setSelectedResponsaveisProps([...selectedResponsaveis])
                            hideModal()
                        }}
                    >
                        <Text className=" text-base text-white">Selecionar</Text>
                    </TouchableOpacity>
                </View>


                

                {/* <List.Item
                    style={{paddingHorizontal: 15}}
                    titleStyle={{color: 'black'}}
                    title='Câmera'
                    left={()=> <Ionicons size={24} color={'black'} name="camera" />}
                    onPress={async () => null}
                    />

                <List.Item
                    style={{paddingHorizontal: 15}}
                    titleStyle={{color: 'black'}}
                    title='Galeria'
                    left={()=> <Ionicons size={24} color={'black'} name='images-outline' />}
                    onPress={async () => null}
                /> */}
            </View>

        </Modal>
    </Portal>

    )
}








