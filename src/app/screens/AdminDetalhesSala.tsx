// import { View } from "react-native-reanimated/lib/typescript/Animated";
import { View, ScrollView, Text, StyleSheet } from 'react-native'
import { Card, Button, ActivityIndicator, Appbar, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TelaDetalhesSala } from '../types/UserStackTypes';
import { useContext, useEffect, useState } from 'react';
import { obterDetalhesSala, marcarSalaComoLimpaService } from '../servicos/servicoSalas';
import { Sala } from '../types/apiTypes';
import { AuthContext } from '../AuthContext';
import { colors } from '../../styles/colors';
import { formatarDataISO } from '../functions/functions';




export default function DetalhesSala(){
    const authContext = useContext(AuthContext)
    if(!authContext){
        return null
    }

    const marcarSalaComoLimpa = async (id: number) => {
        // signOut()
        setCarregando(true)
        try{
            await marcarSalaComoLimpaService(id ,observacoes)
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
    const [observacoes, setObservacoes] = useState('')
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
            <ScrollView className="">



                <View className='py-8 text-center items-center justify-center bg-sblue'>
                    <Text className=' text-4xl font-bold mb-3 text-white'>{dadosSala.nome_numero}</Text>

                </View>


                <View className=' p-5 pt-5 pb-10 md:p-8'>

                <TextInput
                    label={"Observações"}
                    value={observacoes}
                    onChangeText={setObservacoes}
                    className=''
                    mode='outlined'
                    activeOutlineColor='#004A8D'
                />

                <Button className='mt-5 mx-10' icon={'marker'} contentStyle={styles.btnMarcarConcluida} buttonColor='#004A8D' mode='contained' onPress={async () => await marcarSalaComoLimpa(dadosSala.id)}>
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

const styles = StyleSheet.create({
    btnMarcarConcluida:{
        padding: 8
    }
})