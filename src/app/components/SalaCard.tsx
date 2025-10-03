import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native"
import { Card, Button, Text as TextP } from "react-native-paper"
import { Sala } from "../types/apiTypes";
import { formatarDataISO } from "../utils/functions";
import { colors } from "../../styles/colors";
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { apiURL } from "../api/axiosConfig";
import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";


interface propsSalaCard{
    sala: Sala;
    key: number;
    onPress: () => void,
    marcarSalaComoLimpa: (id:string) => void,
    marcarSalaComoSuja: (id:string) => void,
    editarSala: (sala: Sala) => void,
    excluirSala: (id: string) => void,
    userRole: 'user' | 'admin',
    userGroups: number[]

}

function SalaCard({sala, onPress, marcarSalaComoLimpa, editarSala, excluirSala, userGroups, userRole, marcarSalaComoSuja}: propsSalaCard){

    // const userGroups: number[] = []

    return (
        <TouchableOpacity className="mb-4 rounded-xl shadow-md" onPress={onPress}>
            <Card  style={styles.cardAtivo}>
                <Card.Content className=" flex-col gap-0 px-0 py-0">
                    <View className=" gap-1 flex-row ">
                        <View className=" aspect-square h-40">
                            {
                                sala.imagem ?
                                <Image
                                    className={
                                        (userGroups.length === 0 && userRole === 'user') ?
                                        " flex-1 rounded-l-xl"
                                        :
                                        " flex-1 rounded-tl-xl"
                                    }
                                    source={{uri: apiURL + sala.imagem}}
                                    resizeMode="cover"
                                />
                                :
                                <View className={
                                        (userGroups.length === 0 && userRole === 'user') ?
                                        "flex-1 bg-gray-200 rounded-l-xl items-center justify-center"
                                        :
                                        "flex-1 bg-gray-200 rounded-tl-xl items-center justify-center"
                                    }>
                                    <Ionicons size={30} name="image-outline" />
                                </View>
                            }
                        </View>
                        <View className=" flex-1 rounded-r-lg p-2 flex-col gap-1">
                            <Text className=" text-2xl" numberOfLines={1} ellipsizeMode="tail">{sala.nome_numero}</Text>
                            <View>
                                {
                                    sala.status_limpeza === 'Limpa'
                                    ? <Text className=" p-1 text-sm px-5 rounded-3xl bg-sgreen/20 text-sgreen mr-auto">{sala.status_limpeza}</Text>
                                    : sala.status_limpeza === 'Limpeza Pendente'
                                    ? <Text className=" p-1 text-sm px-5 rounded-3xl bg-syellow/20 text-syellow mr-auto">{sala.status_limpeza}</Text>
                                    : sala.status_limpeza === 'Suja' 
                                    ? <Text className=" p-1 text-sm px-5 rounded-3xl bg-sred/20 text-sred mr-auto">{sala.status_limpeza}</Text>
                                    : <Text className=" p-1 text-sm px-5 rounded-3xl bg-sgray/20 text-sgray mr-auto">{sala.status_limpeza}</Text>
                                    
                                }

                            </View>
                            <View className="flex-1 gap-2 flex-col pl-2 justify-center">
                                <View className=" flex-row items-center gap-1">
                                    <MaterialCommunityIcons size={20} name='account-group' color={colors.sgray}/>
                                    <Text className=" text-sm" numberOfLines={1} ellipsizeMode="tail">{sala.capacidade}</Text>
                                </View>
                                <View className=" flex-row items-center gap-1">
                                    <MaterialCommunityIcons size={20} name='map-marker' color={colors.sgray}/>
                                    <Text className=" text-sm" numberOfLines={1} ellipsizeMode="tail">{sala.localizacao}</Text>
                                </View>

                            </View>
                        </View>
                    </View>

                    {
                        (userRole === 'user' && userGroups.length === 0) ? null : 
                        <View className=" flex-row gap-2 p-2 border-t-2 border-gray-300">
                            <View className="flex-col flex-1 gap-2">
                                {sala.ativa ? 
                                <>
                                    {
                                        !userGroups.includes(1) ? null : 
                                        <TouchableOpacity
                                            className=" h-14 bg-sgreen/20 flex-row gap-1 rounded-full items-center justify-center"
                                            onPress={(e) => {
                                                e.stopPropagation()
                                            }}
                                            >
                                            <MaterialCommunityIcons size={24} name='broom' color={colors.sgreen}/>
                                            <Text className=" text-sgreen text-base">Iniciar limpeza</Text>
                                        </TouchableOpacity>
                                    }

                                    {
                                        !userGroups.includes(2) ? null : 
                                        <TouchableOpacity
                                            className=" h-14 bg-syellow/20 flex-row gap-1 rounded-full items-center justify-center"
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                marcarSalaComoSuja(sala.qr_code_id)
                                            }}
                                        >
                                            <MaterialCommunityIcons size={24} name='delete-variant' color={colors.syellow}/>
                                            <Text className=" text-syellow text-base">Reportar sujeira</Text>
                                        </TouchableOpacity>                            
                                    }
                                </>
                                :
                                <TouchableOpacity
                                    className=" h-14 bg-sgray/30 flex-row gap-1 rounded-full items-center justify-center"
                                    onPress={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <MaterialCommunityIcons size={24} name='information-outline' color={colors.sgray}/>
                                    <Text className=" text-sgray text-base">Sala inativa</Text>
                                </TouchableOpacity>
                                }
                            </View>
                            {
                                userRole === 'user' ? null : 
                                <View className={
                                    (userGroups.length < 2) ?
                                    "flex-row-reverse gap-2"
                                    :
                                    "flex-col gap-2"

                                }>
                                    <TouchableOpacity
                                        className=" h-14 px-6 bg-sblue/20 flex-row gap-1 rounded-full items-center justify-center"
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            editarSala(sala)
                                        }}
                                    >
                                        <MaterialCommunityIcons size={24} name='pen' color={colors.sblue}/>
                                    </TouchableOpacity>
                                    {
                                        !sala.ativa ? null :
                                        <TouchableOpacity
                                            className=" h-14 px-6 bg-sred/20 flex-row gap-1 rounded-full items-center justify-center"
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                excluirSala(sala.qr_code_id)
                                            }}
                                        >
                                            <MaterialCommunityIcons size={24} name='delete' color={colors.sred}/>
                                        </TouchableOpacity>
                                    }
                                </View>
                            }
                        </View>
                    }
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    cardAtivo: {
        backgroundColor: 'white'
    },

    cardInativo: {
        backgroundColor: 'white',
        opacity: 0.7
    }
})

// export default React.memo(SalaCard)
export default SalaCard