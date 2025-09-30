import api from "../api/axiosConfig";
import { CredenciaisLogin, RespostaLoginAPI, ServiceResult, Usuario } from "../types/apiTypes";


export async function realizarLogin(credenciais: CredenciaisLogin):Promise<ServiceResult<RespostaLoginAPI>> {
    try{
        const resposta = await api.post<RespostaLoginAPI>('accounts/login/', {
            username: credenciais.username,
            password: credenciais.password
        })
        // console.log(resposta)
        return {success: true, data: resposta.data};
        
    } catch (erro: any) {
        console.log(erro)
        if(erro.response && erro.response.status === 400){
            // console.log('Erro 400')
            return {success: false, errMessage: 'Credenciais inválidas'};
        }

        return {success: false, errMessage: 'Erro ao conectar com o servidor'}
        
    }

}
