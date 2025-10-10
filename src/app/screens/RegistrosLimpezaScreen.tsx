
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usuarioLogado } from "../servicos/servicoUsuarios";
import { RegistroSala, Usuario } from "../types/apiTypes";
import { Alert, Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { ActivityIndicator, Avatar, Searchbar, TextInput, TouchableRipple } from "react-native-paper";
import { AuthContext } from "../AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import { getRegistrosService } from "../servicos/servicoSalas";
import RegistroCard from "../components/cards/RegistroCard";
import Toast from "react-native-toast-message";
import {Ionicons} from "@expo/vector-icons"
import HeaderScreen from "../components/HeaderScreen";
import { showErrorToast } from "../utils/functions";
import LoadingCard from "../components/cards/LoadingCard";


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
        carregarRegistros().then(() => setCarregando(false))
    }, []))

    const carregarRegistros = async () => {
        const getRegistrosServiceResult = await getRegistrosService({})
        if(!getRegistrosServiceResult.success){
            showErrorToast({errMessage: getRegistrosServiceResult.errMessage})
            return
        }
        setRegistros(getRegistrosServiceResult.data)
    }

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100 pb-4 flex-col">
            <HeaderScreen 
                searchBar={{searchText: filtroRegistros, setSearchText: setFiltroRegistros, searchLabel: 'Pesquisar registros'}}
                headerText="Registros"

            />
            {carregando ? (
                <ScrollView className="p-3 px-7">
                    {[...Array(5)].map((_, index) => (
                        <LoadingCard key={index} loadingImage={false} />
                    ))}
                </ScrollView>
            ) : registrosFiltrados.length === 0 ?
            <View className=" flex-1 justify-center gap-2 items-center px-10">
                <Ionicons name="close-circle-outline" size={64} color={colors.sgray}/>
                <Text className="text-gray-500">Nenhum registro encontrado</Text>
                </View>
                :
                <ScrollView className="p-1 flex-1 mt-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarRegistros}/>}>
                    {registrosFiltrados.map((registro) => (
                        <RegistroCard key={registro.id} registro={registro} />
                    ))}
                </ScrollView>
            }
        </SafeAreaView>
    )
}




















