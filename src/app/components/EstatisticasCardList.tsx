import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { TouchableRipple, ActivityIndicator } from "react-native-paper";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {Ionicons} from '@expo/vector-icons'
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { AdminStackParamList, TelaEstatisticaCardList } from "../navigation/types/StackTypes";
import { RegistroSala, Sala, Usuario } from "../types/apiTypes";
import LimpezasAndamentoCard from "./cards/LimpezasAndamentoCard";
import { getSecondsUtcDiference, showErrorToast } from "../utils/functions";
import { getRegistrosService } from "../servicos/servicoLimpezas";
import { obterSalas } from "../servicos/servicoSalas";
import { AuthContext } from "../AuthContext";
import { obterUsuarios } from "../servicos/servicoUsuarios";
import { chartData } from "../screens/EstatisticasLimpeza";
import { colors } from "../../styles/colors";
import { apiURL } from "../api/axiosConfig";


// type RenderEstatisticasCardListsProps = { listType: 'LimpezasEmAndamento', renderList: RegistroSala[] } | { listType: 'LimpezasZeladores', renderList: Usuario[] } | { listType: 'LimpezasSalas', renderList: Sala[] }


interface LineChartProps{
    chartData: chartData[]
}

const LineChart = ({chartData}: LineChartProps) => {
    if(!chartData){
        return
    }

    const limpezaCountCondicional = chartData.some(item => item.value > 0)

    return (
        <View className=" flex-1 justify-between">
            <View className="  h-3 flex-row rounded-lg gap-0.5 overflow-hidden">
                {
                    limpezaCountCondicional ? null : 
                    <View className=" bg-gray-300 w-full"/> 
                }
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
            <View className=" justify-between flex-wrap flex-row gap-1">
                {
                    chartData.map((item, index) => (
                        <View key={index} className="  items-center flex-row gap-1">
                            <View className=" rounded-full aspect-square h-3" style={{backgroundColor: item.color}}/>
                            <Text className=" text-xs font-bold" style={{color: item.color}}>{item.label + ': ' + item.value + ` (${item.percentage.toFixed(1)}%)`}</Text>
                        </View>
                    ))
                }
            </View>

        </View>

    )
}


interface EstatisticaZeladorCardProps{
    zelador : Zelador,
    onPress?: () => void
}

const EstatisticaZeladorCard = ({
    zelador,
    onPress
}: EstatisticaZeladorCardProps) => {



    return (
        <TouchableRipple
            borderless={true}
            onPress={onPress} 
            className=" rounded-xl shadow-md bg-white px-4 h-36"
        >
            <View className=" flex-1 flex-row gap-4" >
                <View className=" aspect-square my-4 rounded-md">
                    {zelador.profile.profile_picture ? 
                        <Image
                            className=" flex-1 aspect-square border-2 rounded-md"
                            source={{uri: apiURL + zelador.profile.profile_picture}}
                        />
                        :
                        <View className=" flex-1 border-2 bg-sblue rounded-md justify-center">
                            <Text className=" text-white text-4xl text-center">{zelador.username.charAt(0).toUpperCase()}</Text>
                        </View>
                    }
                </View>
                <View className=" flex-col flex-1 my-4 gap-3">
                    <View className=" flex-row justify-between items-center gap-3">
                        <Text className=" text-xl font-bold">{zelador.username}</Text>
                        <Text className=" text-base font-bold">Limpezas: {zelador.limpezasCount}</Text>
                    </View>
                    <View className=" flex-1 justify-center" >
                        <LineChart chartData={zelador.statusVelocidades} /> 
                    </View>
                </View>
            </View>
        </TouchableRipple>
    )
}

interface RenderEstatisticasCardListsProps{
    listType: 'LimpezasEmAndamento' | 'LimpezasZeladores' | 'LimpezasSalas'
    limpezasEmAndamento: RegistroSala[],
    salas: Sala[],
    zeladores: Zelador[],
    onPress?: () => void,
    navigateToLimpeza?: (registro: RegistroSala) => void,
    refreshing: boolean,
    carregarCardList: () => void
}

