

import api from "../api/axiosConfig";
import { CredenciaisLogin, RespostaLoginAPI, UserData } from "../types/apiTypes";

export async function realizarLogin(credenciais: CredenciaisLogin):Promise<RespostaLoginAPI> {
    
    try{
        const resposta = await api.post<RespostaLoginAPI>('accounts/login/', {
            username: credenciais.username,
            password: credenciais.password
        })
        // console.log(resposta)
        return resposta.data;

    } catch (erro: any) {
        console.log(erro)
        if (erro.response && erro.response.status === 401){
            throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');
        }
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        
    }

}

export async function usuarioLogado():Promise<UserData| null>{
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