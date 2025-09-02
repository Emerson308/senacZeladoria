
import api from "../api/axiosConfig";
import { newSala, Sala } from "../types/apiTypes";

export async function obterSalas():Promise<Sala[]>{
    try {
        const resposta = await api.get<Sala[]>('salas/');
        return resposta.data

    } catch (erro: any){
        console.log(erro);
        throw new Error(erro|| 'Erro ao buscar salas')
    }
}

export async function obterDetalhesSala(id: number):Promise<Sala>{
    try{
        const resposta = await api.get<Sala>(`salas/${id}/`)
        // console.log(resposta.data)
        return resposta.data
    } catch (erro: any){
        console.log(erro);
        throw new Error(erro|| 'Erro ao buscar salas')
    }
}

export async function marcarSalaComoLimpaService(id: number, observacoes?: string){
    // console.log('teste')
    try{
        const resposta = await api.post(`salas/${id}/marcar_como_limpa/`, {observacoes})
        // console.log(resposta.data)
        // return
    } catch(erro : any){
        console.log(erro);
        throw new Error(erro|| 'Erro ao marcar sala')
        
    }
}

export async function criarNovaSala(newSala: newSala){
    // console.log(newSala)
    try{
        const resposta = await api.post('salas/', newSala)
        // console.log(resposta.data)
        // return
    } catch(erro : any){
        console.log(erro.status);
        throw new Error(erro)
        
    }
}

export async function editarSalaService(newSala: newSala, id: number){
    try{
        const resposta = await api.put(`salas/${id}/`, newSala)
        // console.log(resposta.data)
        // return
    } catch(erro : any){
        console.log(erro.status);
        throw new Error(erro)
        
    }

}

export async function excluirSalaService(id: number){
    try{
        const resposta = await api.delete(`salas/${id}/`)
        // console.log(resposta.data)
        // return
    } catch(erro : any){
        console.log(erro.status);
        throw new Error(erro)
        
    }

}