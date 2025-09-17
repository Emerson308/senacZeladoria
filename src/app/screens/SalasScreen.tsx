import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Appbar, SegmentedButtons, BottomNavigation, Icon } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";

import { UserStackParamList } from "../navigation/types/UserStackTypes";
import { newSala, Sala } from "../types/apiTypes";
import { criarNovaSala, editarSalaService, obterSalas } from "../servicos/servicoSalas";
import { marcarSalaComoLimpaService, excluirSalaService } from "../servicos/servicoSalas";
import { segmentSalaStatus } from "../types/types";
// import AdminSalaCard from "../components/AdminSalaCard";
import SalaCard from "../components/SalaCard";
import SalaForms from "../components/SalaForms";
import { AdminStackParamList } from "../navigation/types/AdminStackTypes";
// import '../styles/global.css'; // Certifique-se de que o NativeWind está configurado

export default function SalasScreen() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    if (authContext.userRole === null){
        return null
    }
    
    if (authContext.user === null){
        return null
    }
    
    const {signOut, userRole, user} = authContext
    // const userRole = 'user'
    const navigation = useNavigation<NavigationProp<AdminStackParamList>>();
    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [salas, setSalas] = useState<Sala[]>([])
    const [filtro, setFiltro] = useState<segmentSalaStatus>('Todas')
    const [salasFiltradas, setSalasFiltradas] = useState<Sala[]>([])
    const [criarSalaFormVisible, setCriarSalaFormVisible] = useState(false)
    const [editarSalaFormVisible, setEditarSalaFormVisible] = useState(false)
    const [formEditarData, setFormEditarData] = useState<Sala|null>(null)
    const [refreshingSalas, setRefreshingSalas] = useState(false)

    const carregarSalasComLoading = async () => {
        setCarregando(true);
        await carregarSalas();
        setCarregando(false)
    }

    const carregarSalas = async () => {
        try{
            const obtendoSalas = await obterSalas()
            setSalas(obtendoSalas)
            setFiltro(filtro)
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)

        } finally{

        }
    }

    const marcarSalaComoLimpa = async (id: string) => {
        // setCarregando(true)
        try{
            await marcarSalaComoLimpaService(id, '')
            await carregarSalasComLoading()
            setFiltro(filtro)
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }                
            
        } finally{
            // setCarregando(false)
        }
    }
    
    async function criarSala(newSala: newSala){
        
        try {
            await criarNovaSala(newSala);
            await carregarSalasComLoading();
        } catch(erro: any){
            
            setMensagemErro(erro.message || 'Não foi possivel criar as salas')
            if(erro.message === 'AxiosError: Request failed with status code 400'){
                setMensagemErro('Esse nome de sala está em uso, digite um nome diferente')
            }
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
        }
    }

    async function editarSala(newSala: newSala, id: string|undefined){
        try {
            if(!id){
                console.log('O id não foi passado')
                return
            }
            await editarSalaService(newSala, id);
            await carregarSalasComLoading();
        } catch(erro: any){
            
            setMensagemErro(erro.message || 'Não foi possivel criar as salas')
            if(erro.message === 'AxiosError: Request failed with status code 400'){
                setMensagemErro('Esse nome de sala está em uso, digite um nome diferente')
            }
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
        }

    }

    async function excluirSala(id: string){
        try{
            await excluirSalaService(id);
            await carregarSalasComLoading();

        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel criar as salas')

            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
        }

    }

    async function handleExcluirSala(id: string){
        Alert.alert('Excluir sala', "Tem certeza de que deseja excluir este item?", [
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

    function btnEditarSala(sala: Sala){
        setFormEditarData(sala);
        setEditarSalaFormVisible(true)
    }

    useFocusEffect( React.useCallback(() => {
        carregarSalas()
    },[]))
    
    useEffect(() => {
        setCarregando(true)
        carregarSalas()
        setCarregando(false)

    }, [])

    useEffect(() => {
        if (filtro === 'Todas') {
            setSalasFiltradas(salas)
        } else if (filtro === 'Limpas'){
            const salasLimpas = salas.filter(item => item.status_limpeza === 'Limpa')
            setSalasFiltradas(salasLimpas)
        } else if (filtro === 'Limpeza pendente'){
            const salasLimpezaPendente = salas.filter(item => item.status_limpeza === 'Limpeza Pendente')
            // console.log(salasLimpezaPendente)
            setSalasFiltradas(salasLimpezaPendente)
        }

    }, [filtro, salas])

    useFocusEffect( React.useCallback(() => {
        carregarSalas()
    },[]))
    
    
    const irParaDetalhesSala = (id: string) =>{
        navigation.navigate('DetalhesSala', {id})
        // navigation.navigate('Usuarios')
    }

    if(carregando){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }

    const contagemSalas = salas.length
    const contagemSalasLimpas = salas.filter(sala => sala.status_limpeza === 'Limpa').length
    const contagemSalasPendentes = salas.filter(sala => sala.status_limpeza === 'Limpeza Pendente').length


    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">
            <SalaForms visible={criarSalaFormVisible} onClose={() => setCriarSalaFormVisible(false)} onSubmit={criarSala} typeForm='Criar'/>
            <SalaForms visible={editarSalaFormVisible} onClose={() => setEditarSalaFormVisible(false)} onSubmit={editarSala} typeForm='Editar' sala={formEditarData}/>
            <SegmentedButtons 
                value={filtro}
                onValueChange={setFiltro}
                style={styles.segmentButtons}
                theme={{colors: {secondaryContainer: colors.sblue + '30'}}}
                buttons={[
                    {
                        value: 'Todas',
                        label: `Todas (${contagemSalas})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12},
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                    {
                        value: 'Limpas',
                        label: `Limpas (${contagemSalasLimpas})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12},
                        // style: {backgroundColor: colors.sblue},
                    },
                    {
                        value:'Limpeza pendente',
                        label: `Pendente (${contagemSalasPendentes})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12},
                        // style: {backgroundColor: colors.sblue},
                    }
                ]}
            />


            <ScrollView className="p-3"
                refreshControl={<RefreshControl refreshing={refreshingSalas} onRefresh={carregarSalas}/>}
            >
                {salasFiltradas.map((sala) => (
                    <SalaCard key={sala.id} userRole={userRole} marcarSalaComoLimpa={marcarSalaComoLimpa} userGroups={user.groups} editarSala={btnEditarSala} excluirSala={handleExcluirSala} sala={sala} onPress={async () => irParaDetalhesSala(sala.qr_code_id)}/>
                ))}
            </ScrollView>

            {userRole === 'user' ?
                null
                :
                <Button
                    mode='contained-tonal'
                    buttonColor={colors.sblue}
                    textColor={'white'}
                    icon={'plus'}
                    className=" mx-5 my-3 mb-0 mt-5"
                    onPress={() => setCriarSalaFormVisible(true)}
                    
                >
                    Criar sala
                </Button>

            }
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    segmentButtons: {
        marginVertical: 15,
        marginHorizontal: 15
    }
})