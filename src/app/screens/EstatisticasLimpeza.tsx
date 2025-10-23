import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { colors } from "../../styles/colors";
import { obterSalas } from "../servicos/servicoSalas";
import { getSecondsUtcDiference, showErrorToast } from "../utils/functions";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { getRegistrosService } from "../servicos/servicoLimpezas";
import { RegistroSala, Sala, Usuario } from "../types/apiTypes";
import { FlatList } from "react-native-gesture-handler";
import LimpezasAndamentoCard from "../components/cards/LimpezasAndamentoCard";
import { AdminStackParamList } from "../navigation/types/StackTypes";
import EstatisticasCardList from "./EstatisticasCardList";
import {Ionicons} from '@expo/vector-icons'
import { obterUsuarios } from "../servicos/servicoUsuarios";
import { AuthContext } from "../AuthContext";



export interface chartData{
    label: string,
    value: number,
    color: string,
    percentage: number
}

interface statusSalas{
    salasCount: number,
    statusLimpezaData: chartData[]
    statusSalaData: chartData[]
}

interface statusLimpezasConcluidas{
    limpezasConcluidasCount: number,
    statusVelocidadeData: chartData[],
}

interface LineChartProps{
    chartData?: chartData[]
}

interface LegendChartProps{
    chartData?: chartData[]
}

interface estatisticasCardListProps{
    title: string,
    listCount: number,
    renderList: 'LimpezasEmAndamento' | 'LimpezasZeladores' | 'LimpezasSalas',
}

const LineChart = ({chartData}: LineChartProps) => {
    if(!chartData){
        return
    }

    return (
        <View className="  h-6 flex-row rounded-lg gap-0.5 overflow-hidden">
            {
                chartData.map((item, index) => (
    
                        <View
                            key={index}
                            style={{ 
                                width: `${item.percentage}%`, 
                                backgroundColor: item.color 
                            }}
                            className=" items-center justify-center"
                        >
                            {/* <Text className=" text-white text-sm self-center text-center">{item.value}</Text> */}
                        </View>
                ))
            }
        </View>

    )
}

const LegendChart = ({chartData}: LegendChartProps) => {
    if(!chartData){
        return
    }

    return (
        <View className=" flex-col gap-1 justify-between flex-wrap">
            {
                chartData.map((item, index) => (
                    <View key={index} className="  items-center flex-row gap-1 mt-1">
                        <View className=" rounded-full aspect-square h-3" style={{backgroundColor: item.color}}/>
                        <Text className=" text-base font-bold" style={{color: item.color}}>{item.label + ': ' + item.value + ` (${item.percentage.toFixed(1)}%)`}</Text>
                    </View>
                ))
            }
        </View>

    )
}

interface FullLineChartProps{
    title: string,
    chartData?: chartData[]
}

const FullLineChart = ({title, chartData}: FullLineChartProps) => {


    return(
        <View className="gap-3 bg-gray-100 rounded-lg p-3">
            <Text className=" text-lg font-bold mt-2">{title}</Text>
            <LineChart chartData={chartData } />
            <LegendChart chartData={ chartData } />
        </View>

    )
}

const statsCardStyle =  "p-4 shadow-md gap-4 bg-white rounded-lg flex-col"

interface velocidadeLimpezaConditionalParams{
    item: RegistroSala,
    type: 'Rapida' | 'Media' | 'Lenta'
}

const velocidadeLimpezaConditional = ({item, type} : velocidadeLimpezaConditionalParams): Boolean => {
    if (!item.data_hora_fim){
        return false
    }

    const timeDiference = getSecondsUtcDiference(item.data_hora_inicio, item.data_hora_fim)

    if (type === 'Rapida'){
        return (timeDiference < 1200)
    }
    if (type === 'Media'){
        return (timeDiference < 2400 && timeDiference >= 1200)
    }
    if (type === 'Lenta'){
        return (timeDiference > 2400)
    }

    return false
}

