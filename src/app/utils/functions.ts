import {parseISO, format, addHours} from 'date-fns'
import { ptBR } from 'date-fns/locale';
import Toast from 'react-native-toast-message';


export const formatarDataISO = (utcDateTimeStr: string|null) => {
    if (!utcDateTimeStr){
        return 'N/A'
    }

    try{
        const dateObjectUTC = parseISO(utcDateTimeStr)

        const localAdjustedUTC = addHours(dateObjectUTC, -3)

        return format(localAdjustedUTC, "dd/MM/yyyy 'às' HH:mm")
    } catch(error){
        console.error("Erro ao processar data/hora")
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

