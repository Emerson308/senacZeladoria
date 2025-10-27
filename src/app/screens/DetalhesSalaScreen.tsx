// import { View } from "react-native-reanimated/lib/typescript/Animated";
import { View, ScrollView, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native'
import { Card, Button, ActivityIndicator, Appbar, TouchableRipple } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TelaDetalhesSala } from '../navigation/types/StackTypes';
import React, { useContext, useEffect, useState } from 'react';
import { obterDetalhesSala, excluirSalaService} from '../servicos/servicoSalas';
import { iniciarLimpezaSala, marcarSalaComoSujaService, getRegistrosService } from '../servicos/servicoLimpezas';
import { RegistroSala, Sala } from '../types/apiTypes';
import { colors } from '../../styles/colors';
import { formatarDataISO, showErrorToast } from '../utils/functions';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { apiURL } from '../api/axiosConfig';
import Toast from 'react-native-toast-message';
import HandleConfirmation from '../components/HandleConfirmation';
import { useSalas } from '../contexts/SalasContext';
import { useAuthContext } from '../contexts/AuthContext';


type editingSalaType = 'edit' | 'delete' | 'startCleaning' | 'markAsDirty';

interface confirmationModalTexts{
    headerText: string;
    bodyText: string;
    confirmText: string;
    cancelText?: string;
}

interface confirmationModalProps {
    confirmationTexts: confirmationModalTexts;
    type: 'confirmAction' | 'destructiveAction' | 'reportAction';
}

