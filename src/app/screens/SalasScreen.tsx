import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Appbar, SegmentedButtons, BottomNavigation, Icon, Provider } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";
// import { UserStackParamList } from "../navigation/types/UserStackTypes";
import { newSala, Sala } from "../types/apiTypes";
import { criarNovaSala, editarSalaService, obterSalas } from "../servicos/servicoSalas";
import { marcarSalaComoLimpaService, excluirSalaService } from "../servicos/servicoSalas";
import { segmentSalaStatus } from "../types/types";
import SalaCard from "../components/SalaCard";
import { AdminStackParamList } from "../navigation/types/AdminStackTypes";





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
    const [mensagemErro, setMensagemErro] = useState('')
    const [salas, setSalas] = useState<Sala[]>([])
    const [filtro, setFiltro] = useState<segmentSalaStatus>('Todas')
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
        setRefreshingSalas(true)
        try{
            const obtendoSalas = await obterSalas()
            const salasAtivas = obtendoSalas.filter(sala => sala.ativa)
            const salasInativas = obtendoSalas.filter(sala => !sala.ativa)

            if(userRole === 'user'){
                setSalas(salasAtivas)
                return
            }

            setSalas([...salasAtivas, ...salasInativas])
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)

        } finally{
            setRefreshingSalas(false)
        }
    }

    const marcarSalaComoLimpa = async (id: string) => {
        try{
            await marcarSalaComoLimpaService(id, '')
            await carregarSalasComLoading()
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar as salas.')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }                
            
        } finally{

        }
    }

    async function excluirSala(id: string){
        try{
            await excluirSalaService(id);
            await carregarSalas();

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

    const salasFiltradas = salas.filter(sala => {
        if (filtro === 'Limpas'){
            return sala.status_limpeza === 'Limpa'
        }
        if (filtro === 'Limpeza pendente'){
            return sala.status_limpeza === 'Limpeza Pendente'
        }

        return true
    })


    const contagemSalas = salas.length
    const contagemSalasLimpas = salas.filter(sala => sala.status_limpeza === 'Limpa').length
    const contagemSalasPendentes = salas.filter(sala => sala.status_limpeza === 'Limpeza Pendente').length


    return (
        <Provider>
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">
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
                    },
                    {
                        value: 'Limpas',
                        label: `Limpas (${contagemSalasLimpas})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12},
                    },
                    {
                        value:'Limpeza pendente',
                        label: `Pendente (${contagemSalasPendentes})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12},
                    }
                ]}
            />


            <ScrollView className="p-3"
                refreshControl={<RefreshControl refreshing={refreshingSalas} onRefresh={carregarSalas}/>}
            >
                {salasFiltradas.map((sala) => (
                    <SalaCard key={sala.id} userGroups={user.groups} userRole={userRole} marcarSalaComoLimpa={marcarSalaComoLimpa} editarSala={() => navigation.navigate('FormSala', {sala: sala})} excluirSala={handleExcluirSala} sala={sala} onPress={() => navigation.navigate('DetalhesSala', {id: sala.qr_code_id})}/>
                ))}
            </ScrollView>

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
        </Provider>
    );
};


const styles = StyleSheet.create({
    segmentButtons: {
        marginVertical: 15,
        marginHorizontal: 15
    }
})