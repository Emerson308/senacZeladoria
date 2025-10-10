import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl, Text } from 'react-native';
import { Button, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
// import { UserStackParamList } from "../navigation/types/UserStackTypes";
import { newSala, RegistroSala, Sala } from "../types/apiTypes";
import {getRegistrosService, iniciarLimpezaSala, obterSalas } from "../servicos/servicoSalas";
import { excluirSalaService, marcarSalaComoSujaService } from "../servicos/servicoSalas";
import SalaCard from "../components/cards/SalaCard";
import { AdminStackParamList } from "../navigation/types/AdminStackTypes";
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
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return;
    }
    if (authContext.userRole === null){
        return
    }
    if (authContext.user === null){
        return
    }
    
    const {signOut, userRole, user} = authContext
    // const userRole = 'user'
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const [carregando, setCarregando] = useState(false)
    const [refreshingSalas, setRefreshingSalas] = useState(false)
    const [salas, setSalas] = useState<Sala[]>([])
    const [limpezasEmAndamento, setLimpezasEmAndamento] = useState<RegistroSala[]>([])
    
    const [searchSalaText, setSearchSalaText] = useState('')
    const [filtroOptionsVisible, setFiltroOptionsVisible] = useState(false)
    const [filtroSalaStatus, setFiltroSalaStatus] = useState<SalaStatus>('Todas')
    const [filtroLimpezaStatus, setFiltroLimpezaStatus] = useState<LimpezaStatus>('Todas')

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

    const carregarSalasComLoading = async () => {
        setCarregando(true);
        await carregarSalas();
        setCarregando(false)
    }

    const carregarLimpezasEmAndamento = async () => {
        const getRegistrosServiceResult = await getRegistrosService({username: user.username})
        if (!getRegistrosServiceResult.success){
            showErrorToast({errMessage: getRegistrosServiceResult.errMessage})
            return
        }

        const LimpezasAndamento = getRegistrosServiceResult.data.filter(registro => registro.data_hora_fim === null)

        setLimpezasEmAndamento(LimpezasAndamento)
    }

    const carregarSalas = async () => {
        setRefreshingSalas(true)
        if(user.groups.includes(1)){
            await carregarLimpezasEmAndamento()
        }
        const obterSalasResult = await obterSalas()
        if (!obterSalasResult.success){
            showErrorToast({errMessage: obterSalasResult.errMessage})
            return
        }
        
        const salasAtivas = obterSalasResult.data.filter(sala => sala.ativa)
        const salasInativas = obterSalasResult.data.filter(sala => !sala.ativa)

        if(userRole === 'user'){
            setSalas(salasAtivas)
            setRefreshingSalas(false)
            return
        }

        setSalas([...salasAtivas, ...salasInativas])
        
        setRefreshingSalas(false)
    }

    const iniciarLimpeza = async (id: string) => {
        const iniciarLimpezaSalaResult = await iniciarLimpezaSala(id);
        if(!iniciarLimpezaSalaResult.success){
            showErrorToast({errMessage: iniciarLimpezaSalaResult.errMessage})
            return;
        }
        await carregarSalas()
    }

    const marcarSalaComoSuja = async (id: string, observacoes?: string) => {
        const marcarSalaComoSujaServiceResult = await marcarSalaComoSujaService(id, observacoes)
        if(!marcarSalaComoSujaServiceResult.success){
            showErrorToast({errMessage: marcarSalaComoSujaServiceResult.errMessage})
            return;
        }
        await carregarSalas()

    }

    async function excluirSala(id: string){
        // const id = 'emerson'
        const excluirSalaServiceResult = await excluirSalaService(id);
        if(!excluirSalaServiceResult.success){
            showErrorToast({errMessage: excluirSalaServiceResult.errMessage})
        }
        await carregarSalas();
    }

    const handleIniciarLimpeza = (id: string) => {
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
    }

    const handleMarcarSalaComoSuja = (id: string) => {
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
    }

    const handleExcluirSala = (id: string) => {
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
    }

    const onCancel = () => {
        setConfirmationModalVisible(false);
        setEditingSala(null);
        setObservacao('');
    }

    const onConfirm = async () => {
        if(editingSala?.type === 'delete'){
            await excluirSala(editingSala.id);
        } else if(editingSala?.type === 'startCleaning'){
            await iniciarLimpeza(editingSala.id);
        } else if(editingSala?.type === 'markAsDirty'){
            await marcarSalaComoSuja(editingSala.id, observacao);
        }

        setConfirmationModalVisible(false);
        setEditingSala(null);
        setObservacao('');
    }

    useFocusEffect( React.useCallback(() => {
        carregarSalasComLoading()
    },[]))
    
        
    // if(carregando){
    //     return(
    //     <View className='flex-1 bg-gray-50 justify-center p-16'>
    //         <ActivityIndicator size={80}/>
    //     </View>
    //     )
    // }

    const searchSalaTextFormatado = normalizarTexto(searchSalaText)

    const salasFiltradas = salas.filter(sala => {
        const nomeSalaFormatado = normalizarTexto(sala.nome_numero)
        const capacidadeFormatada = normalizarTexto(String(sala.capacidade))
        const localizacaoFormatada = normalizarTexto(sala.localizacao)

        if(nomeSalaFormatado.includes(searchSalaTextFormatado) || capacidadeFormatada.includes(searchSalaTextFormatado) || localizacaoFormatada.includes(searchSalaTextFormatado)){
            return (
                (filtroLimpezaStatus === 'Todas' ? true : filtroLimpezaStatus === sala.status_limpeza) &&
                (filtroSalaStatus === 'Todas' ? true : filtroSalaStatus === (sala.ativa ? 'Ativas' : 'Inativas'))
            )
        }
    })


    const contagemSalas = salas.length

    const contagemSalasLimpas = salas.filter(sala => sala.status_limpeza === 'Limpa').length
    const contagemSalasPendentes = salas.filter(sala => sala.status_limpeza === 'Limpeza Pendente').length
    const contagemSalasEmLimpeza = salas.filter(sala => sala.status_limpeza === 'Em Limpeza').length
    const contagemSalasSuja = salas.filter(sala => sala.status_limpeza === 'Suja').length

    const contagemSalasAtivas = salas.filter(sala => sala.ativa).length
    const contagemSalasInativas = salas.filter(sala => !sala.ativa).length

    // console.log(limpezasEmAndamento)

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
                setSearchText: setSearchSalaText
            }} 
                // filterOptions={true}
                headerNavButtons={true}
                headerText="Salas"
                userGroups={user.groups}
                showFilterOptions={() => setFiltroOptionsVisible(true)}
                notifications={{notificationsNavigate: () => navigation.navigate('Notifications')}}
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
                        {label: `Limpa (${contagemSalasLimpas})`, value: 'Limpa'},
                        {label: `Limpeza Pendente (${contagemSalasPendentes})`, value: 'Limpeza Pendente'},
                        {label: `Em Limpeza (${contagemSalasEmLimpeza})`, value: 'Em Limpeza'},
                        {label: `Suja (${contagemSalasSuja})`, value: 'Suja'},
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
                            {label: `Ativas (${contagemSalasAtivas})`, value: 'Ativas'},
                            {label: `Inativas (${contagemSalasInativas})`, value: 'Inativas'},
                        ]}
                    />
                    : 
                    null}
            </FiltersOptions>

            {(limpezasEmAndamento.length === 0 || carregando) ? null :
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


            {carregando ?
                <ScrollView className="p-3 px-7">
                    {[...Array(5)].map((_, index) => (
                        <LoadingCard key={index} loadingImage={true} />
                        // <View></View>
                    ))}
                </ScrollView>
                :
                salasFiltradas.length === 0 ?
                <View className=" flex-1 justify-center gap-2 items-center px-10">
                    <Ionicons name="close-circle-outline" size={64} color={colors.sgray}/>
                    <Text className="text-gray-500">Nenhuma sala encontrada</Text>
                </View>
                :
                <ScrollView className="p-3 px-7"
                    refreshControl={<RefreshControl refreshing={refreshingSalas} onRefresh={carregarSalas}/>}
                >
                    {salasFiltradas.map((sala) => (
                    <SalaCard 
                        key={sala.id} 
                        sala={sala} 
                        marcarSalaComoSuja={handleMarcarSalaComoSuja} 
                        userGroups={user.groups} 
                        userRole={userRole} 
                        iniciarLimpeza={handleIniciarLimpeza} 
                        excluirSala={handleExcluirSala} 
                        editarSala={() => navigation.navigate('FormSala', {sala: sala})} 
                        onPress={() => navigation.navigate('DetalhesSala', {id: sala.qr_code_id})}/>
                ))}
            </ScrollView>
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