export default function DetalhesSalaScreen(){    

    const {
        iniciarLimpeza,
        marcarSalaComoSuja,
        excluirSala,
        carregarSalas,
    } = useSalas()
    const {user, userRole} = useAuthContext()
    if(!user){
        return null
    }

    const route = useRoute<TelaDetalhesSala['route']>()
    const navigation = useNavigation()
    const {id} = route.params;

    const [carregando, setCarregando] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [dadosSala, setDadosSala] = useState<Sala|null>(null)
    const [limpezasEmAndamento, setLimpezasEmAndamento] = useState<RegistroSala[]>([])

    const [observacao, setObservacao] = useState('')
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
    const [confirmationModalProps, setConfirmationModalProps] = useState<confirmationModalProps>({
        confirmationTexts: {
            headerText: '',
            bodyText: '',
            confirmText: '',
            cancelText: ''
        },
        type: 'confirmAction'
    });
    const [editingSalaType, setEditingSalaType] = useState<editingSalaType| null>(null)

    const carregarLimpezasAndamento = async () => {
        // console.log(limpezasEmAndamento)
        // console.log(limpezasEmAndamento.length)
        if(!user.groups.includes(1)){
            return
        }

        if(!dadosSala?.qr_code_id){
            return
        }
        
        const username = user.username
        const getAllRegistrosServiceResult = await getRegistrosService({
            username,
            sala_uuid: dadosSala.qr_code_id
        })
        if(!getAllRegistrosServiceResult.success){
            showErrorToast({errMessage: getAllRegistrosServiceResult.errMessage})
            return
        }
        
        const limpezasAndamento = getAllRegistrosServiceResult.data.filter(item => {
            return item.data_hora_fim === null
        })
        
        setLimpezasEmAndamento(limpezasAndamento)

        console.log(limpezasAndamento)
        
        return
        
    }
    

    const carregarSala = async () => {
        // setCarregando(true)
        setRefreshing(true)
        const obterDetalhesSalaResult = await obterDetalhesSala(id);
        if(!obterDetalhesSalaResult.success){
            showErrorToast({errMessage: obterDetalhesSalaResult.errMessage})
            return;
        }
        
        setDadosSala(obterDetalhesSalaResult.data)
        console.log(dadosSala)
        setRefreshing(false)
    }

    const handleIniciarLimpeza = () => {
        setEditingSalaType('startCleaning')
        setConfirmationModalProps({
            confirmationTexts: {
                headerText: 'Iniciar limpeza',
                bodyText: 'Tem certeza de que deseja iniciar a limpeza dessa sala?',
                confirmText: 'Iniciar limpeza'
            },
            type: 'confirmAction'
        })
        setConfirmationModalVisible(true)
    }

    const handleMarcarSalaComoSuja = () => {
        setEditingSalaType('markAsDirty')
        setConfirmationModalProps({
            confirmationTexts: {
                headerText: 'Relatar sala suja',
                bodyText: 'Tem certeza de que deseja relatar esta sala como suja?',
                confirmText: 'Relatar como suja',
            },
            type: 'reportAction'
        });
        setConfirmationModalVisible(true);

    }

    const handleExcluirSala = () => {
        setEditingSalaType('delete')
        setConfirmationModalProps({
            confirmationTexts: {
                headerText: 'Excluir sala',
                bodyText: 'Tem certeza de que deseja excluir esta sala?',
                confirmText: 'Excluir',
            },
            type: 'destructiveAction'
        });
        setConfirmationModalVisible(true);
    }
    
    const onCancel = () => {
        setConfirmationModalVisible(false);
        setObservacao('');
    }

    const onConfirm = async () => {
        if(!dadosSala){
            return
        }
        if(editingSalaType === 'delete'){
            await excluirSala(dadosSala.qr_code_id);
        } else if(editingSalaType === 'startCleaning'){
            await iniciarLimpeza(dadosSala.qr_code_id);
        } else if(editingSalaType === 'markAsDirty'){
            await marcarSalaComoSuja(dadosSala.qr_code_id, observacao);
        }
        setCarregando(true)

        onCancel()
        
        
        if(editingSalaType !== 'delete'){
            await carregarTudo()
            if (editingSalaType === 'startCleaning'){
                await carregarSalas()
            }
            setCarregando(false)
            return
        }

        navigation.goBack()
    }

    const carregarTudo = async () => {
        await carregarSala()
    }
    
    useFocusEffect( React.useCallback(() => {
        setCarregando(true)
        carregarTudo().then(() => setCarregando(false))
        
    }, []))

    useEffect(() => {
        carregarLimpezasAndamento()
    }, [dadosSala])

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
        info_label: "text-xl font-regular text-gray-400 uppercase tracking-wider ",
        info_values: " text-2xl font-semibold text-gray-800 break-words"
    }

    // console.log(limpezasEmAndamentoSala)


    const visibleIniciarLimpeza = 
        user.groups.includes(1) && dadosSala.ativa &&
        (dadosSala.status_limpeza !== 'Limpa' && dadosSala.status_limpeza !== 'Em Limpeza')

    const visibleReportarSujeira = 
        user.groups.includes(2) && dadosSala.ativa &&
        (dadosSala.status_limpeza !== 'Suja' && dadosSala.status_limpeza !== 'Em Limpeza')

    const visibleSalaInativa = !dadosSala.ativa

    const adminButtonsConditionStyle = ((visibleIniciarLimpeza !== visibleReportarSujeira) || !visibleReportarSujeira)

    const visibleEditarSala = userRole === 'admin'

    const visibleExcluirSala = userRole === 'admin' && dadosSala.ativa

    const visibleButtons = [visibleSalaInativa, visibleEditarSala, visibleExcluirSala, visibleIniciarLimpeza, visibleReportarSujeira]

    const visibleDetalhesButtons = visibleButtons.some(item => item)


    return(
        <SafeAreaView  className="flex-1 flex-col bg-gray-100 p-1">
            <HandleConfirmation
                visible={confirmationModalVisible}
                onConfirm={async () => await onConfirm()}
                onCancel={onCancel}
                type={confirmationModalProps.type}
                confirmationTexts={confirmationModalProps.confirmationTexts}
                observacao={observacao}
                setObservacao={setObservacao}
            />
            <View className='text-center flex-col'>
                <View className=" bg-sblue rounded-lg rounded-b-none py-4 px-5 flex-row gap-6 items-center border-b-2 border-gray-100">
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Ionicons
                            name='arrow-back'
                            color={'white'}
                            size={24}
                        />
                    </TouchableOpacity>
                    <Text className=" text-2xl text-white flex-1" >Detalhes da Sala</Text>
                    {
                        user.groups.includes(1) || userRole === 'admin' ?
                        <TouchableOpacity onPress={() => navigation.navigate('Registros', {sala: dadosSala})}>
                            <Ionicons
                                name='stats-chart'
                                color={'white'}
                                size={24}
                            />
                        </TouchableOpacity>
                        : null
                    }

                </View>

            </View>
            <ScrollView className=" mt-4 flex-1" 
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                    carregarTudo()
                }}/>}
            >
                {
                    dadosSala.imagem
                    ? (
                        <ImageBackground
                            className=' flex-row mx-4 aspect-video justify-center'
                            source={{uri: apiURL + dadosSala.imagem}}
                        >
                            <View className=' bg-black/40 flex-1 px-4 items-center justify-center '>
                                <Text className=' text-3xl text-center font-bold mb-3 text-white'>{dadosSala.nome_numero}</Text>
                            </View>
                        </ImageBackground>
                    )
                    : (
                        <View className=' bg-black/40 aspect-video mx-4 px-4 items-center justify-center'>
                            <Text className=' text-3xl text-center font-bold mb-3 text-white'>{dadosSala.nome_numero}</Text>
                        </View>
                    )
                }
                <View className=' p-5 pt-0 pb-10 md:p-8'>

                    {
                        (dadosSala.detalhes_suja && user.groups.includes(1)) && 
                        <View className=' bg-sred/5 py-4 px-4 my-4 border border-sred rounded-lg'>
                            <Text className=' text-xl text-sred mb-2'>Sujeira reportada</Text>
                            <Text className=' text-sred'>Reportado por: {dadosSala.detalhes_suja.reportado_por}</Text>
                            <Text className=' text-sred'>Horário: {formatarDataISO(dadosSala.detalhes_suja.data_hora)}</Text>
                            <Text className=' text-sred'>Observações: {dadosSala.detalhes_suja.observacoes ? dadosSala.detalhes_suja.observacoes : 'Sem observações'}</Text>
                        </View>
                    }

                    <View className={estilosTailwind.item}>
                        <View className='flex-row gap-2 mb-3 items-center'>
                            {/* <Ionicons size={24} name='browsers-outline' color={colors.sgray} className=''/> */}
                            <MaterialCommunityIcons size={24} name='broom' color={colors.sgray}/>
                            <Text className={estilosTailwind.info_label + ''}>Status de limpeza</Text>
                        </View>
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
                                <View className='flex-row gap-2 mb-3 items-center'>
                                    {/* <Ionicons size={24} name='document-text-outline' color={colors.sgray} className=''/> */}
                                    <MaterialCommunityIcons size={24} name='file-document-outline' color={colors.sgray}/>
                                    <Text className={estilosTailwind.info_label}>Instruções</Text>
                                </View>
                                <Text className={estilosTailwind.info_values}>{dadosSala.instrucoes ? dadosSala.instrucoes : 'Sem instruções'}</Text>
                            </View>

                            <View className={estilosTailwind.item}>
                                <View className='flex-row gap-2 mb-3 items-center'>
                                    {/* <Ionicons size={24} name='time-outline' color={colors.sgray} className=''/> */}
                                    <MaterialCommunityIcons size={24} name='update' color={colors.sgray}/>
                                    <Text className={estilosTailwind.info_label}>Última limpeza</Text>
                                </View>
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
                                <View className='flex-row gap-2 mb-3 items-center'>
                                    <Ionicons size={24} name='timer-outline' color={colors.sgray} className=''/>
                                    <Text className={estilosTailwind.info_label}>Validade da limpeza</Text>
                                </View>
                                <Text className={estilosTailwind.info_values}>{dadosSala.validade_limpeza_horas} horas</Text>
                            </View>

                            <View className={estilosTailwind.item + ''}>
                                <View className='flex-row gap-2 mb-3 items-center'>
                                    <Ionicons size={24} name='key-outline' color={colors.sgray} className=''/>
                                    <Text className={estilosTailwind.info_label}>Status da sala</Text>
                                </View>
                                <Text className={(dadosSala.ativa) ? 'bg-sgreen/20 px-4 py-1 rounded-md text-2xl text-sgreen' + estilosTailwind.info_values : 'bg-sred/20 px-4 py-1 rounded-md text-2xl text-sred' + estilosTailwind.info_values}>{dadosSala.ativa ? 'Ativa' : 'Inativa'}</Text>
                            </View>
                                    
                            </>
                        ) : null
                    }

                    <View className={estilosTailwind.item + ''}>
                        <View className='flex-row gap-2 mb-3 items-center'>
                            <MaterialCommunityIcons size={24} name='account-group' color={colors.sgray}/>
                            {/* <Ionicons size={24} name='people-outline' color={colors.sgray} className=''/> */}
                            <Text className={estilosTailwind.info_label}>Capacidade</Text>
                        </View>
                        <Text className={estilosTailwind.info_values}>{dadosSala.capacidade} pessoas</Text>
                    </View>

                    <View className={estilosTailwind.item}>
                        <View className='flex-row gap-2 mb-3 items-center'>
                            {/* <Ionicons size={24} name='location-outline' color={colors.sgray} className=''/> */}
                            <MaterialCommunityIcons size={24} name='map-marker' color={colors.sgray}/>
                            <Text className={estilosTailwind.info_label}>Localização</Text>
                        </View>
                        <Text className={estilosTailwind.info_values}>{dadosSala.localizacao}</Text>
                    </View>

                    {
                        user.is_superuser || user.groups.includes(1)
                        ? (
                            <View className={estilosTailwind.item + ''}>
                            <View className='flex-row gap-2 mb-3 items-center'>
                                {/* <Ionicons size={24} name='person-outline' color={colors.sgray} className=''/> */}
                                <MaterialCommunityIcons size={24} name='account' color={colors.sgray}/>
                                <Text className={estilosTailwind.info_label + ''}>Responsáveis</Text>
                            </View>
                            {dadosSala.responsaveis.map(responsavel => <Text key={responsavel} className={estilosTailwind.info_values}>- {responsavel}</Text>)}
                            {dadosSala.responsaveis.length === 0 ? <Text className={estilosTailwind.info_values + 'font-regular text-gray-300'} >Sem responsáveis</Text>: null}
                        </View>
                        ) : null
                    }


                    <View className={estilosTailwind.item}>
                        <View className='flex-row gap-2 mb-3 items-center'>
                            {/* <Ionicons size={24} name='list-outline' color={colors.sgray} className=''/> */}
                            <MaterialCommunityIcons size={24} name='information-outline' color={colors.sgray}/>
                            <Text className={estilosTailwind.info_label}>Descrição</Text>
                        </View>
                        {
                            dadosSala.descricao ?
                            <Text className={estilosTailwind.info_values + ' font-regular text-gray-800'}>{dadosSala.descricao}</Text>
                            :
                            <Text className={estilosTailwind.info_values + ' font-regular text-gray-300'}>Sem descrição</Text>

                        }
                    </View>
                </View>
            </ScrollView>

            {(limpezasEmAndamento.length > 0) && 
                <View className={visibleDetalhesButtons ? 'border-b border-gray-200' : ''}>
                    <TouchableRipple 
                        className="border rounded-full h-14 mx-6 my-2" 
                        onPress={() => navigation.navigate('Limpeza', {type: 'Concluir', registroSala: limpezasEmAndamento[0]})}
                        borderless={true}
                        // background={colors.sblue}
                        
                    >
                        <View className=" flex-1 flex-row items-center justify-center gap-4 bg-sblue">
                            <Ionicons name="timer-outline" size={24} color={'white'}/>
                            <Text className="text-lg text-white">Concluir Limpeza</Text>
                        </View>
                    </TouchableRipple>
                </View>
            }


            {
                visibleDetalhesButtons && 
                <View className=" flex-row gap-2 p-2">
                    <View className="flex-col flex-1 gap-2">
                        {visibleIniciarLimpeza && 
                            <TouchableOpacity
                                className=" h-14 bg-sgreen/20 flex-row gap-1 rounded-full items-center justify-center"
                                onPress={(e) => {
                                    e.stopPropagation()
                                    handleIniciarLimpeza()
                                }}
                                >
                                <MaterialCommunityIcons size={24} name='broom' color={colors.sgreen}/>
                                <Text className=" text-sgreen text-base">Iniciar limpeza</Text>
                            </TouchableOpacity>
                        }
                        {visibleReportarSujeira && 
                            <TouchableOpacity
                                className=" h-14 bg-syellow/20 flex-row gap-1 rounded-full items-center justify-center"
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleMarcarSalaComoSuja()
                                    // marcarSalaComoSuja(sala.qr_code_id)
                                }}
                            >
                                <MaterialCommunityIcons size={24} name='delete-variant' color={colors.syellow}/>
                                <Text className=" text-syellow text-base">Reportar sujeira</Text>
                            </TouchableOpacity>                          
                        }
                        {visibleSalaInativa && 
                            <TouchableOpacity
                                className=" h-14 bg-sgray/30 flex-row gap-1 rounded-full items-center justify-center"
                                onPress={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <MaterialCommunityIcons size={24} name='information-outline' color={colors.sgray}/>
                                <Text className=" text-sgray text-base">Sala inativa</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View className={
                        adminButtonsConditionStyle ?
                        "flex-row-reverse gap-2"
                        :
                        "flex-col gap-2"

                    }>
                        {visibleEditarSala && 
                            <TouchableOpacity
                                className=" h-14 px-6 bg-sblue/20 flex-row gap-1 rounded-full items-center justify-center"
                                onPress={(e) => {
                                    e.stopPropagation();
                                    navigation.navigate('FormSala', {sala: dadosSala})
                                }}
                            >
                                <MaterialCommunityIcons size={24} name='pen' color={colors.sblue}/>
                            </TouchableOpacity>
                        }
                        {visibleExcluirSala && 
                            <TouchableOpacity
                                className=" h-14 px-6 bg-sred/20 flex-row gap-1 rounded-full items-center justify-center"
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleExcluirSala()
                                }}
                            >
                                <MaterialCommunityIcons size={24} name='delete' color={colors.sred}/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            }            
        </SafeAreaView>
    )
}
