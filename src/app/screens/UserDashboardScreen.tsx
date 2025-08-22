import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Appbar, SegmentedButtons } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import SalaCard from "../components/SalaCard";
import { RootStackParamList } from "../types/telaTypes";
import { Sala } from "../types/apiTypes";
import { obterSalas } from "../servicos/servicoSalas";
import { marcarSalaComoLimpaService } from "../servicos/servicoSalas";
import { segmentSalaStatus } from "../types/types";
// import '../styles/global.css'; // Certifique-se de que o NativeWind está configurado

export default function UserDashboardScreen() {
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

    // if (filtro) {
    //     console.log(filtro)

    // }    

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

    }, [filtro])

    useFocusEffect( React.useCallback(() => {
        carregarSalas()
    },[]))
    
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
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

    if(mensagemErro){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>
            <Text className='text-center'>{mensagemErro}</Text>
        </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-20">
            {/* <View className="bg-gray-100 w-full h-40 mb-6 justify-center p-2">
                <Text className=" text-3xl font-bold">Salas</Text>
            </View> */}
            <Appbar.Header>
                <Appbar.Content title='Salas' onPress={carregarSalasComLoading} className=""/>
                <Appbar.Action icon={'logout'} onPress={signOut}/>
            </Appbar.Header>

            <SegmentedButtons 
                value={filtro}
                onValueChange={setFiltro}
                style={styles.segmentButtons}
                buttons={[
                    {
                        value: 'Todas',
                        label: 'Todas',
                        checkedColor: '#404040'
                    },
                    {
                        value: 'Limpas',
                        label: 'Limpas',
                        checkedColor: '#404040'
                    },
                    {
                        value:'Limpeza pendente',
                        label: 'Limpeza pendente',
                        checkedColor: '#404040'
                    }
                ]}
            />

            <ScrollView className="p-3">
                {salasFiltradas.map((sala) => (
                    <SalaCard key={sala.id} marcarSalaComoLimpa={marcarSalaComoLimpa} sala={sala} onPress={async () => irParaDetalhesSala(sala.id)}/>
                    // <View></View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    segmentButtons: {
        marginVertical: 15,
        marginHorizontal: 20
    }
})