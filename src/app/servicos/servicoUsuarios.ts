import { ImageSourcePropType } from "react-native";
import api from "../api/axiosConfig";
import { NovoUsuario, ServiceResult, UserChangePassword, UserGroup, Usuario } from "../types/apiTypes";

export async function obterUsuarios(group?: string):Promise<ServiceResult<Usuario[]>>{
    try{
        let routeString = 'accounts/list_users/'
        if (group){
            routeString = routeString + '?group='+ group
        }
        const resposta = await api.get<Usuario[]>(routeString)
        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.error(erro);
        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação não foram fornecidas'}
        }

        return {success: false, errMessage: 'Erro ao obter usuários'}
    }
}

export async function criarUsuarioService(novoUsuario: NovoUsuario): Promise<ServiceResult<Usuario>>{
    try{
        const resposta = await api.post<Usuario>('accounts/create_user/', novoUsuario)
        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.error(erro);

        if(erro.response.status === 400){
            const erroData = erro.response.data
            if(erroData.username){
                return {success: false, errMessage: erroData.capacidade[0]}
            }
            if(erroData.password){
                return {success: false, errMessage: erroData.password[0]}
            }
            if(erroData.confirm_password){
                return {success: false, errMessage: erroData.confirm_password[0]}
            }
            if(erroData.email){
                return {success: false, errMessage: erroData.email[0]}
            }
            if(erroData.nome){
                return {success: false, errMessage: erroData.nome[0]}
            }
            if(erroData.groups){
                return {success: false, errMessage: erroData.groups[0]}
            }
            if(erroData.is_superuser){
                return {success: false, errMessage: erroData.is_superuser[0]}
            }
        }
        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação não foram fornecidas'}
        }

        return {success: false, errMessage: 'Erro ao criar novo usuário'}
    }
}

export async function usuarioLogado():Promise<ServiceResult<Usuario>>{
    try {
        const resposta = await api.get<Usuario>('accounts/current_user/');
        // console.log(resposta.data)
        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.log(erro)
        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação não foram fornecidas'}
        }

        return {success: false, errMessage: 'Erro ao carregar dados do usuário'}

    }
}

export async function alterarSenha(passwords: UserChangePassword): Promise<ServiceResult<null>>{
    try {
        const resposta = await api.post('accounts/change_password/', passwords);
        return {success: true, data: null}
    } catch(erro: any){
        // console.error(erro)
        if(erro.response.status === 400){
            const erroData = erro.response.data
            if(erroData.new_password){
                return {success: false, errMessage: erroData.new_password[0]}
            }
            if(erroData.old_password){
                return {success: false, errMessage: erroData.old_password[0]}
            }
        }

        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais fornecidas são invalidas'}
        }

        return {success: false, errMessage: 'Erro ao alterar senha.'}
        
    }
}

export async function getAllUsersGroups(): Promise<ServiceResult<UserGroup[]>>{
    try{
        const resposta = await api.get<UserGroup[]>('accounts/list_groups/')
        return {success: true, data: resposta.data}
    } catch(erro: any){
        console.log(erro)
        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação não foram fornecidas'}
        }

        return {success: false, errMessage: 'Erro ao carregar os grupos de usuários.'}
}
}

export async function alterarFotoPerfil(newPhoto: FormData): Promise<ServiceResult<null>>{
    try{
        const resposta = await api.put('accounts/profile/', newPhoto, {
            headers: {
                "Content-Type" : 'multipart/form-data'
            }
        })
        // console.log(resposta.data)
        return {success: true, data: null}
    } catch(erro: any){
        console.error(erro)

        if(erro.response && erro.response.status === 401){
            return {success: false, errMessage: 'As credenciais de autenticação não foram fornecidas'}
        }

        return {success: false, errMessage: 'Erro ao alterar foto de usuário'}
}
    

}








