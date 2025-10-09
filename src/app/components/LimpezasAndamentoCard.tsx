import { View, Text } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { RegistroSala } from "../types/apiTypes";
import {Ionicons} from '@expo/vector-icons'
import { formatarDataISO } from "../utils/functions";
import { useEffect, useState } from "react";







function getSecondsElapsed(startTimeUTC: string): number {
    const startMs = new Date(startTimeUTC).getTime();
    
    const nowMs = Date.now();
    
    if (isNaN(startMs)) {
        console.error("String de data UTC de início inválida:", startTimeUTC);
        return 0; 
    }
    
    const differenceMs = nowMs - startMs;
    
    if (differenceMs < 0) {
        return 0; 
    }
    
    return Math.floor(differenceMs / 1000);
}

interface LimpezasAndamentoCardProps{
    // limpezaAndamento: RegistroSala
}

export default function LimpezasAndamentoCard({ id, sala, sala_nome, data_hora_inicio }: RegistroSala){



    const [contador, setContador] = useState(getSecondsElapsed(data_hora_inicio))


    function formatSecondsToHHMMSS(totalSeconds: number): string {
        if (typeof totalSeconds !== 'number' || totalSeconds < 0) {
            return "00:00:00";
        }
    
        const seconds = Math.floor(totalSeconds);
    
        const hours = Math.floor(seconds / 3600);
    
        const minutes = Math.floor((seconds % 3600) / 60);
    
        const remainingSeconds = seconds % 60;
    
        const pad = (num: number): string => String(num).padStart(2, '0');
    
        return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }

    const contadorFormatado = formatSecondsToHHMMSS(contador)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setContador(prevContador => prevContador + 1)
        }, 1000)

        return () => clearInterval(intervalId)

    }, [])


    
    

    return (
        <TouchableRipple borderless={true} className=" rounded-xl shadow-md flex-row bg-white items-center gap-3 px-4 h-24">
            <View className=" flex-1 flex-row gap-3 items-center">
                <Ionicons name="timer-outline" size={36}/>
                <View className=" flex-col h-full flex-1">
                    <Text className="text-xl">{sala_nome}</Text>
                    <Text className="text-base">Início: {formatarDataISO(data_hora_inicio)}</Text>
                </View>
                <View>
                    <Text className=" text-lg">{contadorFormatado}</Text>
                </View>

            </View>
        </TouchableRipple>
    )
}



