
export interface CredenciaisLogin {
    username: string,
    password: string
}

export interface RespostaLoginAPI {
    username: string,
    password: string,
    token: string,
    user_data: UserData
}

export interface UserData{
    id: number,
    username: string,
    email: string,
    is_staff: boolean,
    is_superuser: boolean

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


// export interface ProdutoAPI{
//     id: number,
//     title: string,
//     price: number,
//     description: string,
//     category: string,
//     image: string,
//     rating: {
//         rate: string,
//         count: number
//     }
// }

// export interface ProdutoForm{
//     id?: number,
//     title: string,
//     price: number,
//     description: string,
//     image: string,
//     category: string
    
// }