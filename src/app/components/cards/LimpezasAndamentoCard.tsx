import { View, Text } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { RegistroSala } from "../../types/apiTypes";
import {Ionicons} from '@expo/vector-icons'
import { formatarDataISO } from "../../utils/functions";
import { useEffect, useState } from "react";
import { getSecondsElapsed, formatSecondsToHHMMSS } from "../../utils/functions";





type LimpezasAndamentoCardProps = {
    onPress?: () => void;
} & RegistroSala;

export default function LimpezasAndamentoCard({ id, sala, sala_nome, data_hora_inicio, onPress }: LimpezasAndamentoCardProps){


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
        <TouchableRipple borderless={true} onPress={onPress} className=" rounded-xl shadow-md flex-row bg-white items-center gap-3 px-4 h-24">
            <View className=" flex-1 flex-row gap-3 items-center">
                <Ionicons name="timer-outline" size={36}/>
                <View className=" flex-col h-full flex-1">
                    <Text className="text-xl">{sala_nome}</Text>
                    <Text className="text-base">Início: {formatarDataISO(data_hora_inicio)}</Text>
                </View>
                <View>
                    <Text className={`text-lg ${getContadorStyle(contador)}`}>{contadorFormatado}</Text>
                </View>

            </View>
        </TouchableRipple>
    )
}



