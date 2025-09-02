import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Appbar, SegmentedButtons, BottomNavigation, Icon } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";
import { Usuario } from "../types/apiTypes";
import { segmentUsuarioStatus } from "../types/types";
import { obterUsuarios } from "../servicos/servicoUsuarios";
import UsuarioCard from "../components/UsuarioCard";



export default function UsuariosScreen(){

    const authContext = useContext(AuthContext)

    if(!authContext){
        return null
    }

    const {signOut} = authContext
    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [filtro, setFiltro] = useState<segmentUsuarioStatus>('Todos')
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([])
    const [criarUsuarioForm, setCriarUsuarioFormVisible] = useState(false)


    const carregarUsuarios = async () => {
        try{
            const obtendoUsuarios = await obterUsuarios()
            setUsuarios(obtendoUsuarios)
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar os usuarios')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
            
        }
    }
    
    useEffect(() => {
        setCarregando(true)
        carregarUsuarios()
        setCarregando(false)
    }, [])


    useEffect(() => {
        if(filtro === 'Todos'){
            setUsuariosFiltrados(usuarios)
        } else if (filtro === 'Admins'){
            const usuariosAdmin = usuarios.filter( item => item.is_staff === true)
            setUsuariosFiltrados(usuariosAdmin)
        } else if (filtro === 'Usuários padrões'){
            const usuariosAdmin = usuarios.filter( item => item.is_staff === false)
            setUsuariosFiltrados(usuariosAdmin)
        }
    }, [filtro, usuarios])
    
    

    if(carregando){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }



    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-20">

            <SegmentedButtons
                value={filtro}
                onValueChange={setFiltro}
                style={styles.segmentButtons}
                buttons={[
                    {
                        value: 'Todos',
                        label: 'Todos',
                        checkedColor: 'black',
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                    {
                        value: 'Admins',
                        label: 'Admins',
                        checkedColor: 'black',
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                    {
                        value: 'Usuários padrões',
                        label: 'Usuários padrões',
                        checkedColor: 'black',
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                ]}
            />


            

            <ScrollView className="p-3">
                {usuariosFiltrados.map((usuario) => (
                    // <View key={usuario.id} className=" border-2 border-black h-6 mb-2">

                    // </View>
                    <UsuarioCard key={usuario.id} usuario={usuario}/>
                    // <AdminSalaCard key={sala.id} marcarSalaComoLimpa={marcarSalaComoLimpa} editarSala={btnEditarSala} excluirSala={excluirSala} sala={sala} onPress={async () => irParaDetalhesSala(sala.id)}/>
                    // <View></View>
                ))}
            </ScrollView>
            
            <Button
                mode='contained-tonal'
                buttonColor={colors.sblue}
                textColor={'white'}
                className=" mx-5 my-3 mb-0 mt-5"
                onPress={() => setCriarUsuarioFormVisible(true)}
                
            >
                Criar Usuário
            </Button>


        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    segmentButtons: {
        marginVertical: 15,
        marginHorizontal: 20
    }
})