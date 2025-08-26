
import axios from "axios";
import { obterToken, removerToken } from '../servicos/servicoArmazenamento';
import { AuthContext } from "../AuthContext";

const api = axios.create({
    baseURL: 'https://zeladoria.tsr.net.br/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    async (config) => {
        const token = await obterToken();
        if (token){
            config.headers.Authorization = `Token ${token}`
        }
        return config
    },
    (erro) => {
        return Promise.reject(erro);
    }
)

api.interceptors.response.use(
    (response) => response, 
    async (erro) => {
        if (erro.response && erro.response.status === 401) {
            await removerToken();
            // const authContext = AuthContext;
            // const { sign } = authContext
            // await removerToken()
            console.warn('Token de autenticação expirado ou inválido. Realize o login novamente.')

        }
        return Promise.reject(erro)

    }
    
)

export default api