
import axios from "axios";
import { obterToken, removerToken } from '../servicos/servicoArmazenamento';
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import eventBus from "../utils/eventBus";

export const apiURL = 'https://zeladoria.tsr.net.br/'

const api = axios.create({
    baseURL: apiURL + 'api/',
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
            console.warn('Token de autenticação expirado ou inválido. Realize o login novamente.')

            delete api.defaults.headers.common['Authorization']
            eventBus.emit('LOGOUT')
            // const authContext = useContext(AuthContext);

            // if (!authContext){
            //     return
            // }

            // const {signOut} = authContext
            // signOut()
            // const { sign } = authContext
            // await removerToken()

        }
        return Promise.reject(erro)

    }
    
)

export default api