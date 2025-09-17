import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Appbar, SegmentedButtons, BottomNavigation, Icon } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";
import { NovoUsuario, UserGroup, Usuario } from "../types/apiTypes";
import { segmentUsuarioStatus } from "../types/types";
import { criarUsuarioService, getAllUsersGroups, obterUsuarios } from "../servicos/servicoUsuarios";
import UsuarioCard from "../components/UsuarioCard";
import UsuariosForms from "../components/UsuarioForms";



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
    const [usersGroups, setUsersGroups] = useState<UserGroup[]>([])
    const [refreshing, setRefreshing] = useState(false)
    


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

    const criarUsuario = async (novoUsuario: NovoUsuario) => {
        setCarregando(true)
        try{
            const resposta = await criarUsuarioService(novoUsuario)
            await carregarUsuarios();
            setCarregando(false)
            Alert.alert('Usuário criado', `O usuário ${novoUsuario.username} foi criado com sucesso`)
            // setUsuarios(obtendoUsuarios)
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel criar o usuario')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)
            
        } finally{
            setCarregando(false)
        }
    }

    const carregarGroups = async () => {
        try{
            const resposta = await getAllUsersGroups()
            setUsersGroups(resposta)
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar os grupos de usuario')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro)

        }
    }

    useFocusEffect( React.useCallback(() => {
        carregarGroups()
        carregarUsuarios()
    },[]))
    
    useEffect(() => {
        setCarregando(true)
        carregarGroups()
        carregarUsuarios()
        setCarregando(false)
    }, [])


    useEffect(() => {
        if(filtro === 'Todos'){
            setUsuariosFiltrados(usuarios)
        } else if (filtro === 'Admins'){
            const usuariosAdmin = usuarios.filter( item => item.is_superuser === true)
            setUsuariosFiltrados(usuariosAdmin)
        } else if (filtro === 'Usuários padrões'){
            const usuariosAdmin = usuarios.filter( item => item.is_superuser === false)
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

    const contagemUsuarios = usuarios.length;
    const contagemUsuariosAdmins = usuarios.filter(usuario => usuario.is_superuser === true).length
    const contagemUsuariosMembros = usuarios.filter(usuario => usuario.is_superuser === false).length
    
    // const contagemUsuarios = 200;
    // const contagemUsuariosAdmins = 200
    // const contagemUsuariosMembros = 200


    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">

            <UsuariosForms visible={criarUsuarioForm} onClose={() => setCriarUsuarioFormVisible(false)} onSubmit={criarUsuario}/>

            <SegmentedButtons
                value={filtro}
                onValueChange={setFiltro}
                style={styles.segmentButtons}
                density="regular"
                theme={{colors: {secondaryContainer: colors.sblue + '30'}}}
                buttons={[
                    {
                        value: 'Todos',
                        label: `Todos (${contagemUsuarios})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12, flexWrap: 'wrap', flex: 1, height: 'auto'},
                        // style: {height: 70},
                        // style: {}
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                    {
                        value: 'Admins',
                        label: `Admins (${contagemUsuariosAdmins})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12, flexWrap: 'wrap', flex: 1, height: 'auto'},
                        // style: {height: 70},
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                    {
                        value: 'Usuários padrões',
                        label: `Membros (${contagemUsuariosMembros})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12, flexWrap: 'wrap', textAlign: 'center', flex: 1, height: 'auto'},
                        // style: {height: 70},
                        // style:{paddingHorizontal: 0, marginHorizontal: 0}
                        // style: {shadowOpacity: 0.3, shadowColor: colors.sblue},
                        
                    },
                ]}
            />


            

            <ScrollView className="p-3 flex-1" refreshControl={<RefreshControl onRefresh={carregarUsuarios} refreshing={refreshing}/>}>
                {usuariosFiltrados.map((usuario) => (
                    // <View key={usuario.id} className=" border-2 border-black h-6 mb-2">

                    // </View>
                    <UsuarioCard key={usuario.id} usuario={usuario} usersGroups={usersGroups}/>
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
                icon={'plus'}
                
            >
                Criar Usuário
            </Button>


        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    segmentButtons: {
        marginVertical: 15,
        marginHorizontal: 15
    }
})