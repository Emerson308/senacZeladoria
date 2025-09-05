import api from "../api/axiosConfig";
import { NovoUsuario, Usuario } from "../types/apiTypes";

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

export async function criarUsuarioService(novoUsuario: NovoUsuario){
    try{
        const resposta = await api.post('accounts/create_user/', novoUsuario)
        return resposta.data
    } catch(erro: any){
        console.error(erro);
        // console.error(erro.message);

        throw new Error(erro|| 'Erro ao buscar usuarios')
    }
}








