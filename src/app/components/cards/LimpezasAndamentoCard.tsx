import { View, Text } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { RegistroSala } from "../../types/apiTypes";
import {Ionicons} from '@expo/vector-icons'
import { formatarDataISO } from "../../utils/functions";
import { useEffect, useState } from "react";
import { getSecondsElapsed, formatSecondsToHHMMSS } from "../../utils/functions";
import { colors } from "../../../styles/colors";





type LimpezasAndamentoCardProps = {
    onPress?: () => void;
    type?: 'AdminData' | 'ZeladorData'
} & RegistroSala;

export default function LimpezasAndamentoCard({ id, sala, sala_nome, data_hora_inicio, funcionario_responsavel, fotos, onPress, type }: LimpezasAndamentoCardProps){


    const [contador, setContador] = useState(getSecondsElapsed(data_hora_inicio))

    const contadorFormatado = formatSecondsToHHMMSS(contador)

    useEffect(() => {
        const intervalId = setInterval(() => {
            // setContador(getSecondsElapsed(data_hora_inicio))
            setContador(prevContador => prevContador + 1)
        }, 1000)

        return () => clearInterval(intervalId)

    }, [])
    
    const contadorStyle = {
        fastTime: 'text-sgreen',
        mediumTime: 'text-syellow',
        slowTime: 'text-sred'
    }

    const getContadorColor = (seconds: number): string => {
        if(seconds < 1200){
            return colors.sgreen
        } else if (seconds < 2400){
            return colors.syellow
        } else {
            return colors.sred

        }
    }

    const getContadorStyle = (seconds: number): string => {
        if (seconds < 1200) {
            return contadorStyle.fastTime;
        } else if (seconds < 2400) {
            return contadorStyle.mediumTime;
        } else {
            return contadorStyle.slowTime;
        }
    }

    return (
        <TouchableRipple borderless={true} onPress={onPress} className=" rounded-xl shadow-md flex-row bg-white items-center gap-3 px-4 h-36">
            <View className=" flex-1 flex-col gap-2">
                <View className=" flex-row px-2 justify-between gap-3">
                    <Text className="text-xl font-bold flex-1" numberOfLines={1} ellipsizeMode="tail">{sala_nome}</Text>
                    <View className=" flex-row gap-2 items-center ">
                        <Ionicons name="timer-outline" size={18} color={getContadorColor(contador)}/>
                        <Text className={`text-lg font-bold ${getContadorStyle(contador)}`}>{contadorFormatado}</Text>
                    </View>
                </View>
                <View className=" flex-row justify-between gap-2">
                    <View className=" flex-col justify-center bg-gray-100 p-3 flex-1 rounded-xl gap-0.5">
                        <View className=" flex-row gap-2 items-center">
                            <Ionicons name="calendar-number-outline" size={16}/>
                            <Text className="text-sm">Início: {formatarDataISO(data_hora_inicio)}</Text>
                        </View>
                        { 
                            type !== 'AdminData' ? null : 
                            <View className=" flex-row gap-2 items-center">
                                <Ionicons name="person-outline" size={16}/>
                                <Text className="text-sm">Responsável: {funcionario_responsavel}</Text>
                            </View>

                        }
                        <View className=" flex-row gap-2 items-center">
                            <Ionicons name="image-outline" size={16}/>
                            <Text className="text-sm">Fotos: {fotos.length === 0 ? 'Sem fotos' : `${fotos.length} Anexadas`}</Text>
                        </View>
                    </View>
                    <View className=" h-full items-end justify-between py-4">
                        <Ionicons name="chevron-forward-outline" color={colors.sgray} size={40} />
                    </View>
                </View>

            </View>
        </TouchableRipple>
    )
}



