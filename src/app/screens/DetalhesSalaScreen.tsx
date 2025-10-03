// import { View } from "react-native-reanimated/lib/typescript/Animated";
import { View, ScrollView, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground } from 'react-native'
import { Card, Button, ActivityIndicator, Appbar, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TelaDetalhesSala } from '../navigation/types/UserStackTypes';
import React, { useContext, useEffect, useState } from 'react';
import { obterDetalhesSala, marcarSalaComoLimpaService } from '../servicos/servicoSalas';
import { Sala } from '../types/apiTypes';
import { AuthContext } from '../AuthContext';
import { colors } from '../../styles/colors';
import { formatarDataISO } from '../utils/functions';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons'
import { apiURL } from '../api/axiosConfig';
import Toast from 'react-native-toast-message';

// import { Alert } from 'react-native';


export default function DetalhesSalaScreen(){
    const authContext = useContext(AuthContext)
    if(!authContext){
        return null
    }
    if(!authContext.user){
        return null
    }
    
    const {signOut, user} = authContext
    const route = useRoute<TelaDetalhesSala['route']>()
    const navigation = useNavigation()
    const {id} = route.params;

    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [dadosSala, setDadosSala] = useState<Sala|null>(null)
    const [observacoes, setObservacoes] = useState('')
    // const [reload, setReload] = useState(false)

    // const marcarSalaComoLimpa = async (id: string) => {
    //     setCarregando(true)
    //     try{
    //         await marcarSalaComoLimpaService(id ,observacoes)
    //         await carregarSala()
    //     } catch(erro: any){
    //         setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
    //         if(erro.message.includes('Token de autenticação expirado ou inválido.')){
    //             signOut()
    //         }                
    //         Alert.alert('Erro', mensagemErro)
            
    //     } finally{
    //         setCarregando(false)
    //     }
    // }
    
    const carregarSala = async () => {
        setCarregando(true)
        const obterDetalhesSalaResult = await obterDetalhesSala(id);
        if(!obterDetalhesSalaResult.success){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: obterDetalhesSalaResult.errMessage,
                position: 'bottom',
                visibilityTime: 3000
            })
            return;
        }
        
        setDadosSala(obterDetalhesSalaResult.data)
        setCarregando(false)
    }

    useEffect(() => {
        carregarSala()
    }, [])


    if(carregando){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }

    if(!dadosSala){
        return(
            <View  className="flex-1 bg-gray-100 p-4">
                <Text>Sala não encontrada</Text>
            </View>
            
        )
    }

    const estilosTailwind = {
        item: "bg-white mt-5 border-l-4 border-l-sblue p-4 rounded-xl",
        info_label: "text-xl font-regular text-gray-400 uppercase tracking-wider mb-1",
        info_values: " text-2xl font-semibold text-gray-800 break-words"
    }

    return(
        <SafeAreaView  className="flex-1 flex-col bg-gray-100 p-1">
        <View className='text-center flex-col'>
            <View className=" bg-sblue rounded-lg rounded-b-none py-4 px-5 flex-row gap-6 items-center border-b-2 border-gray-100">
                <TouchableOpacity onPress={navigation.goBack}>
                    <Ionicons
                        name='arrow-back'
                        color={'white'}
                        size={24}
                    />
                </TouchableOpacity>
                <Text className=" text-2xl text-white" >Perfil</Text>
            </View>

        </View>
            <ScrollView className=" flex-1 mb-3">
                {
                    dadosSala.imagem
                    ? (
                        <ImageBackground
                            className=' flex-row aspect-video justify-center'
                            source={{uri: apiURL + dadosSala.imagem}}
                        >
                            <View className=' bg-black/40 flex-1 px-4 items-center justify-center '>
                                <Text className=' text-3xl text-center font-bold mb-3 text-white'>{dadosSala.nome_numero}</Text>
                            </View>
                        </ImageBackground>
                    )
                    : (
                        <View className=' bg-black/40 aspect-video px-4 items-center justify-center'>
                            <Text className=' text-3xl text-center font-bold mb-3 text-white'>{dadosSala.nome_numero}</Text>
                        </View>
                    )
                }
                <View className=' p-5 pt-0 pb-10 md:p-8'>


                    <View className={estilosTailwind.item}>
                        <Text className={estilosTailwind.info_label}>Status da limpeza</Text>
                        {
                            dadosSala.status_limpeza === 'Limpa' 
                            ? <Text className='text-sgreen bg-sgreen/20 text-xl font-medium px-2 pl-3 py-1 rounded-full'>{dadosSala.status_limpeza}</Text>
                            : dadosSala.status_limpeza === 'Limpeza Pendente'
                            ? <Text className='text-syellow bg-syellow/20 text-xl font-medium px-2 pl-3 py-1 rounded-full'>{dadosSala.status_limpeza}</Text>
                            : dadosSala.status_limpeza === 'Em Limpeza'
                            ? <Text className='text-sgray bg-sgray/20 text-xl font-medium px-2 pl-3 py-1 rounded-full'>{dadosSala.status_limpeza}</Text>
                            : <Text className='text-sred bg-sred/20 text-xl font-medium px-2 pl-3 py-1 rounded-full'>{dadosSala.status_limpeza}</Text>
                        }
                    </View>

                    {
                        user.is_superuser || user.groups.includes(1)
                        ? (
                            <>
                            <View className={estilosTailwind.item + ''}>
                                <Text className={estilosTailwind.info_label}>Instruções</Text>
                                <Text className={estilosTailwind.info_values}>{dadosSala.instrucoes ? dadosSala.instrucoes : 'Sem instruções'}</Text>
                            </View>

                            <View className={estilosTailwind.item}>
                                <Text className={estilosTailwind.info_label}>Última limpeza</Text>
                                {
                                    dadosSala.ultima_limpeza_funcionario ? 
                                    <View>
                                        <Text className={estilosTailwind.info_values + 'font-normal text-3sm'}>{formatarDataISO(dadosSala.ultima_limpeza_data_hora)}</Text>
                                        <Text className={estilosTailwind.info_values + 'text-gray-600 font-regular text-2sm'}>Por {dadosSala.ultima_limpeza_funcionario}</Text>
                                    </View> : 
                                    <Text className={estilosTailwind.info_values}>Sem histórico de limpeza</Text>
                                }
                            </View>

                            <View className={estilosTailwind.item + ''}>
                                <Text className={estilosTailwind.info_label}>Validade da limpeza</Text>
                                <Text className={estilosTailwind.info_values}>{dadosSala.validade_limpeza_horas} horas</Text>
                            </View>

                            <View className={estilosTailwind.item + ''}>
                                <Text className={estilosTailwind.info_label}>Status da sala</Text>
                                <Text className={(dadosSala.ativa) ? 'bg-sgreen/20 px-4 py-1 rounded-md text-2xl text-sgreen' + estilosTailwind.info_values : 'bg-sred/20 px-4 py-1 rounded-md text-2xl text-sred' + estilosTailwind.info_values}>{dadosSala.ativa ? 'Ativa' : 'Inativa'}</Text>
                            </View>
                                    
                            </>
                        ) : null
                    }
    
                    <View className={estilosTailwind.item + ''}>
                        <Text className={estilosTailwind.info_label}>Capacidade</Text>
                        <Text className={estilosTailwind.info_values}>{dadosSala.capacidade} pessoas</Text>
                    </View>

                    <View className={estilosTailwind.item}>
                        <Text className={estilosTailwind.info_label}>Localização</Text>
                        <Text className={estilosTailwind.info_values}>{dadosSala.localizacao}</Text>
                    </View>

                    {
                        user.is_superuser || user.groups.includes(1)
                        ? (
                        <View className={estilosTailwind.item + ''}>
                            <Text className={estilosTailwind.info_label + ''}>Responsaveis</Text>
                            {dadosSala.responsaveis.map(responsavel => <Text key={responsavel} className={estilosTailwind.info_values}>- {responsavel}</Text>)}
                            {dadosSala.responsaveis.length === 0 ? <Text className={estilosTailwind.info_values} >Sem responsaveis</Text>: null}
                        </View>
                        ) : null
                    }


                    <View className={estilosTailwind.item}>
                        <Text className={estilosTailwind.info_label}>Descrição</Text>
                        <Text className={estilosTailwind.info_values + ' font-regular text-gray-800'}>{dadosSala.descricao}</Text>
                    </View>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}
