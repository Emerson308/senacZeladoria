import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useCallback, useState } from "react";
import { colors } from "../../styles/colors";
import { obterSalas } from "../servicos/servicoSalas";
import { showErrorToast } from "../utils/functions";
import { useFocusEffect } from "@react-navigation/native";


interface chartData{
    label: string,
    value: number,
    color: string,
    percentage: number
}

interface statusSala{
    salasCount: number,
    statusLimpezaData: chartData[]
    statusSalaData: chartData[]

}

interface LineChartProps{
    chartData?: chartData[]
}

interface LegendChartProps{
    chartData?: chartData[]
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
        <View className=" flex-row justify-between flex-wrap">
            {
                chartData.map((item, index) => (
                    <View key={index} className=" justify-center items-center flex-row gap-1 mt-1">
                        <View className=" rounded-full aspect-square h-3" style={{backgroundColor: item.color}}/>
                        <Text className=" text-base font-bold" style={{color: item.color}}>{item.label + ': ' + item.value + ` (${item.percentage.toFixed(1)}%)`}</Text>
                    </View>
                ))
            }
        </View>

    )
}


export default function EstatisticasLimpeza() {

    const [refreshing, setRefreshing] = useState(false)
    const [statusSalas, setStatusSalas] = useState<null| statusSala>(null)

    useFocusEffect(useCallback(() => {
        carregarSalas()
    }, []))

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
    

    return (
        <SafeAreaView edges={['top']} className=" flex-1 bg-gray-100 pb-4 flex-col">
            <View className=" bg-white py-2 pt-4 px-5 flex-row gap-6 items-center border-b-2 border-gray-100">
                <Text className=" text-2xl" >Estatísticas</Text>
            </View>
            <ScrollView 
                className=" my-4 py-4"
                contentContainerClassName=" gap-4 px-4"
                refreshControl={<RefreshControl refreshing={refreshing}/>}
            >
                <View className=" p-4 shadow-md gap-4 bg-white rounded-lg flex-col">
                    <View className=" flex-row justify-between items-center mb-2">
                        <Text className=" text-2xl font-bold">Estatísticas salas</Text>
                        <Text className=" text-lg font-bold">Total de salas: {statusSalas?.salasCount}</Text>
                    </View>
                    <View className="gap-2 bg-gray-100 rounded-lg p-3">
                        <Text className=" text-lg font-bold mt-2">Status de limpeza:</Text>
                        <LineChart chartData={statusSalas?.statusLimpezaData} />
                        <LegendChart chartData={ statusSalas?.statusLimpezaData} />
                    </View>
                    <View className="gap-2 bg-gray-100 rounded-lg p-3">
                        <Text className=" text-lg font-bold mt-2">Status de salas:</Text>
                        <LineChart chartData={statusSalas?.statusSalaData}/>
                        <LegendChart chartData={ statusSalas?.statusSalaData} />
                    </View>
                </View>

                {/* Estatisticas limpeza concluidas (Limpezas demoradas, rapidas e etc ) */}
                {/* Limpezas em andamento */}
                {/* Zeladores */}
                {/* Salas */}


            </ScrollView>

        </SafeAreaView>
    )
}