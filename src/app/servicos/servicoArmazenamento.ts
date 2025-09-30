import AsyncStorage from "@react-native-async-storage/async-storage";
import { ServiceResult } from "../types/apiTypes";

const CHAVE_TOKEN = '@senaczeladoria:token';

export async function salvarToken(token: string):Promise<ServiceResult<null>>{
    try {
        await AsyncStorage.setItem(CHAVE_TOKEN, token);
        return {success: true, data: null}
        
    } catch (erro){
        return {success: false, errMessage: 'Problema ao armazenar suas informações de login.'}
    }
}

export async function obterToken(): Promise<ServiceResult<string|null>>{
    try {
        const token = await AsyncStorage.getItem(CHAVE_TOKEN);
        return {success: true, data: token};
    } catch (erro){
        // console.error('Erro ao obter token:', erro);
        return {success: false, errMessage: 'Erro ao obter token'};
    }
}

export async function removerToken():Promise<ServiceResult<null>>{
    try {
        await AsyncStorage.removeItem(CHAVE_TOKEN);
        return {success: true, data: null}
    } catch (erro){
        console.error('Erro ao remover token:', erro);
        return {success: false, errMessage: 'Erro ao remover token'}
    }
}