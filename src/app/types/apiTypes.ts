
export interface CredenciaisLogin {
    username: string,
    password: string
}

export interface RespostaLoginAPI {
    username: string,
    password: string,
    token: string,
    user_data: Usuario
}

export interface Usuario{
    id: number,
    username: string,
    email: string,
    // is_staff: boolean,
    is_superuser: boolean,
    groups: number[],
    profile: {
        profile_picture: string | null
    }


}

export interface Sala{
    id: number,
    nome_numero: string,
    capacidade: number,
    descricao: string,
    localizacao: string,
    status_limpeza: "Limpa" | "Limpeza Pendente",
    ultima_limpeza_data_hora: null | string,
    ultima_limpeza_funcionario: null | string
}

export interface newSala{
    nome_numero: string,
    capacidade: number,
    descricao: string,
    localizacao: string,

}

// export interface Usuario1{
//     id: number,
//     username: string,
//     email: string,
//     // is_staff: boolean,
//     is_superuser: boolean,
//     groups: number[],
//     profile: {
//         profile_picture: string
//     }

// }

export interface NovoUsuario{
    username: string,
    password: string,
    confirm_password: string,
    email?: string,
    is_superuser?: boolean,
    // is_superuser: boolean
}

export interface RegistroSala{
    id: number,
    sala: number,
    sala_nome: string,
    data_hora_limpeza: string,
    funcionario_responsavel:{
        id: 1,
        username: string
    },
    observacoes: string
}

export interface UserChangePassword{
    old_password: string,
    new_password: string,
    confirm_new_password: string
}

export interface UserGroup{
    id: number,
    name: string
}







