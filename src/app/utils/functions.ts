import {parseISO, format, addHours} from 'date-fns'
import { ptBR } from 'date-fns/locale';
import Toast from 'react-native-toast-message';



export const normalizarTexto = (texto: string) => {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '').toLowerCase()
}

interface showErrorToastProps{
    errMessage: string,
    errTitle?: string,
    position? : 'top' | 'bottom'
}

export const showErrorToast = ({errMessage, errTitle, position} : showErrorToastProps) => {
    Toast.show({
        type: 'error',
        text1: errTitle ? errTitle : 'Erro',
        text2: errMessage,
        position: position ? position : 'bottom',
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


