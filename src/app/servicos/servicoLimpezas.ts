import api from "../api/axiosConfig";
import { newSala, RegistroSala, Sala, ServiceResult, Notification, imageRegistro } from "../types/apiTypes";
import { utcToYYYYMMDD } from "../utils/functions";


interface getRegistrosServiceParams{
    id? : number,
    username?: string,
    sala_uuid?: string,
    data_inicio?: string,
    data_fim?: string | null
}
export async function getRegistrosService({id, username, sala_uuid, data_inicio, data_fim}: getRegistrosServiceParams): Promise<ServiceResult<RegistroSala[]>>{
    try{
        const params: Record<string, string> = {};
        if (id !== undefined) params.id = id.toString();
        if (username) params.funcionario_username = username;
        if (sala_uuid) params.sala_uuid = sala_uuid;

        const queryString = new URLSearchParams(params).toString();
        const routeUrl = queryString ? `limpezas/?${queryString}` : 'limpezas/';
        // console.log(queryString)

        const resposta = await api.get<RegistroSala[]>(routeUrl);
        // console.log(resposta.data)
        return { success: true, data: resposta.data };
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }

        return {success: false, errMessage: 'Erro ao buscar os registros com o servidor'}
    }
}

export async function iniciarLimpezaSala(id: string): Promise<ServiceResult<RegistroSala>>{
    try{
        const resposta = await api.post(`salas/${id}/iniciar_limpeza/`)
        console.log(resposta.data)

        return {success: true, data: resposta.data}

    } catch(erro: any){
        console.log(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }
        
        return {success: false, errMessage: 'Erro ao marcar sala como suja'}
        
    }
}

export async function marcarSalaComoSujaService(id: string, observacoes?: string): Promise<ServiceResult<null>>{
    try{
        // console.log('Observações:', observacoes)
        const observacoesJson = {
            observacoes: observacoes ? observacoes : ''
        }

        console.log(observacoesJson)

        const resposta = await api.post(`salas/${id}/marcar_como_suja/`)
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

export async function concluirLimpezaService(id: string, observacoes?: string): Promise<ServiceResult<RegistroSala>>{
    try{
        if(!observacoes){
            observacoes = ''
        }
        const formData = new FormData()
        formData.append('observacoes', observacoes)

        const resposta = await api.post(`salas/${id}/concluir_limpeza/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }

        return {success: false, errMessage: 'Erro ao concluir limpeza da sala'}
    }
}

export async function adicionarFotoLimpezaService(formData: FormData): Promise<ServiceResult<null>>{
    try{
        const resposta = await api.post(`fotos_limpeza/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return {success: true, data: null}
    } catch(erro: any){
        console.error(erro.response.data)
        console.error(erro.message)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }
        return {success: false, errMessage: 'Erro ao enviar fotos da limpeza'}
    }
}

export async function deletarFotoLimpezaService(fotoId: number): Promise<ServiceResult<null>>{
    try{
        const resposta = await api.delete(`fotos_limpeza/${fotoId}/`)
        return {success: true, data: null}
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }
        return {success: false, errMessage: 'Erro ao deletar foto da limpeza'}
    }
}

export async function listarFotosLimpezaService(): Promise<ServiceResult<imageRegistro[]>>{
    try{
        const resposta = await api.get<imageRegistro[]>(`fotos_limpeza/`)
        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }
        return {success: false, errMessage: 'Erro ao listar fotos da limpeza'}
    }
}