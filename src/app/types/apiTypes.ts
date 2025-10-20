
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
    nome: string
    profile: {
        // nome: string
        profile_picture: string | null
    }


}

export interface imagesToUpload{
    uri: string,
    name: string,
    type: string
}

export interface Sala{
    id: number,
    qr_code_id: string,
    nome_numero: string,
    imagem: string | null,
    capacidade: number,
    validade_limpeza_horas: number,
    descricao: string,
    instrucoes: string,
    localizacao: string,
    ativa: boolean,
    responsaveis: string[]
    status_limpeza: "Limpa" | "Limpeza Pendente" | "Suja" | "Em Limpeza"
    ultima_limpeza_data_hora: null | string,
    ultima_limpeza_funcionario: null | string,
    detalhes_suja?: {
        data_hora: string,
        observacoes: string,
        reportado_por: string
    }
}

export interface newSala{
    nome_numero: string,
    capacidade: string,
    descricao: string,
    responsaveis: string[]
    localizacao: string,
    instrucoes: string,
    validade_limpeza_horas : string,
    ativa: boolean,

}

export interface imageType{
    uri: string,
    name: string,
    type: string
}

export interface imageRegistro{
    id: number,
    imagem: string,
    timestamp: string
}


export interface NovoUsuario{
    username: string,
    password: string,
    confirm_password: string,
    email?: string,
    nome?: string,
    groups?: number[]
    is_superuser?: boolean,
    // is_superuser: boolean
}

export interface RegistroSala{
    id: number,
    sala: string,
    sala_nome: string,
    data_hora_inicio: string,
    data_hora_fim: string | null,
    funcionario_responsavel: string,
    observacoes: string | null,
    fotos: imageRegistro[]
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

export interface Notification{
    id: number,
    mensagem: string,
    link: string,
    data_criacao: string,
    lida: boolean
}



interface ServiceFailure{
    success: false,
    errMessage: string
}

interface ServiceSuccess<T>{
    success: true,
    data: T
}

export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure






