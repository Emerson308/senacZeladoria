import api from "../api/axiosConfig";
import { NovoUsuario, Usuario, UserData } from "../types/apiTypes";

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

export async function usuarioLogado():Promise<UserData>{
    try {
        const resposta = await api.get<UserData>('accounts/current_user/');
        return resposta.data
    } catch(erro: any){
        console.log(erro)
        if (erro.response && erro.response.status === 401){
            throw new Error('Token inválido.');
        }
        // return null
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.')

    }
}