const RenderEstatisticasCardLists = ({
    listType,
    limpezasEmAndamento,
    salas,
    zeladores,
    onPress,
    navigateToLimpeza,
    refreshing,
    carregarCardList
}: RenderEstatisticasCardListsProps) => {

    if(listType === 'LimpezasEmAndamento'){
        return (
            <FlatList
                data={limpezasEmAndamento}
                keyExtractor={item => String(item.id)}
                className=" "
                contentContainerClassName=" gap-4 px-4 py-4"
                nestedScrollEnabled={true}
                onRefresh={carregarCardList}
                refreshing={refreshing}
                renderItem={(item) => <LimpezasAndamentoCard type="AdminData" {...item.item} onPress={() => navigateToLimpeza?.(item.item)}/>}
            />
        )
    }
    
    if(listType === 'LimpezasZeladores'){
        return (
            <FlatList
                data={zeladores}
                keyExtractor={item => String(item.id)}
                className=" "
                contentContainerClassName=" gap-4 px-4 py-4"
                nestedScrollEnabled={true}
                onRefresh={carregarCardList}
                refreshing={refreshing}
                renderItem={(item) => <EstatisticaZeladorCard zelador={item.item} />}
            />
    
        )
    }

    if(listType === 'LimpezasSalas'){
        return null
        // return (
        //     <FlatList
        //         data={renderList}
        //         keyExtractor={item => String(item.id)}
        //         className=" "
        //         contentContainerClassName=" gap-4 px-4 py-4"
        //         nestedScrollEnabled={true}
        //         renderItem={(item) => <LimpezasAndamentoCard type="AdminData" {...item.item} />}
        //     />
    
        // )
    }

    return (null)
}

const getLimpezaStatusVelocidade = (inicio: string, fim: string | null) => {
    if(!fim){
        return
    }
    const seconds = getSecondsUtcDiference(inicio, fim)

    if(seconds < 1200) return 'Rapida'
    if(seconds < 2400 && seconds > 1200) return 'Media'
    if(seconds > 3600) return 'Lenta'

}

type Zelador = {
    limpezasCount: number,
    statusVelocidades: chartData[]
} & Usuario

