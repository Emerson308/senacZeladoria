import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native"
import { Card, Button, Text as TextP } from "react-native-paper"
import { Sala } from "../../types/apiTypes";
import { formatarDataISO } from "../../utils/dateFunctions";
import { colors } from "../../../styles/colors";
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { apiURL } from "../../api/axiosConfig";
import React, { useContext } from "react";
// import image from '../../../../assets'



interface SalaCardButtonProps{
    onPress?: () => void,
    visible: boolean,
    label?: string
    icon?: 'delete' | 'pencil' | 'delete-variant' | 'broom'
    adminButton? : boolean
    colors?: {
        tailwind: string,
        style: string
    }
}

const SalaCardButton = ({
    onPress,
    visible,
    label,
    icon,
    colors,
    adminButton
}: SalaCardButtonProps) => {

    if(!visible){
        return null
    }

    return (
        <View className={`h-12 rounded-lg overflow-hidden ${adminButton ? 'aspect-square' : 'flex-1'}`}>
            <TouchableOpacity
            
                className={`bg-${colors?.tailwind}/20 flex-1 flex-row gap-1 items-center justify-center`}
                activeOpacity={visible ? 0.2 : 1}
                onPress={(e) => {
                    e.stopPropagation();
                    if(visible){
                        onPress?.()
                    }
                }}
            >
                {!icon ? null :
                    <MaterialCommunityIcons size={24} name={icon} color={colors?.style}/>
                }
                {!label ? null : 
                    <Text className={` text-${colors?.tailwind} text-base`}>{label}</Text>
                }
            </TouchableOpacity>
        </View>
    )
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


function SalaCardButtons({ sala, iniciarLimpeza, marcarSalaComoSuja, editarSala, excluirSala, userRole, userGroups }: SalaCardButtonsProps){

    if(userGroups.length === 0 && userRole === 'user'){
        return null
    }

    if(!sala.ativa){
        return (
            <View  className=" flex-row gap-2 p-2 border-t-2 border-gray-300">
                <TouchableOpacity onPress={(e) => e.stopPropagation()} activeOpacity={1} className=" flex-1 bg-gray-200 rounded-lg flex-row gap-2 items-center justify-center h-12">
                    <Ionicons name="ban" size={24} color={colors.sgray} />
                    <Text className=" text-sgray italic">Sala inativa</Text>
                </TouchableOpacity>
                <SalaCardButton
                    visible={userRole !== 'user'}
                    icon='pencil'
                    colors={{style: colors.sblue, tailwind: 'sblue'}}
                    adminButton={true}
                    onPress={() => editarSala(sala)}
                />
            </View>
        )
    }

    const visibleIniciarLimpeza = 
        userGroups.includes(1) && 
        sala.ativa && 
        (sala.status_limpeza !== 'Em Limpeza' && sala.status_limpeza !== 'Limpa')
   
    const visibleMarcarSalaComoSuja = 
        userGroups.includes(2) && 
        sala.ativa && 
        (sala.status_limpeza !== "Suja" && sala.status_limpeza !== 'Em Limpeza')
    
    const visibleEditarSala = userRole !== 'user'
    const visibleExcluirSala = userRole !== 'user' && sala.ativa

    const salaEmLimpeza = sala.status_limpeza === 'Em Limpeza' && userRole === 'admin'

    const visibleGroupsButton = [visibleIniciarLimpeza, visibleMarcarSalaComoSuja]

    const adminConditionStyle = visibleGroupsButton.filter(item => item).length > 1
    const adminButtonsStyle = !false ? " flex-row-reverse gap-2" : " flex-col gap-2"

    const buttonsVisibles = [visibleEditarSala, visibleExcluirSala, visibleIniciarLimpeza, visibleMarcarSalaComoSuja]

    const visibleButtons = buttonsVisibles.some(item => item)

    // console.log(visibleButtons)
    // console.log(visibleEditarSala, visibleExcluirSala, visibleIniciarLimpeza, visibleMarcarSalaComoSuja)


    if(!visibleButtons){
        return null
    }

    return (
        <View className=" flex-row gap-2 p-2 border-t-2 border-gray-300">
            <View className="flex-row flex-1 gap-2">
                <SalaCardButton
                    visible={visibleIniciarLimpeza}
                    icon="broom"
                    label={!visibleMarcarSalaComoSuja ? 'Iniciar limpeza' : ''}
                    colors={{style: colors.sgreen, tailwind: 'sgreen'}}
                    onPress={() => iniciarLimpeza(sala.qr_code_id)}
                />
                <SalaCardButton
                    visible={visibleMarcarSalaComoSuja}
                    icon='delete-variant'
                    label={!visibleIniciarLimpeza ? 'Reportar sujeira' : ''}
                    colors={{style: colors.syellow, tailwind: 'syellow'}}
                    onPress={() => marcarSalaComoSuja(sala.qr_code_id)}
                />
            </View>
            <View className={adminButtonsStyle}>
                <SalaCardButton
                    visible={visibleEditarSala}
                    icon='pencil'
                    colors={{style: colors.sblue, tailwind: 'sblue'}}
                    adminButton={true}
                    onPress={() => editarSala(sala)}
                />
                <SalaCardButton
                    visible={visibleExcluirSala}
                    icon='delete'
                    colors={{style: colors.sred, tailwind: 'sred'}}
                    adminButton={true}
                    onPress={() => excluirSala(sala.qr_code_id)}
                />
            </View>
        </View>

    )
}

interface propsSalaCard{
    sala: Sala;
    onPress: () => void,
    iniciarLimpeza: (id:string) => void,
    marcarSalaComoSuja: (id:string) => void,
    editarSala: (sala: Sala) => void,
    excluirSala: (id: string) => void,
    userRole: 'user' | 'admin',
    userGroups: number[]

}


function SalaCard({sala, onPress, iniciarLimpeza, editarSala, excluirSala, userGroups, userRole, marcarSalaComoSuja}: propsSalaCard){

    // const userGroups: number[] = []
    const salaCardImage = require('../../../../assets/salaCardImage.jpg')
    const salaCardImage2 = require('../../../../assets/salaCardImage4.jpg')
    const salaImage = sala.imagem ? {uri: apiURL + sala.imagem} : salaCardImage2

    return (
        <TouchableOpacity className="mb-4 rounded-xl shadow-md" onPress={onPress}>
            <Card  style={styles.cardAtivo}>
                <Card.Content className=" flex-col gap-0 px-0 py-0">
                    <View className=" gap-1 flex-row ">
                        <View className=" aspect-square h-40">
                            <Image
                                className={`flex-1 aspect-square ${(userGroups.length === 0 && userRole === 'user') ? 'rounded-l-xl': 'rounded-tl-xl'} ${sala.imagem ? '' : ' bg-black opacity-90'}`}
                                source={salaImage}
                                resizeMode="cover"
                            />
                            {/* {sala.imagem ? null : <Text className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">Sem imagem</Text>} */}
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
                                    <Text className=" text-sm flex-1" numberOfLines={1} ellipsizeMode="tail">{sala.capacidade}</Text>
                                </View>
                                <View className=" flex-row items-center gap-1">
                                    <MaterialCommunityIcons size={20} name='map-marker' color={colors.sgray}/>
                                    <Text className=" text-sm flex-1" numberOfLines={1} ellipsizeMode="tail">{sala.localizacao}</Text>
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