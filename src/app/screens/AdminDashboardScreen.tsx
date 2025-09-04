import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Appbar, SegmentedButtons, BottomNavigation, Icon } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";

import { UserStackParamList } from "../navigation/types/UserStackTypes";
import { newSala, Sala } from "../types/apiTypes";
import { criarNovaSala, editarSalaService, obterSalas } from "../servicos/servicoSalas";
import { marcarSalaComoLimpaService, excluirSalaService } from "../servicos/servicoSalas";
import { segmentSalaStatus } from "../types/types";
import AdminSalaCard from "../components/AdminSalaCard";
import SalaForms from "../components/CriarSalaForm";
// import '../styles/global.css'; // Certifique-se de que o NativeWind está configurado

export default function AdminDashboardScreen() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const {signOut} = authContext
    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [salas, setSalas] = useState<Sala[]>([])
    const [filtro, setFiltro] = useState<segmentSalaStatus>('Todas')
    const [salasFiltradas, setSalasFiltradas] = useState<Sala[]>([])
    const [criarSalaFormVisible, setCriarSalaFormVisible] = useState(false)
    const [editarSalaFormVisible, setEditarSalaFormVisible] = useState(false)
    const [formEditarData, setFormEditarData] = useState<Sala|null>(null)

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

    const marcarSalaComoLimpa = async (id: number) => {
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
            // console.log('oi')
            // console.log(erro)
            // console.log(typeof erro)
            // console.log(erro[0].status === 400)
            // console.log(mensagemErro)
            if(erro.message === 'AxiosError: Request failed with status code 400'){
                setMensagemErro('Esse nome de sala está em uso, digite um nome diferente')
            }
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
        }
    }

    async function editarSala(newSala: newSala, id: number|undefined){
        try {
            if(!id){
                console.log('O id não foi passado')
                return
            }
            await editarSalaService(newSala, id);
            await carregarSalasComLoading();
        } catch(erro: any){
            
            setMensagemErro(erro.message || 'Não foi possivel criar as salas')
            // console.log('oi')
            // console.log(erro)
            // console.log(typeof erro)
            // console.log(erro[0].status === 400)
            // console.log(mensagemErro)
            if(erro.message === 'AxiosError: Request failed with status code 400'){
                setMensagemErro('Esse nome de sala está em uso, digite um nome diferente')
            }
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
        }

    }

    async function excluirSalaDefinitivo(id: number){
        await excluirSalaService(id);
        await carregarSalasComLoading();

    }

    async function excluirSala(id: number){
        try {
            if(!id){
                console.log('O id não foi passado')
                return
            }
            let confirmacao = {confirmacao: false};
            Alert.alert('Confirmar exclusão', "Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.", [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    style: 'destructive',
                    onPress: () => excluirSalaDefinitivo(id)
                }
            ])
        } catch(erro: any){
            
            setMensagemErro(erro.message || 'Não foi possivel criar as salas')
            // console.log('oi')
            // console.log(erro)
            // console.log(typeof erro)
            // console.log(erro[0].status === 400)
            // console.log(mensagemErro)
            if(erro.message === 'AxiosError: Request failed with status code 400'){
                setMensagemErro('Esse nome de sala está em uso, digite um nome diferente')
            }
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
        }


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
    
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();
    
    const irParaDetalhesSala = (id: number) =>{
        navigation.navigate('DetalhesSala', {id: id})
    }

    if(carregando){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }

    // if(mensagemErro){
    //     return(
    //     <View className='flex-1 bg-gray-50 justify-center p-16'>
    //         <Text className='text-center'>{mensagemErro}</Text>
    //     </View>
    //     )
    // }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">
            {/* <View className="bg-gray-100 w-full h-40 mb-6 justify-center p-2">
                <Text className=" text-3xl font-bold">Salas</Text>
            </View> */}
            {/* <Appbar.Header>
                <Appbar.Content title='Salas' onPress={carregarSalasComLoading} className=""/>
                <Appbar.Action icon={'logout'} onPress={signOut}/>
            </Appbar.Header> */}
            <SalaForms visible={criarSalaFormVisible} onClose={() => setCriarSalaFormVisible(false)} onSubmit={criarSala} typeForm='Criar'/>
            <SalaForms visible={editarSalaFormVisible} onClose={() => setEditarSalaFormVisible(false)} onSubmit={editarSala} typeForm='Editar' sala={formEditarData}/>
            <SegmentedButtons 
                value={filtro}
                onValueChange={setFiltro}
                style={styles.segmentButtons}
                buttons={[
                    {
                        value: 'Todas',
                        label: 'Todas',
                        checkedColor: 'black',
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                    {
                        value: 'Limpas',
                        label: 'Limpas',
                        checkedColor: 'black',
                        // style: {backgroundColor: colors.sblue},
                    },
                    {
                        value:'Limpeza pendente',
                        label: 'Limpeza pendente',
                        checkedColor: 'black',
                        // style: {backgroundColor: colors.sblue},
                    }
                ]}
            />


            <ScrollView className="p-3">
                {salasFiltradas.map((sala) => (
                    <AdminSalaCard key={sala.id} marcarSalaComoLimpa={marcarSalaComoLimpa} editarSala={btnEditarSala} excluirSala={excluirSala} sala={sala} onPress={async () => irParaDetalhesSala(sala.id)}/>
                    // <View></View>
                ))}
            </ScrollView>

            <Button
                mode='contained-tonal'
                buttonColor={colors.sblue}
                textColor={'white'}
                className=" mx-5 my-3 mb-0 mt-5"
                onPress={() => setCriarSalaFormVisible(true)}
                
            >
                Criar sala
            </Button>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    segmentButtons: {
        marginVertical: 15,
        marginHorizontal: 20
    }
})