export default function EstatisticasCardList(){

    const authContext = useContext(AuthContext)
    if(!authContext){
        return
    }

    const {usersGroups} = authContext
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>()
    const route = useRoute<TelaEstatisticaCardList['route']>()
    const {type} = route.params
    const [carregando, setCarregando] = useState(false)
    const [refreshing, setRefreshing] = useState(false)


    const [registros, setRegistros] = useState<RegistroSala[]>([])
    const [salas, setSalas] = useState<Sala[]>([])
    const [limpezasEmAndamento, setLimpezasEmAndamento] = useState<RegistroSala[]>([])
    const [zeladores, setZeladores] = useState<Zelador[]>([])



    useEffect(() => {
        setCarregando(true)
        carregarCardList().then(() => setCarregando(false))
    }, [])

    const cardNavigate = ({registro}: {registro?: RegistroSala}) => {
        if(type === 'LimpezasEmAndamento'){
            if(!registro){
                return
            }
            navigation.navigate('Limpeza', {registroSala: registro, type: 'Observar'})
        }
    }

    const carregarCardList = async () => {
        setRefreshing(true)
        const limpezas = await carregarRegistros()
        
        if(!limpezas){
            return;
        }
        
        const limpezasEmAndamento = limpezas.filter(item => item.data_hora_fim === null)
        const limpezasConcluidas = limpezas.filter(item => item.data_hora_fim !== null)

        if(type === 'LimpezasEmAndamento'){
            setLimpezasEmAndamento(limpezasEmAndamento)
        }

        if(type === 'LimpezasZeladores'){
            await carregarZeladores(limpezasConcluidas)
        }
        setRefreshing(false)
    }

    const carregarRegistros = async () => {
        const getRegistrosServiceResult = await getRegistrosService({})
        if(!getRegistrosServiceResult.success){
            showErrorToast({errMessage: getRegistrosServiceResult.errMessage})
            return;
        }

        const limpezas = getRegistrosServiceResult.data
        const limpezasCount = limpezas.length

        return limpezas

        const limpezasEmAndamento = limpezas.filter(item => item.data_hora_fim === null)

   }    

    const carregarSalas = async () => {
        const obterSalasResult = await obterSalas({})
        if(!obterSalasResult.success){
            showErrorToast({errMessage: 'Erro ao carregar os status das salas'})
            return
        }

        const salasList = obterSalasResult.data;

        const salasCount = salasList.length
    }

    const carregarZeladores = async (limpezas: RegistroSala[]) => {
        const obterUsuariosResult = await obterUsuarios(usersGroups.filter(item => item.id === 1)[0].name)
        if(!obterUsuariosResult.success){
            showErrorToast({errMessage: obterUsuariosResult.errMessage})
            return
        }

        const zeladores = obterUsuariosResult.data

        const zeladoresChart: Zelador[] = zeladores.map(zelador => {

            const limpezasZelador = limpezas.filter(limpeza => zelador.username === limpeza.funcionario_responsavel)
            const limpezasZeladorCount = limpezasZelador.length

            const limpezasRapidas = limpezasZelador.filter(limpeza => getLimpezaStatusVelocidade(limpeza.data_hora_inicio, limpeza.data_hora_fim) === 'Rapida')
            const limpezasMedias = limpezasZelador.filter(limpeza => getLimpezaStatusVelocidade(limpeza.data_hora_inicio, limpeza.data_hora_fim) === 'Media')
            const limpezasLentas = limpezasZelador.filter(limpeza => getLimpezaStatusVelocidade(limpeza.data_hora_inicio, limpeza.data_hora_fim) === 'Lenta')

            const limpezasRapidasCount = limpezasRapidas.length
            const limpezasMediasCount = limpezasMedias.length
            const limpezasLentasCount = limpezasLentas.length

            const limpezasRapidasPercentage = limpezasRapidasCount === 0 ? 0 : (limpezasRapidasCount / limpezasZeladorCount) * 100
            const limpezasMediasPercentage = limpezasMediasCount === 0 ? 0 : (limpezasMediasCount / limpezasZeladorCount) * 100
            const limpezasLentasPercentage = limpezasLentasCount === 0 ? 0 : (limpezasLentasCount / limpezasZeladorCount) * 100

            const statusVelocidades: chartData[] = [
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
                    label: 'Lentas',
                    color: colors.sred,
                    value: limpezasLentasCount,
                    percentage: limpezasLentasPercentage
                },
            ]


            

            return {
                ...zelador,
                limpezasCount: limpezasZeladorCount,
                statusVelocidades
            }
        })

        setZeladores(zeladoresChart)





    }


    const getCardListProps = () => {
        if(type === 'LimpezasEmAndamento'){
            return {
                title: 'Limpezas em andamento',
                listCount: `Total de limpezas em andamento: ${limpezasEmAndamento.length}`
            }
        }

        if(type === 'LimpezasSalas'){
            return {
                title: 'Limpezas de salas',
                listCount: `Total de limpezas em andamento: ${salas.length}`
            }
        }

        if(type === 'LimpezasZeladores'){
            return {
                title: 'Limpezas de zeladores',
                listCount: `Total de zeladores: ${zeladores.length}`
            }
        }

    }
    
    const cardListProps = getCardListProps()

    if(carregando){
        return( 
            <SafeAreaView className='flex-1 bg-gray-50 justify-center p-16'>
                <TouchableOpacity onPress={async () => await carregarCardList()}>
                    <ActivityIndicator size={80}/>
                </TouchableOpacity>
                <Text className=' mt-2 text-center'>Carregando {cardListProps?.title}...</Text>
            </SafeAreaView>
            
        )        
    }

    return(
        <SafeAreaView className="py-4 flex-1 rounded-xl bg-gray-100 flex-col">
            <View className=" flex-row px-4 items-center gap-4">
                <TouchableRipple onPress={navigation.goBack} borderless={true} className=" rounded-full p-3">
                    <Ionicons name="arrow-back" size={24} />
                </TouchableRipple>
                <Text className=" text-2xl flex-1 font-bold" >{cardListProps?.title}</Text>

            </View>
            <View className=" border-b border-gray-300 my-2"/>
            <Text className=" px-4 my-4 font-bold text-lg">{cardListProps?.listCount}</Text>
            <View className=" flex-1">
                <RenderEstatisticasCardLists
                    listType={type}
                    limpezasEmAndamento={limpezasEmAndamento}
                    salas={salas}
                    zeladores={zeladores}
                    navigateToLimpeza={(registro) => cardNavigate({registro})}
                    refreshing={refreshing}
                    carregarCardList={ async () => await carregarCardList()}
                />
            </View>
        </SafeAreaView>
    )
}