import api from "../api/axiosConfig";
import { Sala, ServiceResult } from "../types/apiTypes";
import { utcToYYYYMMDD } from "../utils/functions";

interface obterSalasParams{
    statusLimpeza?: 'Todas' | 'Limpa' | 'Limpeza Pendente' | 'Em Limpeza' | 'Suja',
    statusSala?: 'Todas' | 'Ativas' | 'Inativas',
    searchSalaText? : string,

}

export async function obterSalas({statusSala, searchSalaText}:obterSalasParams):Promise<ServiceResult<Sala[]>>{
    try {
        const params: Record<string, string> = {}
        if (statusSala !== undefined && statusSala !== 'Todas') params.ativa = String(statusSala === 'Ativas')
        if(searchSalaText !== undefined && searchSalaText !== '') params.nome_numero = searchSalaText

        // params.nome_numero = 'au'
        // params.localizacao = 'au'

        const queryString = new URLSearchParams(params).toString();
        const routeUrl = queryString ? `salas/?${queryString}` : 'salas/'

        // console.log('')
        // console.log('')
        // console.log('Debuging obter salas')
        // console.log(routeUrl)


        const resposta = await api.get<Sala[]>(routeUrl);
        // console.log(resposta.data)
        // console.log('Salas: ' + resposta.data.length)
        // console.log('Salas ativas: ' + resposta.data.filter((item) => item.ativa === true).length)
        // console.log('Salas inativas: ' + resposta.data.filter(item => item.ativa === false).length)
        return {success: true, data: resposta.data}

    } catch (erro: any){
        console.log(erro.data);
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
            console.log(erroData)
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

