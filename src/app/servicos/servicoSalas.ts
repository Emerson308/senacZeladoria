import { fa } from "zod/v4/locales";
import api from "../api/axiosConfig";
import { newSala, RegistroSala, Sala, ServiceResult } from "../types/apiTypes";

export async function obterSalas():Promise<ServiceResult<Sala[]>>{
    try {
        const resposta = await api.get<Sala[]>('salas/');
        return {success: true, data: resposta.data}

    } catch (erro: any){
        console.log(erro);
        // throw new Error(erro|| 'Erro ao buscar salas')
        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação não foram fornecidas'}
        }
        return {success: false, errMessage: 'Erro ao buscar salas'}
    }
}

export async function obterDetalhesSala(id: string):Promise<ServiceResult<Sala>>{
    try{
        const resposta = await api.get<Sala>(`salas/${id}/`)
        // console.log(resposta.data)
        return {success: true, data: resposta.data}
    } catch (erro: any){
        console.log(erro);
        if(erro.response && erro.response.status === 404){
            return {success: false, errMessage: 'Erro na requisição para o servidor'}
        }
        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação não foram fornecidas'}
        }

        return {success: false, errMessage: 'Erro ao buscar detalhes da sala'}
    }
}

export async function marcarSalaComoLimpaService(id: string, observacoes?: string){
    try{
        const resposta = await api.post(`salas/${id}/marcar_como_limpa/`, {observacoes})
        // console.log(resposta.data)
        // return
    } catch(erro : any){
        console.log(erro);
        throw new Error(erro|| 'Erro ao marcar sala')
        
    }
}

export async function criarNovaSala(newSala: FormData): Promise<ServiceResult<Sala>>{
    try{
        const resposta = await api.post<Sala>('salas/', newSala, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        })
        return {success: true, data: resposta.data}
    } catch(erro : any){
        console.log(erro);
        if(erro.response.status === 400){
            const erroData = erro.response.data
            if(erroData.nome_numero){
                return {success: false, errMessage: erroData.nome_numero[0]}
            }
            if(erroData.capacidade){
                return {success: false, errMessage: erroData.capacidade[0]}
            }
            if(erroData.localizacao){
                return {success: false, errMessage: erroData.localizacao[0]}
            }
            if(erroData.validade_limpeza_horas){
                return {success: false, errMessage: erroData.validade_limpeza_horas[0]}
            }
        }
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }



        return {success: false, errMessage: 'Erro ao criar nova sala'}
    }


}

export async function editarSalaService(newSala: FormData, id: string): Promise<ServiceResult<Sala>>{
    try{
        const resposta = await api.put<Sala>(`salas/${id}/`, newSala, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        })
        // console.log(resposta.data)
        return {success: true, data: resposta.data}
    } catch(erro : any){
        if(erro.response.status === 400){
            const erroData = erro.response.data
            if(erroData.nome_numero){
                return {success: false, errMessage: erroData.nome_numero[0]}
            }
            if(erroData.capacidade){
                return {success: false, errMessage: erroData.capacidade[0]}
            }
            if(erroData.localizacao){
                return {success: false, errMessage: erroData.localizacao[0]}
            }
            if(erroData.validade_limpeza_horas){
                return {success: false, errMessage: erroData.validade_limpeza_horas[0]}
            }
        }
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }



        return {success: false, errMessage: 'Erro ao editar a sala'}
        
    }

}

export async function excluirSalaService(id: string): Promise<ServiceResult<null>>{
    try{
        const resposta = await api.delete(`salas/${id}/`)
        // console.log(resposta.data)
        return {success: true, data: null}
    } catch(erro : any){
        console.log(erro.status);
        // throw new Error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }

        return {success: false, errMessage: 'Erro ao excluir a sala'}        
    }

}

export async function getRegistrosService(id?: number): Promise<ServiceResult<RegistroSala[]>>{
    try{
        const resposta = await api.get<RegistroSala[]>('limpezas/')
        // console.log(resposta.data)
        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.error(erro)
        if(erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação enviadas não possuem autorização para essa ação'}
        }

        return {success: false, errMessage: 'Erro ao buscar os registros com o servidor'}
    }
}

export async function marcarSalaComoSujaService(id: string): Promise<ServiceResult<null>>{
    try{
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