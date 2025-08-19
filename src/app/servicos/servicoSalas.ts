
import api from "../api/axiosConfig";
import { Sala } from "../types/apiTypes";

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
        return resposta.data
    } catch (erro: any){
        console.log(erro);
        throw new Error(erro|| 'Erro ao buscar salas')
    }
}