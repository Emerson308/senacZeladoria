import {parseISO, format, addHours} from 'date-fns'
import { ptBR } from 'date-fns/locale';


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



