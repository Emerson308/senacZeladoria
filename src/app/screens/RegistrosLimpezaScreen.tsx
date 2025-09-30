
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usuarioLogado } from "../servicos/servicoUsuarios";
import { RegistroSala, Usuario } from "../types/apiTypes";
import { Alert, Text, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, Avatar, Button, TextInput } from "react-native-paper";
import { AuthContext } from "../AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import { getRegistrosService } from "../servicos/servicoSalas";
import RegistroCard from "../components/RegistroCard";
// import { TextInput } from "react-native-gesture-handler";


export default function RegistrosLimpezaScreen(){

    const authContext = useContext(AuthContext)

    if (!authContext){
        return null
    }

    const {signOut} = authContext
    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [registros, setRegistros] = useState<RegistroSala[]>([])
    const [registrosFiltrados, setRegistrosFiltrados] = useState<RegistroSala[]>([])
    const [filtroRegistros, setFiltroRegistros] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    
    useEffect(() => {
        if (filtroRegistros === ''){
            setRegistrosFiltrados(registros)
        } else{
            const filtroOrganizado = filtroRegistros.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

            const registrosComFiltro = registros.filter(registro => {
                const nomeSalaOrganizado = registro.sala_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                
                
                return nomeSalaOrganizado.includes(filtroOrganizado)
            })
   
            const registrosComFiltroComecandoComBusca = registrosComFiltro.filter(registro => {
                const nomeSalaOrganizado = registro.sala_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                return nomeSalaOrganizado.startsWith(filtroOrganizado)
            })
            const registrosComFiltroNaoComecandoComBusca = registrosComFiltro.filter(registro => {
                const nomeSalaOrganizado = registro.sala_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                return !nomeSalaOrganizado.startsWith(filtroOrganizado)
            })
            
            const registrosComFiltroOrganizados = [...registrosComFiltroComecandoComBusca, ...registrosComFiltroNaoComecandoComBusca]
            setRegistrosFiltrados(registrosComFiltroOrganizados)
            
        }
    }, [registros, filtroRegistros])

    useFocusEffect(React.useCallback(() => {
        setCarregando(true)
        carregarRegistros()
        setCarregando(false)
    }, []))

    const carregarRegistros = async () => {
        const getRegistrosServiceResult = await getRegistrosService()
        if(!getRegistrosServiceResult.success){
            Alert.alert('Erro', getRegistrosServiceResult.errMessage)
            return
        }
        setRegistros(getRegistrosServiceResult.data)

        try {

        } catch (erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar seu perfil')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro, [
                {
                    text: 'Ok',
                    style:'default',
                    // onPress: () => navigation.navigate('Home')
                    
                }
            ])
            

        }
    }

    if (carregando){
        return(
            <View className='flex-1 bg-gray-50 justify-center p-16'>
                <ActivityIndicator size={80}/>
            </View>
        )    
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-2 flex-col">

            <TextInput
                label={'Pesquisar registros de sala'}
                value={filtroRegistros}
                onChangeText={setFiltroRegistros}
                autoCapitalize="none"
                keyboardType="default"
                mode="outlined"
                activeOutlineColor='#004A8D'
                // className=" mx-10"

            />

            <ScrollView className="p-1 flex-1 mt-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarRegistros}/>}>
                {registrosFiltrados.map((registro) => (
                    <RegistroCard key={registro.id} registro={registro} />
            ))}
            </ScrollView>

        </SafeAreaView>
    )
}




















