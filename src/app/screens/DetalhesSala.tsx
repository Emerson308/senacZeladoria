// import { View } from "react-native-reanimated/lib/typescript/Animated";
import { View, ScrollView, Text } from 'react-native'
import { Card, Button, ActivityIndicator, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TelaDetalhesSala } from '../types/telaTypes';
import { useContext, useEffect, useState } from 'react';
import { obterDetalhesSala } from '../servicos/servicoSalas';
import { Sala } from '../types/apiTypes';
import { AuthContext } from '../AuthContext';
import { colors } from '../../styles/colors';




export default function DetalhesSala(){
    const authContext = useContext(AuthContext)
    if(!authContext){
        return null
    }

    const {signOut} = authContext
    const route = useRoute<TelaDetalhesSala['route']>()
    const navigation = useNavigation()
    const {id} = route.params;

    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [dadosSala, setDadosSala] = useState<Sala|null>(null)

    useEffect(() => {
        const carregarSala = async () => {
            setCarregando(true)
            try{
                const obterDadosSalas = await obterDetalhesSala(id)
                setDadosSala(obterDadosSalas)

            } catch(erro:any){
                setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
                if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                    signOut()
                }                
            } finally{
                setCarregando(false)
            }
        }

        carregarSala()
    }, [])

    const voltarNavegacao = () => {
        navigation.goBack()
    }

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

    if(!dadosSala){
        return(
            <View  className="flex-1 bg-gray-100 p-4">
                <Appbar.Header>
                    <Appbar.BackAction onPress={voltarNavegacao}/>
                    <Appbar.Content title="Detalhes da sala" />
                </Appbar.Header>
                <Text>Produto não encontrado</Text>
            </View>
            
        )
    }

    const dadosSala1: Sala ={
        "id": 1,
        "nome_numero": "Sala 101",
        "capacidade": 30,
        "descricao": "Uma descrição rápida das principais atviidades realizadas na sala.",
        "localizacao": "Bloco A",
        "status_limpeza": "Limpeza Pendente",
        "ultima_limpeza_data_hora": "2025-07-09T12:00:00Z",
        "ultima_limpeza_funcionario": "funcionariocz"

    } 
    return(
        <View  className="flex-1 bg-gray-100 p-4">
            <Appbar.Header>
                <Appbar.BackAction onPress={voltarNavegacao}/>
                <Appbar.Content title="Detalhes da sala" />
            </Appbar.Header>
            <ScrollView className=" p-4">
                <Text className=' text-4xl font-bold mb-3'>{dadosSala1.nome_numero}</Text>
                <View className=' flex-row justify-center'>
                    <Text className=' text-2xl font-regular text-gray-500'>Status: </Text>
                    {
                        dadosSala1.status_limpeza === 'Limpa' ? (
                            <Text className=' text-2xl font-regular text-green-900'>{dadosSala1.status_limpeza}</Text>
                        ) : (
                            <Text className=' text-2xl font-regular text-red-700'>{dadosSala1.status_limpeza}</Text>
                        )
                    }

                </View>
                <Text className=' text-xl font-regular text-gray-500'>Capacidade: {dadosSala1.capacidade}</Text>
                <Text className=' text-xl font-regular text-gray-500'>Localização: {dadosSala1.localizacao}</Text>
                <Text className=' text-xl font-regular text-gray-500'>{dadosSala1.ultima_limpeza_funcionario}</Text>
                <Text className=' text-xl font-regular text-gray-500'>{dadosSala1.ultima_limpeza_data_hora}</Text>
                <Text className=' text-xl font-regular text-gray-500'>{dadosSala1.descricao}</Text>
            </ScrollView>
            
        </View>
    )
}