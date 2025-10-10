import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native"
import { Card, Button, Text as TextP } from "react-native-paper"
import { Sala } from "../../types/apiTypes";
import { formatarDataISO } from "../../utils/functions";
import { colors } from "../../../styles/colors";
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { apiURL } from "../../api/axiosConfig";
import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { int } from "zod";

interface propsSalaCard{
    sala: Sala;
    key: number;
    onPress: () => void,
    iniciarLimpeza: (id:string) => void,
    marcarSalaComoSuja: (id:string) => void,
    editarSala: (sala: Sala) => void,
    excluirSala: (id: string) => void,
    userRole: 'user' | 'admin',
    userGroups: number[]

}

interface SalaCardButtonsProps{
    sala: Sala;
    iniciarLimpeza: (id:string) => void,
    marcarSalaComoSuja: (id:string) => void,
    editarSala: (sala: Sala) => void,
    excluirSala: (id: string) => void,
    userRole: 'user' | 'admin',
    userGroups: number[]
}

interface IniciarLimpezaButtonProps {
    sala: Sala;
    iniciarLimpeza: (id: string) => void;
    visible: boolean;
}

interface MarcarSalaComoSujaButtonProps {
    sala: Sala;
    marcarSalaComoSuja: (id: string) => void;
    visible: boolean;
}

interface EditarSalaButtonProps {
    sala: Sala;
    editarSala: (sala: Sala) => void;
    visible: boolean;
}

interface ExcluirSalaButtonProps {
    sala: Sala;
    excluirSala: (id: string) => void;
    visible: boolean;
}



function IniciarLimpezaButton({ sala, iniciarLimpeza, visible }: IniciarLimpezaButtonProps) {
    if (!visible) return null;

    if(sala.status_limpeza === 'Em Limpeza' || sala.status_limpeza === 'Limpa'){

        const statusButtonClass = sala.status_limpeza === 'Em Limpeza' ? 'bg-sgray/20 text-sgray' : 'bg-sgreen/20 text-sgreen'
        const statusTextClass = sala.status_limpeza === 'Em Limpeza' ? 'text-sgray' : 'text-sgreen'
        const statusIconColor = sala.status_limpeza === 'Em Limpeza' ? colors.sgray : colors.sgreen

        return (
            <View className={` h-12 ${statusButtonClass} flex-row gap-2 rounded-full items-center justify-center`}>
                <MaterialCommunityIcons size={24} name={sala.status_limpeza === 'Em Limpeza' ? 'broom' : 'check'} color={statusIconColor}/>
                <Text className={statusTextClass}>Sala {sala.status_limpeza}</Text>
            </View>
        )
    }

    return (
        <TouchableOpacity
            className=" h-12 bg-sgreen/20 flex-row gap-1 rounded-full items-center justify-center"
            onPress={(e) => {
                e.stopPropagation()
                iniciarLimpeza(sala.qr_code_id)
            }}
        >
            <MaterialCommunityIcons size={24} name='broom' color={colors.sgreen}/>
            <Text className=" text-sgreen text-base">Iniciar limpeza</Text>
        </TouchableOpacity>
    )
}

function MarcarSalaComoSujaButton({ sala, marcarSalaComoSuja, visible }: MarcarSalaComoSujaButtonProps) {
    if (!visible) return null;

    if(sala.status_limpeza === 'Suja' || sala.status_limpeza === 'Em Limpeza'){

        const statusButtonClass = sala.status_limpeza === 'Em Limpeza' ? 'bg-sgray/20 text-sgray' : 'bg-sred/20 text-sred'
        const statusTextClass = sala.status_limpeza === 'Em Limpeza' ? 'text-sgray' : 'text-sred'
        const statusIconColor = sala.status_limpeza === 'Em Limpeza' ? colors.sgray : colors.sred

        return (
            <View className={` h-12 ${statusButtonClass} flex-row gap-2 rounded-full items-center justify-center`}>
                <MaterialCommunityIcons size={24} name={sala.status_limpeza === 'Em Limpeza' ? 'broom' : 'block-helper'} color={statusIconColor}/>
                <Text className={statusTextClass}>Sala {sala.status_limpeza}</Text>
            </View>
        )
    }

    return (
        <TouchableOpacity
            className=" h-12 bg-syellow/20 flex-row gap-1 rounded-full items-center justify-center"
            onPress={(e) => {
                e.stopPropagation();
                marcarSalaComoSuja(sala.qr_code_id);
            }}
        >
            <MaterialCommunityIcons size={24} name='delete-variant' color={colors.syellow}/>
            <Text className=" text-syellow text-base">Reportar sujeira</Text>
        </TouchableOpacity>
    )
}