export default function EstatisticasLimpeza() {

    const authContext = useContext(AuthContext)

    if(!authContext){
        return
    }

    const {usersGroups} = authContext

    const navigation = useNavigation<NavigationProp<AdminStackParamList>>()

    const [refreshing, setRefreshing] = useState(false)

    const [statusSalas, setStatusSalas] = useState<null| statusSalas>(null)
    const [statusLimpezasConcluidas, setStatusLimpezasConcluidas] = useState<null | statusLimpezasConcluidas>(null)
    const [limpezasEmAndamento, setLimpezasEmAndamento] = useState<RegistroSala[]>([])
    const [zeladores, setZeladores] = useState<Usuario[]>([])

    const carregarEstatisticas = async () => {
        setRefreshing(true)
        await carregarSalas()
        await carregarRegistros()
        await carregarZeladores()
        setRefreshing(false)
    }

    useFocusEffect(useCallback(() => {
        carregarEstatisticas()
    }, []))

    const navigateToEstatisticaCardList = (type:  'LimpezasEmAndamento' | 'LimpezasZeladores' | 'LimpezasSalas') => {

        navigation.navigate('EstatisticaCardList', {type: type})
    }

    const carregarSalas = async () => {
        const obterSalasResult = await obterSalas({})
        if(!obterSalasResult.success){
            showErrorToast({errMessage: 'Erro ao carregar os status das salas'})
            return
        }

        const salasList = obterSalasResult.data;

        const salasCount = salasList.length

        const salaLimpaCount = salasList.filter(item => item.status_limpeza === 'Limpa').length
        const salaSujaCount = salasList.filter(item => item.status_limpeza === 'Suja').length
        const salaLimpezaPendenteCount = salasList.filter(item => item.status_limpeza === 'Limpeza Pendente').length
        const salaEmLimpezaCount = salasList.filter(item => item.status_limpeza === 'Em Limpeza').length

        const salaLimpaPercentage = salaLimpaCount === 0? 0 : (salaLimpaCount/salasCount) * 100
        const salaSujaPercentage = salaSujaCount === 0? 0 : (salaSujaCount/salasCount) * 100
        const salaLimpezaPendentePercentage = salaLimpezaPendenteCount === 0? 0 : (salaLimpezaPendenteCount/salasCount) * 100
        const salaEmLimpezaPercentage = salaEmLimpezaCount === 0? 0 : (salaEmLimpezaCount/salasCount) * 100

        const salaAtivaCount = salasList.filter(item => item.ativa === true).length
        const salaInativaCount = salasList.filter(item => item.ativa === false).length

        const salaAtivaPercentage = salasCount === 0? 0: (salaAtivaCount/salasCount) * 100
        const salaInativaPercentage = salasCount === 0? 0: (salaInativaCount/salasCount) * 100

        const statusLimpezaData: chartData[] = [
            {
                label: 'Limpa',
                value: salaLimpaCount,
                color: colors.sgreen,
                percentage: salaLimpaPercentage
            },
            {
                label: 'Limpeza Pendente',
                value: salaLimpezaPendenteCount,
                color: colors.syellow,
                percentage: salaLimpezaPendentePercentage
            },
            {
                label: 'Suja',
                value: salaSujaCount,
                color: colors.sred,
                percentage: salaSujaPercentage
            },
            {
                label: 'Em Limpeza',
                value: salaEmLimpezaCount,
                color: colors.sgray,
                percentage: salaEmLimpezaPercentage
            },
        ]

        const statusSalaData: chartData[] = [
            {
                label: 'Ativa',
                value: salaAtivaCount,
                color: colors.sgreen,
                percentage: salaAtivaPercentage
            },
            {
                label: 'Inativa',
                value: salaInativaCount,
                color: colors.syellow,
                percentage: salaInativaPercentage
            },
        ]

        setStatusSalas({
            salasCount,
            statusLimpezaData,
            statusSalaData,
        })
    
        
    }

    const carregarRegistros = async () => {
        const getRegistrosServiceResult = await getRegistrosService({})
        if(!getRegistrosServiceResult.success){
            showErrorToast({errMessage: getRegistrosServiceResult.errMessage})
            return;
        }

        const limpezas = getRegistrosServiceResult.data
        const limpezasCount = limpezas.length

        const limpezasEmAndamento = limpezas.filter(item => item.data_hora_fim === null)
        setLimpezasEmAndamento(limpezasEmAndamento)
        // const limpezasEmAndamentoCount = limpezasEmAndamento.length

        const limpezasConcluidas = limpezas.filter(item => item.data_hora_fim !== null)
        const limpezasConcluidasCount = limpezasConcluidas.length
        
        const limpezaRapidaCount = limpezasConcluidas.filter(item => velocidadeLimpezaConditional({item, type: 'Rapida'})).length
        const limpezaMediaCount = limpezasConcluidas.filter(item => velocidadeLimpezaConditional({item, type: 'Media'})).length
        const limpezaLentaCount = limpezasConcluidas.filter(item => velocidadeLimpezaConditional({item, type: 'Lenta'})).length

        const limpezaRapidaPercentage = limpezaRapidaCount === 0? 0 : (limpezaRapidaCount/limpezasConcluidasCount) * 100
        const limpezaMediaPercentage = limpezaMediaCount === 0? 0 : (limpezaMediaCount/limpezasConcluidasCount) * 100
        const limpezaLentaPercentage = limpezaLentaCount === 0? 0 : (limpezaLentaCount/limpezasConcluidasCount) * 100

        const statusVelocidadeData: chartData[] = [
            {
                label: 'Rápida',
                value: limpezaRapidaCount,
                percentage: limpezaRapidaPercentage,
                color: colors.sgreen
            },
            {
                label: 'Média',
                value: limpezaMediaCount,
                percentage: limpezaMediaPercentage,
                color: colors.syellow
            },
            {
                label: 'Lenta',
                value: limpezaLentaCount,
                percentage: limpezaLentaPercentage,
                color: colors.sred
            },
        ]

        setStatusLimpezasConcluidas({
            limpezasConcluidasCount,
            statusVelocidadeData,
        })

        // console.log(limpezaRapidaCount)
    }

    const carregarZeladores = async () => {
        const obterUsuariosResult = await obterUsuarios(usersGroups.filter(item => item.id === 1)[0].name)
        if(!obterUsuariosResult.success){
            showErrorToast({errMessage: obterUsuariosResult.errMessage})
            return
        }

        const zeladores = obterUsuariosResult.data

        setZeladores(zeladores)



    }
    

    return (
        <SafeAreaView edges={['top']} className=" flex-1 bg-gray-100 pb-0 flex-col">

            <View className=" bg-white py-2 pt-4 px-5 flex-row gap-6 items-center border-b-2 border-gray-100">
                <Text className=" text-2xl" >Estatísticas</Text>
            </View>
            <ScrollView 
                className=" mt-4 mb-4"
                contentContainerClassName=" gap-12 px-4 py-4"
                refreshControl={<RefreshControl refreshing={refreshing}/>}
            >
                <View className={statsCardStyle}>
                    <View className=" flex-col gap-2 justify-between items-center mb-2">
                        <Text className=" text-2xl font-bold text-center">Estatísticas salas</Text>
                        <Text className=" text-lg font-bold text-center">Total de salas: {statusSalas?.salasCount}</Text>
                    </View>
                    <FullLineChart title="Status de limpeza:" chartData={statusSalas?.statusLimpezaData}/>
                    <FullLineChart title="Status de salas:" chartData={statusSalas?.statusSalaData}/>
                </View>

                <View className={statsCardStyle}>
                    <View className=" flex-col gap-2 justify-between items-center mb-2">
                        <Text className=" text-2xl font-bold text-center">Estatísticas de limpezas concluídas</Text>
                        <Text className=" text-lg font-bold text-center">Total de limpezas concluídas: {statusLimpezasConcluidas?.limpezasConcluidasCount}</Text>
                    </View>
                    <FullLineChart title="Velocidades de limpezas:" chartData={statusLimpezasConcluidas?.statusVelocidadeData}/>
                </View>

                <View className={statsCardStyle}>
                    <View className=" flex-col gap-2 justify-between items-center mb-2">
                        <Text className=" text-2xl font-bold text-center">Limpezas em andamento</Text>
                        <Text className=" text-lg font-bold text-center">Total de limpezas em andamento: {limpezasEmAndamento.length}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigateToEstatisticaCardList('LimpezasEmAndamento')} className=" rounded-full bg-gray-100 flex-row p-2 gap-4 justify-center items-center self-center px-8">
                        <Text className=" text-bold text-lg">Ver limpezas em andamento</Text>
                        <Ionicons name="chevron-forward-outline" color={colors.sgray} size={20} />
                    </TouchableOpacity>
                </View>

                <View className={statsCardStyle}>
                    <View className=" flex-col gap-2 justify-between items-center mb-2">
                        <Text className=" text-2xl font-bold text-center">Limpezas de zeladores</Text>
                        <Text className=" text-lg font-bold text-center">Total de zeladores: {zeladores.length}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigateToEstatisticaCardList('LimpezasZeladores')} className=" rounded-full bg-gray-100 flex-row p-2 gap-4 justify-center items-center self-center px-8">
                        <Text className=" text-bold text-lg">Ver limpezas de zeladores</Text>
                        <Ionicons name="chevron-forward-outline" color={colors.sgray} size={20} />
                    </TouchableOpacity>

                </View>

                <View className={statsCardStyle}>
                    <View className=" flex-col gap-2 justify-between items-center mb-2">
                        <Text className=" text-2xl font-bold text-center">Limpezas de salas</Text>
                        <Text className=" text-lg font-bold text-center">Total de salas: {limpezasEmAndamento.length}</Text>
                    </View>
                </View>

                {/* Zeladores */}
                {/* Salas */}


            </ScrollView>

        </SafeAreaView>
    )
}