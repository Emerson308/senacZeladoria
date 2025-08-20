// import { View } from "react-native-reanimated/lib/typescript/Animated";
import { View, ScrollView, Text } from 'react-native'
import { Card, Button, ActivityIndicator, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TelaDetalhesSala } from '../types/telaTypes';
import { useContext, useEffect, useState } from 'react';
import { obterDetalhesSala, marcarSalaComoLimpaService } from '../servicos/servicoSalas';
import { Sala } from '../types/apiTypes';
import { AuthContext } from '../AuthContext';
import { colors } from '../../styles/colors';
import {parseISO, format} from 'date-fns'
import { ptBR } from 'date-fns/locale';




export default function DetalhesSala(){
    const authContext = useContext(AuthContext)
    if(!authContext){
        return null
    }

    const formatarDataISO = (utcDateTimeStr: string|null) => {
        if (!utcDateTimeStr){
            return 'N/A'
        }

        try{
            const dateObjectUTC = parseISO(utcDateTimeStr)

            return format(dateObjectUTC, "dd/MM/yyyy 'às' HH:mm:ss", {locale: ptBR})
        } catch(error){
            console.error("Erro ao processar data/hora")
            return "Data Inválida"
        }
    }

    const marcarSalaComoLimpa = async (id: number) => {
        // signOut()
        setCarregando(true)
        try{
            await marcarSalaComoLimpaService(id)
            await carregarSala()
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }                

        } finally{
            setCarregando(false)
        }
    }

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


    const {signOut} = authContext
    const route = useRoute<TelaDetalhesSala['route']>()
    const navigation = useNavigation()
    const {id} = route.params;

    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [dadosSala, setDadosSala] = useState<Sala|null>(null)
    // const [reload, setReload] = useState(false)

    useEffect(() => {
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
        "status_limpeza": "Limpa",
        "ultima_limpeza_data_hora": "2025-07-09T12:00:00Z",
        "ultima_limpeza_funcionario": "funcionariocz"

    }

    const estilosTailwind = {
        item: "bg-white mt-5 border-l-4 border-l-sblue p-4 rounded-xl",
        info_label: "text-xl font-regular text-gray-400 uppercase tracking-wider mb-1",
        info_values: " text-2xl font-semibold text-gray-800 break-words"
    }

    return(
        <View  className="flex-1 bg-gray-100 p-4">
            <Appbar.Header>
                <Appbar.BackAction onPress={voltarNavegacao}/>
                <Appbar.Content title="Detalhes da sala" />
            </Appbar.Header>
            <ScrollView className="">



                <View className='py-8 text-center items-center justify-center bg-sblue'>
                    <Text className=' text-4xl font-bold mb-3 text-white'>{dadosSala.nome_numero}</Text>

                </View>


                <View className=' p-5 pt-0 md:p-8'>

                <Button className='mt-5 mx-10 py-2' icon={'marker'} buttonColor='#004A8D' mode='contained' onPress={async () => await marcarSalaComoLimpa(dadosSala1.id)}>
                    Marcar como limpa
                </Button>

                <View className={estilosTailwind.item + ''}>
                    <Text className={estilosTailwind.info_label}>Capacidade</Text>
                    {/* <Text className=' text-2xl font-regular text-green-900'>{dadosSala1.status_limpeza}</Text> */}
                    <Text className={estilosTailwind.info_values}>{dadosSala.capacidade} pessoas</Text>

                </View>

                <View className={estilosTailwind.item}>
                    <Text className={estilosTailwind.info_label}>Localização</Text>
                    {/* <Text className=' text-2xl font-regular text-green-900'>{dadosSala1.status_limpeza}</Text> */}
                    <Text className={estilosTailwind.info_values}>{dadosSala.localizacao}</Text>

                </View>

                <View className={estilosTailwind.item}>
                    <Text className={estilosTailwind.info_label}>Status da limpeza</Text>
                    {/* <Text className=' text-2xl font-regular text-green-900'>{dadosSala1.status_limpeza}</Text> */}
                    {
                        dadosSala.status_limpeza === 'Limpa' ? <Text className='bg-green-100 text-green-800 text-xl font-medium px-2 pl-3 py-1 rounded-full'>{dadosSala.status_limpeza}</Text>
                        : <Text className='bg-yellow-100 text-yellow-800 text-xl font-medium px-2 pl-3 py-1 rounded-full'>{dadosSala.status_limpeza}</Text>
                    }
                    

                </View>

                <View className={estilosTailwind.item}>
                    <Text className={estilosTailwind.info_label}>Última limpeza</Text>
                    {/* <Text className=' text-2xl font-regular text-green-900'>{dadosSala1.status_limpeza}</Text> */}
                    <View>
                        <Text className={estilosTailwind.info_values + 'font-normal text-3sm'}>{formatarDataISO(dadosSala.ultima_limpeza_data_hora)}</Text>
                        <Text className={estilosTailwind.info_values + 'text-gray-600 font-regular text-2sm'}>Por {dadosSala.ultima_limpeza_funcionario}</Text>

                    </View>

                </View>

                <View className={estilosTailwind.item}>
                    <Text className={estilosTailwind.info_label}>Descrição</Text>
                    {/* <Text className=' text-2xl font-regular text-green-900'>{dadosSala1.status_limpeza}</Text> */}
                    <Text className={estilosTailwind.info_values + ' font-regular text-gray-800'}>{dadosSala.descricao}</Text>

                </View>

                </View>

            </ScrollView>
            
        </View>
    )
}