function EditarSalaButton({ sala, editarSala, visible }: EditarSalaButtonProps) {
    if (!visible) return null;

    return (
        <TouchableOpacity
            className=" h-12 px-6 bg-sblue/20 flex-row gap-1 rounded-full items-center justify-center"
            onPress={(e) => {
                e.stopPropagation();
                editarSala(sala);
            }}
        >
            <MaterialCommunityIcons size={24} name='pencil' color={colors.sblue}/>
        </TouchableOpacity>
    )
}

function ExcluirSalaButton({ sala, excluirSala, visible }: ExcluirSalaButtonProps) {
    if (!visible) return null;
    return (
        <TouchableOpacity
            className=" h-12 px-6 bg-sred/20 flex-row gap-1 rounded-full items-center justify-center"
            onPress={(e) => {
                e.stopPropagation();
                excluirSala(sala.qr_code_id);
            }}
        >
            <MaterialCommunityIcons size={24} name='delete' color={colors.sred}/>
        </TouchableOpacity>
    )
}

function EmLimpezaButton(){
    return (
        <View className=" h-12 bg-sgray/20 flex-row gap-2 rounded-full items-center justify-center">
            <MaterialCommunityIcons size={24} name='broom' color={colors.sgray}/>
            <Text className=" text-sgray">Sala em limpeza</Text>
        </View>
    )
}

function SalaCardButtons({ sala, iniciarLimpeza, marcarSalaComoSuja, editarSala, excluirSala, userRole, userGroups }: SalaCardButtonsProps){

    if(userGroups.length === 0 && userRole === 'user'){
        return null
    }

    if(!sala.ativa){
        return (
            <View className=" flex-row gap-2 p-2 border-t-2 border-gray-300">
                <View className=" flex-1 bg-gray-200 rounded-full flex-row gap-2 items-center justify-center h-12">
                    <Ionicons name="ban" size={24} color={colors.sgray} />
                    <Text className=" text-sgray italic">Sala inativa</Text>
                </View>
                <EditarSalaButton sala={sala} editarSala={editarSala} visible={userRole !== 'user'}/>
            </View>
        )
    }

    const visibleIniciarLimpeza = userGroups.includes(1) && sala.ativa
    const visibleMarcarSalaComoSuja = userGroups.includes(2) && sala.ativa
    const visibleEditarSala = userRole !== 'user'
    const visibleExcluirSala = userRole !== 'user' && sala.ativa

    const salaEmLimpeza = sala.status_limpeza === 'Em Limpeza'

    const adminConditionStyle = (!!visibleIniciarLimpeza !== !!visibleMarcarSalaComoSuja) || salaEmLimpeza
    const adminButtonsStyle = adminConditionStyle ? " flex-row-reverse gap-2" : " flex-col gap-2"

    return (
        <View className=" flex-row gap-2 p-2 border-t-2 border-gray-300">
            <View className="flex-col flex-1 gap-2">
                {salaEmLimpeza ? <EmLimpezaButton /> :
                    <>
                    <IniciarLimpezaButton sala={sala} iniciarLimpeza={iniciarLimpeza} visible={visibleIniciarLimpeza}/>
                    <MarcarSalaComoSujaButton sala={sala} marcarSalaComoSuja={marcarSalaComoSuja} visible={visibleMarcarSalaComoSuja}/>

                    </>
                }
            </View>
            <View className={adminButtonsStyle}>
                <EditarSalaButton sala={sala} editarSala={editarSala} visible={visibleEditarSala}/>
                <ExcluirSalaButton sala={sala} excluirSala={excluirSala} visible={visibleExcluirSala}/>
            </View>
        </View>

    )
}



function SalaCard({sala, onPress, iniciarLimpeza, editarSala, excluirSala, userGroups, userRole, marcarSalaComoSuja}: propsSalaCard){

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
                    <SalaCardButtons sala={sala} iniciarLimpeza={iniciarLimpeza} marcarSalaComoSuja={marcarSalaComoSuja} editarSala={editarSala} excluirSala={excluirSala} userRole={userRole} userGroups={userGroups}/>
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

export default React.memo(SalaCard)
// export default SalaCard