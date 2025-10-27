import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl, Text, FlatList } from 'react-native';
import { Button, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from "../../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
// import { UserStackParamList } from "../navigation/types/UserStackTypes";
import { newSala, RegistroSala, Sala } from "../types/apiTypes";
import {getRegistrosService, iniciarLimpezaSala, marcarSalaComoSujaService  } from "../servicos/servicoLimpezas";
import { excluirSalaService, obterSalas } from "../servicos/servicoSalas";
import SalaCard from "../components/cards/SalaCard";
import { AdminStackParamList } from "../navigation/types/StackTypes";
import Toast from "react-native-toast-message";
import { Ionicons } from '@expo/vector-icons'
import { CustomTextInput as TextInput} from "../components/CustomTextInput";
import HeaderScreen from "../components/HeaderScreen";
import { normalizarTexto, showErrorToast } from "../utils/functions";
import FiltersOptions from "../components/FiltersOptions";
import FilterSelector from "../components/FilterSelector";
import HandleConfirmation from "../components/HandleConfirmation";
import { id } from "date-fns/locale";
import LoadingCard from "../components/cards/LoadingCard";
import { useSalas } from "../contexts/SalasContext";
import { useNotifications } from "../contexts/NotificationsContext";
import { useAuthContext } from "../contexts/AuthContext";



interface editingSalaType{
    type: 'edit' | 'delete' | 'startCleaning' | 'markAsDirty';
    id: string;
}

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

type LimpezaStatus = 'Todas' | 'Limpa' | 'Limpeza Pendente' | 'Em Limpeza' | 'Suja'
type SalaStatus = 'Todas' | 'Ativas' | 'Inativas'

export default function SalasScreen() {
    
    const {
        salas,
        carregando,
        refreshing,
        filtroLimpezaStatus,
        filtroSalaStatus,
        searchSalaText,
        setFiltroLimpezaStatus,
        setFiltroSalaStatus,
        setFiltroSearchSalaText,
        carregarSalas,
        iniciarLimpeza,
        marcarSalaComoSuja,
        excluirSala,
    } = useSalas()

    const {contagemNotificacoesNaoLidas, carregarNotificacoes} = useNotifications()
    const {userRole, user} = useAuthContext()
    if(!user || !userRole){
        return null
    }


    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();

    const activeFilters = 
        filtroLimpezaStatus !== 'Todas' || 
        filtroSalaStatus !== 'Todas' || 
        searchSalaText !== ''

    const lastSearchText = useRef(searchSalaText)

    useEffect(() => {
        if(!refreshing && !carregando){
            lastSearchText.current = searchSalaText
        }
    }, [refreshing, carregando, searchSalaText])

    const isSearchPending = searchSalaText !== lastSearchText.current

    const [filtroOptionsVisible, setFiltroOptionsVisible] = useState(false)
    const [limpezasEmAndamento, setLimpezasEmAndamento] = useState<RegistroSala[]>([])

    const [confirmationModalProps, setConfirmationModalProps] = useState<confirmationModalProps>({
        confirmationTexts: {
            headerText: '',
            bodyText: '',
            confirmText: '',
            cancelText: ''
        },
        type: 'confirmAction'
    });
    const [editingSala, setEditingSala] = useState<editingSalaType | null>(null)
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [observacao, setObservacao] = useState('')

    const handleIniciarLimpeza = useCallback((id: string) => {
        setEditingSala({type: 'startCleaning', id})
        setConfirmationModalProps({
            confirmationTexts: {
                headerText: 'Iniciar limpeza',
                bodyText: 'Tem certeza de que deseja iniciar a limpeza dessa sala?',
                confirmText: 'Iniciar limpeza'
            },
            type: 'confirmAction'
        })
        setConfirmationModalVisible(true)
    }, [])

    const handleMarcarSalaComoSuja = useCallback((id: string) => {
        setEditingSala({type: 'markAsDirty', id: id})
        setConfirmationModalProps({
            confirmationTexts: {
                headerText: 'Relatar sala suja',
                bodyText: 'Tem certeza de que deseja relatar esta sala como suja?',
                confirmText: 'Relatar como suja',
            },
            type: 'reportAction'
        });
        setConfirmationModalVisible(true);
    },[])

    const handleExcluirSala = useCallback((id: string) => {
        setEditingSala({type: 'delete', id: id})
        setConfirmationModalProps({
            confirmationTexts: {
                headerText: 'Excluir sala',
                bodyText: 'Tem certeza de que deseja excluir esta sala?',
                confirmText: 'Excluir',
            },
            type: 'destructiveAction'
        });
        setConfirmationModalVisible(true);
    },[])

    const navigateToFormData = useCallback((sala: Sala) => {
        navigation.navigate('FormSala', {sala})
    }, [navigation])

    const navigateToDetalhesSala = useCallback((id: string) => {
        navigation.navigate('DetalhesSala', {id})
    }, [navigation])

    const onCancel = () => {
        setConfirmationModalVisible(false);
        setEditingSala(null);
        setObservacao('');
    }

    const onConfirm = async () => {
        setConfirmationModalVisible(false);
        if(editingSala?.type === 'delete'){
            await excluirSala(editingSala.id);
        } else if(editingSala?.type === 'startCleaning'){
            await iniciarLimpeza(editingSala.id);
        } else if(editingSala?.type === 'markAsDirty'){
            await marcarSalaComoSuja(editingSala.id, observacao);
        }
        
        setEditingSala(null);
        setObservacao('');
    }

    const carregarLimpezasAndamento = async () => {
        // console.log(limpezasEmAndamento)
        // console.log(limpezasEmAndamento.length)
        if(!user.groups.includes(1)){
            return
        }
        
        const username = user.username
        const getAllRegistrosServiceResult = await getRegistrosService({
            username,
        })
        if(!getAllRegistrosServiceResult.success){
            showErrorToast({errMessage: getAllRegistrosServiceResult.errMessage})
            return
        }
        
        const limpezasAndamento = getAllRegistrosServiceResult.data.filter(item => {
            return item.data_hora_fim === null
        })
        
        setLimpezasEmAndamento(limpezasAndamento)
        
        return
        
    }

    const carregarTudo = async () => {
        await carregarSalas()
        await carregarLimpezasAndamento()
        await carregarNotificacoes()
    }
    

    useFocusEffect( React.useCallback(() => {
        setFiltroSearchSalaText('')
        setFiltroLimpezaStatus('Todas')
        setFiltroSalaStatus('Todas')
        carregarTudo()
    },[]))
    

    const { 
        salasFiltradas, 
    } = React.useMemo(() => {
    
        const filtered = salas;
    
        return {
            salasFiltradas: filtered,
        };
    }, [salas, filtroLimpezaStatus]);


    return (
        <SafeAreaView edges={['top']}  className="flex-1 bg-gray-100 pb-4">

            <HandleConfirmation 
                visible={confirmationModalVisible} 
                onConfirm={ async () => onConfirm()}
                onCancel={onCancel}
                confirmationTexts={confirmationModalProps.confirmationTexts}
                type={confirmationModalProps.type}
                observacao={observacao}
                setObservacao={setObservacao}
            
            />

            <HeaderScreen searchBar={{
                searchLabel: 'Pesquisar salas',
                searchText: searchSalaText,
                setSearchText: setFiltroSearchSalaText,
                searchResults: {
                    activeFilters: activeFilters && !refreshing && !carregando && !isSearchPending,
                    filtersResult: salasFiltradas.length
                }
            }} 
                // filterOptions={true}
                headerNavButtons={true}
                headerText="Salas"
                userGroups={user.groups}
                showFilterOptions={() => setFiltroOptionsVisible(true)}
                notifications={{notificationsNavigate: () => navigation.navigate('Notifications'), notificationsCount: contagemNotificacoesNaoLidas}}
                qrCodeNavigate={() => navigation.navigate('QrCodeScanner')}
            />

            <FiltersOptions visible={filtroOptionsVisible} onDismiss={() => setFiltroOptionsVisible(false)}
                className=" gap-2 pb-4"
            >

                <FilterSelector
                    label={'Status da limpeza'}
                    value={filtroLimpezaStatus}
                    type="single"
                    onValueChange={setFiltroLimpezaStatus}
                    defaultValue="Todas"
                    buttons={[
                        {label: `Limpa`, value: 'Limpa'},
                        {label: `Limpeza Pendente`, value: 'Limpeza Pendente'},
                        {label: `Em Limpeza`, value: 'Em Limpeza'},
                        {label: `Suja`, value: 'Suja'},
                    ]}
                />
                { userRole === 'admin' ?
                    <FilterSelector
                        label={'Status da sala'}
                        value={filtroSalaStatus}
                        type="single"
                        onValueChange={setFiltroSalaStatus}
                        defaultValue="Todas"
                        buttons={[
                            {label: `Ativas`, value: 'Ativas'},
                            {label: `Inativas`, value: 'Inativas'},
                        ]}
                    />
                    : 
                    null}
            </FiltersOptions>

            {(carregando || limpezasEmAndamento.length === 0) ? null :
                <TouchableRipple 
                    className="border rounded-full h-14 mx-6 my-2" 
                    onPress={() => navigation.navigate('LimpezasAndamento')}
                    borderless={true}
                    // background={colors.sblue}
                    
                >
                    <View className=" flex-1 flex-row items-center justify-center gap-4 bg-sblue">
                        <Ionicons name="timer-outline" size={24} color={'white'}/>
                        <Text className="text-lg text-white">Limpezas em andamento</Text>
                    </View>
                </TouchableRipple>
            }

            

            {refreshing ?
                <ScrollView className="p-3 px-7">
                    {[...Array(5)].map((_, index) => (
                        <LoadingCard key={index} loadingImage={true} />
                        // <View></View>
                    ))}
                </ScrollView>
                :
                <FlatList
                    data={salasFiltradas}
                    keyExtractor={(item) => item.qr_code_id}
                    className=" flex-1 p-3 px-7"
                    initialNumToRender={7}
                    windowSize={11}
                    maxToRenderPerBatch={5}
                    contentContainerClassName=" gap-2 flex-grow"
                    // contentContainerClassName=" gap-2 border flex-grow"
                    renderItem={(item) => {
                        const sala = item.item
                        return (
                            <SalaCard 
                                key={sala.id} 
                                sala={sala} 
                                marcarSalaComoSuja={handleMarcarSalaComoSuja} 
                                userGroups={user.groups}
                                userRole={userRole} 
                                iniciarLimpeza={handleIniciarLimpeza} 
                                excluirSala={handleExcluirSala} 
                                editarSala={navigateToFormData} 
                                onPress={() => navigateToDetalhesSala(sala.qr_code_id)}
                            />
                        )
                    }}
                    refreshing={refreshing}
                    onRefresh={async () => {
                        await carregarTudo()
                    }}
                    ListEmptyComponent={() => (
                        <View className=" flex-1 justify-center gap-2 items-center px-10">
                            <Ionicons name="close-circle-outline" size={64} color={colors.sgray}/>
                            <Text className="text-gray-500">Nenhuma sala encontrada</Text>
                        </View>    
                    )}
            />
            }
            {userRole === 'admin' ?
                <Button
                    mode='contained-tonal'
                    buttonColor={colors.sblue}
                    textColor={'white'}
                    icon={'plus'}
                    className=" mx-5 my-3 mb-0 mt-5"
                    onPress={() => navigation.navigate('FormSala', {})}
                    
                >
                    Criar sala
                </Button>
                :
                null
            }
        </SafeAreaView>
    );
};


