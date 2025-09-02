import api from "../api/axiosConfig";
import { Usuario } from "../types/apiTypes";

export async function obterUsuarios():Promise<Usuario[]>{
    try{
        const resposta = await api.get<Usuario[]>('accounts/list_users/')
        // console.log(resposta.data)
        return resposta.data
    } catch(erro: any){
        console.log(erro);
        throw new Error(erro|| 'Erro ao buscar usuarios')
    }
}








