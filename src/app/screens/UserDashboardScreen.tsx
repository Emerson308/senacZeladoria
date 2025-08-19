import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button, Text, ActivityIndicator } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import SalaCard from "../components/SalaCard";
import { RootStackParamList } from "../types/telaTypes";
import { Sala } from "../types/apiTypes";
import { obterSalas } from "../servicos/servicoSalas";
// import '../styles/global.css'; // Certifique-se de que o NativeWind está configurado

export default function UserDashboardScreen() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const {signOut} = authContext
    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [salas, setSalas] = useState<Sala[]>([])

    useEffect(() => {
        const carregarSalas = async () => {
            setCarregando(true)
            try{
                const obtendoSalas = await obterSalas()
                setSalas(obtendoSalas)
            } catch(erro: any){
                setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
                if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                    signOut()
                }
            } finally{
                setCarregando(false)

            }
        }
        carregarSalas()

    }, [])
    
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    const irParaDetalhesSala = (id: number) =>{
        navigation.navigate('DetalhesSala', {id: id})
    }

    const teste : Sala = { id: 1, nome_numero: 'Sala de TI', capacidade: 30, descricao: 'Sala de reuniões da equipe de TI.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: "2025-07-09T12:00:00Z", ultima_limpeza_funcionario: null}

    // const salas: Sala[] = [
    //     { id: 1, nome_numero: 'Sala de TI', capacidade: 30, descricao: 'Sala de reuniões da equipe de TI.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 2, nome_numero: 'Sala de Reunião Principal', capacidade: 30, descricao: 'Sala para grandes apresentações e reuniões.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 3, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 4, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 5, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 6, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 7, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 8, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 9, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 10, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 11, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 12, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 13, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 14, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 15, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    //     { id: 16, nome_numero: 'Sala de Design', capacidade: 30, descricao: 'Equipada com computadores e tablets de última geração.', localizacao: "Bloco A", status_limpeza: "Limpeza Pendente", ultima_limpeza_data_hora: null, ultima_limpeza_funcionario: null},
    // ];

    if(carregando){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }

    if(mensagemErro){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>
            <Text className='text-center'>{mensagemErro}</Text>
        </View>
        )
    }

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <View className="bg-gray-100 w-full h-40 mb-6 justify-center p-2">
                <Text className=" text-3xl font-bold">Salas</Text>
            </View>
            <ScrollView className="p-3">
                {salas.map((sala) => (
                    <SalaCard key={sala.id} sala={sala} onPress={() => irParaDetalhesSala(sala.id)}/>
                    // <View></View>
                ))}
            </ScrollView>
        </View>
    );
};