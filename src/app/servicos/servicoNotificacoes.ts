import api from "../api/axiosConfig";
import { newSala, RegistroSala, Sala, ServiceResult, Notification, imageRegistro } from "../types/apiTypes";
import { utcToYYYYMMDD } from "../utils/functions";



export async function listarNotificacoes() : Promise<ServiceResult<Notification[]>>{
    try{
        const resposta = await api.get(`notificacoes/`)
        // console.log(resposta.data)
        // console.log(resposta.data)
        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }
        
        return {success: false, errMessage: 'Erro ao marcar sala como suja'}
    }
}

export async function lerNotificacao(id: number): Promise<ServiceResult<null>>{
    try{
        const resposta = await api.post(`notificacoes/${id}/marcar_como_lida/`)
        // console.log(resposta.data)
        return {success: true, data: null}
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }
        
        return {success: false, errMessage: 'Erro ao marcar sala como suja'}
    }
    
}

export async function lerTodasAsNotificacoes(): Promise<ServiceResult<null>>{
    try{
        const resposta = await api.post(`notificacoes/marcar_todas_como_lidas/`)

        return {success: true, data: null}
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }
        
        return {success: false, errMessage: 'Erro ao marcar sala como suja'}
    }
    
}