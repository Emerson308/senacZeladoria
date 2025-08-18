
export interface Sala{
    id: number,
    nome_numero: string,
    capacidade: number,
    descricao: string,
    localizacao: string,
    status_limpeza: "Limpa" | "Limpeza Pendente",
    ultima_limpeza_data_hora: null | String,
    ultima_limpeza_funcionario: null | string
}