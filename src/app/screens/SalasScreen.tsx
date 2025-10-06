import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Button, Text, ActivityIndicator, SegmentedButtons, Searchbar } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
// import { UserStackParamList } from "../navigation/types/UserStackTypes";
import { newSala, Sala } from "../types/apiTypes";
import {obterSalas } from "../servicos/servicoSalas";
import { marcarSalaComoLimpaService, excluirSalaService, marcarSalaComoSujaService } from "../servicos/servicoSalas";
import SalaCard from "../components/SalaCard";
import { AdminStackParamList } from "../navigation/types/AdminStackTypes";
import Toast from "react-native-toast-message";
import { Ionicons } from '@expo/vector-icons'
import { TouchableRipple } from "react-native-paper";
import { CustomTextInput as TextInput} from "../components/CustomTextInput";
import HeaderScreen from "../components/HeaderScreen";
import { normalizarTexto } from "../utils/functions";
import FiltersOptions from "../components/FiltersOptions";
import FilterSelector from "../components/FilterSelector";
import { tr } from "date-fns/locale";



type LimpezaStatus = 'Todas' | 'Limpas' | 'Limpeza Pendente' | 'Em Limpeza' | 'Suja'
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
    const [searchSalaText, setSearchSalaText] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [salas, setSalas] = useState<Sala[]>([])
    const [filtroLimpezaStatus, setFiltroLimpezaStatus] = useState<LimpezaStatus>('Todas')
    const [filtroSalaStatus, setFiltroSalaStatus] = useState<SalaStatus>('Todas')
    const [refreshingSalas, setRefreshingSalas] = useState(false)
    const [filtroOptionsVisible, setFiltroOptionsVisible] = useState(false)

    const carregarSalasComLoading = async () => {
        setCarregando(true);
        await carregarSalas();
        setCarregando(false)
    }

    const carregarSalas = async () => {
        setRefreshingSalas(true)
        const obterSalasResult = await obterSalas()
        if (!obterSalasResult.success){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: obterSalasResult.errMessage,
                position: 'bottom',
                visibilityTime: 3000
            })
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

    const marcarSalaComoLimpa = async (id: string) => {
        try{
            await marcarSalaComoLimpaService(id, '')
            await carregarSalasComLoading()
        } catch(erro: any){
            // setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
            // if(erro.message.includes('Token de autenticação expirado ou inválido.')){
            //     signOut()
            // }                
            
        } finally{

        }
    }

    const marcarSalaComoSuja = async (id: string) => {
        const marcarSalaComoSujaServiceResult = await marcarSalaComoSujaService(id)
        if(!marcarSalaComoSujaServiceResult.success){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: marcarSalaComoSujaServiceResult.errMessage,
                position: 'bottom',
                visibilityTime: 3000
            });
            return;
        }
        await carregarSalasComLoading()

    }

    async function excluirSala(id: string){
        const excluirSalaServiceResult = await excluirSalaService(id);
        if(!excluirSalaServiceResult.success){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: excluirSalaServiceResult.errMessage,
                position: 'bottom',
                visibilityTime: 3000
            })
        }
        await carregarSalas();
    }

    async function handleExcluirSala(id: string){
        Alert.alert('Excluir sala', "Tem certeza de que deseja excluir esta sala?", [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: () => excluirSala(id)
            }
        ])
    }

    useFocusEffect( React.useCallback(() => {
        carregarSalasComLoading()
    },[]))
    
        
    if(carregando){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }

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

    return (
        <SafeAreaView edges={['top']}  className="flex-1 bg-gray-100 pb-4">
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
                        {label: `Limpa (${contagemSalasLimpas})`, value: 'Limpas'},
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


            {salasFiltradas.length === 0 ?
                <View className=" flex-1 justify-center gap-2 items-center px-10">
                    <Ionicons name="close-circle-outline" size={64} color={colors.sgray}/>
                    <Text className="text-gray-500">Nenhuma sala encontrada</Text>
                </View>
                :
                <ScrollView className="p-3 px-7"
                    refreshControl={<RefreshControl refreshing={refreshingSalas} onRefresh={carregarSalas}/>}
                >
                    {salasFiltradas.map((sala) => (
                    <SalaCard key={sala.id} marcarSalaComoSuja={ async (id) => await marcarSalaComoSuja(id)} userGroups={user.groups} userRole={userRole} marcarSalaComoLimpa={marcarSalaComoLimpa} editarSala={() => navigation.navigate('FormSala', {sala: sala})} excluirSala={handleExcluirSala} sala={sala} onPress={() => navigation.navigate('DetalhesSala', {id: sala.qr_code_id})}/>
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


