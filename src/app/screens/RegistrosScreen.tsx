import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { TouchableRipple, Searchbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { AdminStackParamList, TelaRegistros } from "../navigation/types/StackTypes";
import { chartData, FullLineChart } from "./EstatisticasLimpeza";
import { useEffect, useState } from "react";
import { getRegistrosService } from "../servicos/servicoLimpezas";
import { colors } from "../../styles/colors";
import { dateToUTC, normalizarTexto, showErrorToast, utcToYYYYMMDD } from "../utils/functions";
import { getSecondsUtcDiference } from "../utils/functions";
import { RegistroSala } from "../types/apiTypes";
import RegistroCard from "../components/cards/RegistroCard";
import LoadingComponent from "../components/LoadingComponent";






const getLimpezaStatusVelocidade = (inicio: string, fim: string | null) => {
    if(!fim){
        return
    }
    const seconds = getSecondsUtcDiference(inicio, fim)

    if(seconds < 1200) return 'Rapida'
    if(seconds < 2400 && seconds > 1200) return 'Media'
    if(seconds > 3600) return 'Lenta'

}

export default function RegistrosScreen() {

    const navigation = useNavigation<NavigationProp<AdminStackParamList>>()
    const route = useRoute<TelaRegistros['route']>()
    const { sala, zelador } = route.params

    const [registros, setRegistros] = useState<RegistroSala[]>([])
    const [statusVelocidadeData, setStatusVelocidadeData] = useState<chartData[]>([])
    const [carregando, setCarregando] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [] = useState()

    useEffect(() => {
        setCarregando(true)
        carregarRegistros()
    }, [])



    const carregarRegistros = async () => {

        setRefreshing(true)

        const nowDate = new Date()
        const nowDateUTC = dateToUTC(nowDate)
        const nowDateYYYYMMDD = utcToYYYYMMDD(nowDateUTC)

        let getRegistrosServiceResult

        if(sala && !zelador){
            getRegistrosServiceResult = await getRegistrosService({sala_uuid: sala.qr_code_id})
        }
        if(zelador && !sala){
            getRegistrosServiceResult = await getRegistrosService({username: zelador.username})
        }
        if(!sala && !zelador){
            getRegistrosServiceResult = await getRegistrosService({})
        }

        if(!getRegistrosServiceResult || !getRegistrosServiceResult.success){
            showErrorToast({errMessage: 'Falha ao listar os registros'})
            return
        }

        const registros = getRegistrosServiceResult.data

        const registrosConcluidos = registros.filter(registro => registro.data_hora_fim !== null)
        const registrosCount = registrosConcluidos.length

        // console.log(registrosConcluidos)

        setRegistros(registrosConcluidos)

        const limpezasRapidas = registrosConcluidos.filter(limpeza => getLimpezaStatusVelocidade(limpeza.data_hora_inicio, limpeza.data_hora_fim) === 'Rapida')
        const limpezasMedias = registrosConcluidos.filter(limpeza => getLimpezaStatusVelocidade(limpeza.data_hora_inicio, limpeza.data_hora_fim) === 'Media')
        const limpezasLentas = registrosConcluidos.filter(limpeza => getLimpezaStatusVelocidade(limpeza.data_hora_inicio, limpeza.data_hora_fim) === 'Lenta')

        const limpezasRapidasCount = limpezasRapidas.length
        const limpezasMediasCount = limpezasMedias.length
        const limpezasLentasCount = limpezasLentas.length

        const limpezasRapidasPercentage = limpezasRapidasCount === 0 ? 0 : (limpezasRapidasCount / registrosCount) * 100
        const limpezasMediasPercentage = limpezasMediasCount === 0 ? 0 : (limpezasMediasCount / registrosCount) * 100
        const limpezasLentasPercentage = limpezasLentasCount === 0 ? 0 : (limpezasLentasCount / registrosCount) * 100

        const statusVelocidadeData: chartData[] = [
            {
                label: 'Rápida',
                color: colors.sgreen,
                value: limpezasRapidasCount,
                percentage: limpezasRapidasPercentage
            },
            {
                label: 'Média',
                color: colors.syellow,
                value: limpezasMediasCount,
                percentage: limpezasMediasPercentage
            },
            {
                label: 'Lenta',
                color: colors.sred,
                value: limpezasLentasCount,
                percentage: limpezasLentasPercentage
            },
        ]

        setStatusVelocidadeData(statusVelocidadeData)
        setCarregando(false)
        setRefreshing(false)
    }

    const navegarToDetalhesLimpeza = (registro: RegistroSala) => {
        navigation.navigate('Limpeza', {type: 'Observar', registroSala: registro})
    }

    const getCardType = () => {
        if(sala && !zelador){
            return 'Sala'
        }
        if(!sala && zelador){
            return 'Zelador'
        }

        return 'All'
    }

    const cardType = getCardType()

    const searchTextFormatado = normalizarTexto(searchText)

    const registrosFiltrados = registros.filter(registro => {
        const salaNomeFormatado = normalizarTexto(registro.sala_nome)
        const usernameFormatado = normalizarTexto(registro.funcionario_responsavel)

        const salaNomeMatchSearch = salaNomeFormatado.includes(searchTextFormatado) && !sala
        const usernameMatchSearch = usernameFormatado.includes(searchTextFormatado) && !zelador

        return salaNomeMatchSearch || usernameMatchSearch
    })




    if(carregando){

        return( 
            <LoadingComponent loadLabel="Carregando registros..." reLoadFunction={async () => await carregarRegistros()}/>            
        )        
    }

    return (
        <SafeAreaView className=" bg-gray-100 flex-1 flex-col">
            <View className=" bg-white py-2 pt-4 px-5 flex-col gap-4 border-b-2 border-gray-200">
                <View className=" flex-row gap-4 items-center">
                    <TouchableRipple
                        borderless={true}
                        className=" p-3 rounded-full"
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24}/>
                    </TouchableRipple>
                    <Text className=" text-2xl flex-1" >Registros</Text>
                </View>
                <View className=" gap-2">
                    <Searchbar
                        placeholder={'Procurar registros'}
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholderTextColor={colors.sgray}
                        iconColor={colors.sgray}
                        autoCapitalize="none"
                        // submitBehavior="blurAndSubmit"
                        // mode="view"
                        className=" "
                        style={{}}
                        theme={{colors: {primary: colors.sblue, elevation: {level3: colors.sgray + '20'}}}}
                    />
                    {!searchText ? null : 
                        <Text className=" text-base text-sgray ml-2">{registrosFiltrados.length} resultados.</Text>
                    }
                    
                </View>
            </View>
            <View className=" flex-1 mb-4 flex-col">

                <FlatList
                    data={registrosFiltrados}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerClassName=" px-4 py-4 gap-4"
                    className=" mb-4"
                    onRefresh={async () => await carregarRegistros()}
                    refreshing={refreshing}
                    ListHeaderComponent={() => (
                        <View className=" items-center justify-center w-full self-center p-4 shadow-md bg-white m-4 rounded-2xl gap-3">
                            {!sala ? null : <Text className=" text-center text-2xl font-bold px-8" numberOfLines={2}>{sala.nome_numero}</Text>}
                            {!zelador ? null : <Text className=" text-center text-2xl font-bold px-8" numberOfLines={2}>{zelador.username}</Text>}

                            <Text className=" text-xl font-bold">Número de registros: {registros.length}</Text>
                            <FullLineChart chartData={statusVelocidadeData} title="Velocidades de limpezas" />
                        </View>

                    )}
                    renderItem={(item) => <RegistroCard type={cardType} registro={item.item} onPress={() => navegarToDetalhesLimpeza(item.item)}/>}
                />

            </View>

        </SafeAreaView>
    )
}