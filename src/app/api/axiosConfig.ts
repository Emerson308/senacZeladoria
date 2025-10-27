
import axios from "axios";
import { obterToken } from '../servicos/servicoArmazenamento';
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
        const obterTokenResult = await obterToken();
        if(obterTokenResult.success && obterTokenResult.data){
            config.headers.Authorization = `Token ${obterTokenResult.data}`
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
            eventBus.emit('LOGOUT')

        }
        return Promise.reject(erro)

    }
    
)

export default api