import { ImageSourcePropType } from "react-native";
import api from "../api/axiosConfig";
import { NovoUsuario, UserChangePassword, UserGroup, Usuario } from "../types/apiTypes";

export async function obterUsuarios(group?: string):Promise<Usuario[]>{
    try{
        if (group){
            const resposta = await api.get<Usuario[]>('accounts/list_users/?group='+group)
            console.log(resposta.data)
            return resposta.data
        }
        const resposta = await api.get<Usuario[]>('accounts/list_users/')
        // console.log(resposta.data)
        return resposta.data
    } catch(erro: any){
        console.error(erro);
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

export async function usuarioLogado():Promise<Usuario>{
    try {
        const resposta = await api.get<Usuario>('accounts/current_user/');
        // console.log(resposta.data)
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

export async function alterarSenha(passwords: UserChangePassword){
    try {
        const resposta = await api.post('accounts/change_password/', passwords);
        return resposta.data
    } catch(erro: any){
        // console.error(erro)
        if (erro.response && erro.response.status === 401){
            throw new Error('Token inválido.');
        }
        if (erro.response && erro.response.status === 400){
            throw new Error('A senha antiga está incorreta');
        }
        // return null
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.')
        
    }
}

export async function getAllUsersGroups(){
    try{
        const resposta = await api.get<UserGroup[]>('accounts/list_groups/')
        return resposta.data
    } catch(erro: any){
        if (erro.response && erro.response.status === 401){
            throw new Error('Token inválido.');
        }
        // return null
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.')
}
}

export async function alterarFotoPerfil(newPhoto: FormData){
    const formData = new FormData()

    // const imgName = n

    // formData.append('profile_picture', {
    //     uri: newPhoto,
    //     name
    // })

    try{
        const resposta = await api.put('accounts/profile/', newPhoto, {
            headers: {
                "Content-Type" : 'multipart/form-data'
            }
        })
        console.log(resposta.data)
        return resposta.data
    } catch(erro: any){
        console.error(erro)
        if (erro.response && erro.response.status === 401){
            throw new Error('Token inválido.');
        }
        // return null
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.')
}
    

}








