import { RegistroSala } from "../types/apiTypes"
import { colors } from "../../styles/colors"
import {parseISO, format, addHours} from 'date-fns'
import { ptBR } from 'date-fns/locale';


type statusVelocidade = 'Rapida' | 'Media' | 'Lenta'


const statusVelocidadeSeconds = {
    rapida: {
        inicio: 0,
        fim: 1200
    },
    media: {
        inicio: 1201,
        fim: 2400
    },
    lenta: {
        inicio: 2401,
        // fim: 2**100000000000,
        fim: null
    }
}

const contadorStyle = {
    fastTime: {
        colorWind: 'text-sgreen',
        colorStyle: colors.sgreen 
    },
    mediumTime: {
        colorWind: 'text-syellow',
        colorStyle: colors.syellow
    },
    slowTime: {
        colorWind: 'text-sred',
        colorStyle: colors.sred
    }
}

export const getContadorStyle = (seconds: number): string => {
    if (statusVelocidadeCondicional(seconds, 'Rapida')) return contadorStyle.fastTime.colorStyle;
    if (statusVelocidadeCondicional(seconds, 'Media')) return contadorStyle.mediumTime.colorStyle;
    if (statusVelocidadeCondicional(seconds, 'Lenta')) return contadorStyle.slowTime.colorStyle;

    return 'black'
}

export const getContadorTailwind = (seconds: number): string => {
    if (statusVelocidadeCondicional(seconds, 'Rapida')) return contadorStyle.fastTime.colorWind;
    if (statusVelocidadeCondicional(seconds, 'Media')) return contadorStyle.mediumTime.colorWind;
    if (statusVelocidadeCondicional(seconds, 'Lenta')) return contadorStyle.slowTime.colorWind;

    return ''
}

const statusVelocidadeCondicional = (seconds: number, type: statusVelocidade) => {
    if(type === 'Rapida'){
        return (seconds <= statusVelocidadeSeconds.rapida.fim && seconds >= statusVelocidadeSeconds.rapida.inicio)
    }
    if(type === 'Media'){
        return (seconds <= statusVelocidadeSeconds.media.fim && seconds >= statusVelocidadeSeconds.media.inicio)
    }
    if(type === 'Lenta'){
        return (seconds >= statusVelocidadeSeconds.lenta.inicio)
    }

    return false
}

export const getLimpezaStatusVelocidade = (inicio: string, fim: string | null) => {
    if(!fim){
        return
    }
    const seconds = getSecondsUtcDiference(inicio, fim)

    if(statusVelocidadeCondicional(seconds, 'Rapida')) return 'Rapida'
    if(statusVelocidadeCondicional(seconds, 'Media')) return 'Media'
    if(statusVelocidadeCondicional(seconds, 'Lenta')) return 'Lenta'

}

export const listLimpezasConcluidasVelocidadeType = (registros: RegistroSala[], type: statusVelocidade) => {
    
    const registrosFiltrados = registros.filter(registro => {
        if(!registro.data_hora_fim){
            return false
        }

        const timeDiference = getSecondsUtcDiference(registro.data_hora_inicio, registro.data_hora_fim)

        return statusVelocidadeCondicional(timeDiference, type)
    })

    return registrosFiltrados
}

export const formatarDataISO = (utcDateTimeStr: string|null) => {
    if (!utcDateTimeStr){
        return 'N/A'
    }

    try{
        const dateObjectUTC = parseISO(utcDateTimeStr)

        const localAdjustedUTC = addHours(dateObjectUTC, 0)

        return format(localAdjustedUTC, "dd/MM/yyyy 'às' HH:mm")
    } catch(error){
        console.log("Erro ao processar data/hora")
        return "Data Inválida"
    }
}

export function getSecondsElapsed(startTimeUTC: string): number {
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

export function getSecondsUtcDiference(startTimeUTC: string, endTimeUTC: string): number {
    const startMs = new Date(startTimeUTC).getTime();

    const endMs = new Date(endTimeUTC).getTime();
        
    if (isNaN(startMs)) {
        console.error("String de data UTC de início inválida:", startTimeUTC);
        return 0; 
    }
    if (isNaN(endMs)) {
        console.error("String de data UTC de início inválida:", startTimeUTC);
        return 0; 
    }
    
    const differenceMs = endMs - startMs;
    
    if (differenceMs < 0) {
        return 0; 
    }
    
    return Math.floor(differenceMs / 1000);
}


export function formatSecondsToHHMMSS(totalSeconds: number): string {
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

export function utcToYYYYMMDD(utcDateTimeStr: string): string {
    const dateObjectUTC = parseISO(utcDateTimeStr);
    return format(dateObjectUTC, 'yyyy-MM-dd', { locale: ptBR });
}

export function dateToUTC(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Data inválida');
    }
    return date.toISOString();
}







