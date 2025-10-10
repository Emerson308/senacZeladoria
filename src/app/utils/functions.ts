import {parseISO, format, addHours} from 'date-fns'
import { ptBR } from 'date-fns/locale';
import Toast from 'react-native-toast-message';


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

export const normalizarTexto = (texto: string) => {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '').toLowerCase()
}

interface showErrorToastProps{
    errMessage: string,
    errTitle?: string
}

export const showErrorToast = ({errMessage, errTitle} : showErrorToastProps) => {
    Toast.show({
        type: 'error',
        text1: errTitle ? errTitle : 'Erro',
        text2: errMessage,
        position: 'bottom',
        visibilityTime: 3000
    })
}

interface showSuccessToastProps{
    successMessage: string,
    successTitle?: string
}

export const showSuccessToast = ({successMessage, successTitle} : showSuccessToastProps) => {
    Toast.show({
        type: 'success',
        text1: successTitle ? successTitle : 'Sucesso',
        text2: successMessage,
        position: 'bottom',
        visibilityTime: 3000
    })
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



