// import { View } from "react-native-reanimated/lib/typescript/Animated";
import { View, ScrollView, Text, StyleSheet, Alert, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native'
import { Card, Button, ActivityIndicator, Appbar } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TelaDetalhesSala } from '../navigation/types/StackTypes';
import React, { useContext, useEffect, useState } from 'react';
import { obterDetalhesSala, excluirSalaService} from '../servicos/servicoSalas';
import { iniciarLimpezaSala, marcarSalaComoSujaService } from '../servicos/servicoLimpezas';
import { Sala } from '../types/apiTypes';
import { AuthContext } from '../AuthContext';
import { colors } from '../../styles/colors';
import { formatarDataISO, showErrorToast } from '../utils/functions';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { apiURL } from '../api/axiosConfig';
import Toast from 'react-native-toast-message';
import HandleConfirmation from '../components/HandleConfirmation';


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
    const authContext = useContext(AuthContext)
    if(!authContext){
        return null
    }
    if(!authContext.user){
        return null
    }
    
    const {signOut, user, userRole, usersGroups} = authContext
    const route = useRoute<TelaDetalhesSala['route']>()
    const navigation = useNavigation()
    const {id} = route.params;

    const [carregando, setCarregando] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [dadosSala, setDadosSala] = useState<Sala|null>(null)

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

    const iniciarLimpeza = async (id: string) => {
        const iniciarLimpezaSalaResult = await iniciarLimpezaSala(id);
        if(!iniciarLimpezaSalaResult.success){
            showErrorToast({errMessage: iniciarLimpezaSalaResult.errMessage})                
            return;
        }
        await carregarSala()
    }
    
    const marcarSalaComoSuja = async (id: string, observacao: string) => {
        const marcarSalaComoLimpaServiceResult = await marcarSalaComoSujaService(id, observacao)
        if(!marcarSalaComoLimpaServiceResult.success){
            showErrorToast({errMessage: marcarSalaComoLimpaServiceResult.errMessage})
        }
    }
    
    const excluirSala = async (id: string) => {
        const excluirSalaServiceResult = await excluirSalaService(id);
        if(!excluirSalaServiceResult.success){
            showErrorToast({errMessage: excluirSalaServiceResult.errMessage})
        }
        onCancel()
        // navigation.goBack()
        setTimeout(navigation.goBack, 500)
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
    
    const carregarSala = async () => {
        // setCarregando(true)
        const obterDetalhesSalaResult = await obterDetalhesSala(id);
        if(!obterDetalhesSalaResult.success){
            showErrorToast({errMessage: obterDetalhesSalaResult.errMessage})
            return;
        }
        
        setDadosSala(obterDetalhesSalaResult.data)
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

        onCancel()
        
        if(editingSalaType !== 'delete'){
            await carregarSala()
        }
    }
    
    
    useFocusEffect( React.useCallback(() => {
        setCarregando(true)
        carregarSala().then(() => setCarregando(false))
        
    }, []))


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
                    <Text className=" text-2xl text-white" >Perfil</Text>
                </View>

            </View>
            <ScrollView className=" mt-4 flex-1" 
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                    setRefreshing(true)
                    carregarSala().then(() => setRefreshing(false))
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

            {
                (userRole === 'user' && user.groups.length === 0) ? null : 
                <View className=" flex-row gap-2 p-2">
                    <View className="flex-col flex-1 gap-2">
                        {dadosSala.ativa ? 
                        <>
                            {
                                !user.groups.includes(1) ? null : 
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

                            {
                                !user.groups.includes(2) ? null : 
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
                        </>
                        :
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
                    {
                        userRole === 'user' ? null : 
                        <View className={
                            (usersGroups.length < 2) ?
                            "flex-row-reverse gap-2"
                            :
                            "flex-col gap-2"

                        }>
                            <TouchableOpacity
                                className=" h-14 px-6 bg-sblue/20 flex-row gap-1 rounded-full items-center justify-center"
                                onPress={(e) => {
                                    e.stopPropagation();
                                    navigation.navigate('FormSala', {sala: dadosSala})
                                }}
                            >
                                <MaterialCommunityIcons size={24} name='pen' color={colors.sblue}/>
                            </TouchableOpacity>
                            {
                                !dadosSala.ativa ? null :
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
                    }
                </View>
            }
            
        </SafeAreaView>
    )
}
