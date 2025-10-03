import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Card, Button, Text, ActivityIndicator, Appbar, SegmentedButtons, BottomNavigation, Icon } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from "../AuthContext";
import { colors } from "../../styles/colors";
import { NovoUsuario, UserGroup, Usuario } from "../types/apiTypes";
import { criarUsuarioService, getAllUsersGroups, obterUsuarios } from "../servicos/servicoUsuarios";
import UsuarioCard from "../components/UsuarioCard";
import UsuariosForms from "../components/UsuarioForms";
import Toast from "react-native-toast-message";



type segmentUsuarioStatus = 'Todos' | 'Admins' | 'Usuários padrões'

export default function UsuariosScreen(){

    const authContext = useContext(AuthContext)

    if(!authContext){
        return null
    }

    if(authContext.usersGroups.length === 0){
        return null
    }

    const {signOut, usersGroups} = authContext
    const [carregando, setCarregando] = useState(false)
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [filtro, setFiltro] = useState<segmentUsuarioStatus>('Todos')
    const [criarUsuarioForm, setCriarUsuarioFormVisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    
    const carregarUsuarios = async () => {
        setRefreshing(true)
        const obterUsuariosResult = await obterUsuarios()
        if(!obterUsuariosResult.success){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: obterUsuariosResult.errMessage,
                position: 'bottom',
                visibilityTime: 3000
            });
            return;
        }
        setUsuarios(obterUsuariosResult.data)
        setRefreshing(false)

    }

    const criarUsuario = async (novoUsuario: NovoUsuario) => {
        setCarregando(true)
        // const criarUsuarioServiceResult = await criarUsuarioService(novoUsuario)
        // if(!criarUsuarioServiceResult.success){
        //     Toast.show({
        //         type: 'error',
        //         text1: 'Erro',
        //         text2: criarUsuarioServiceResult.errMessage,
        //         position: 'bottom',
        //         visibilityTime: 3000
        //     })
        // }
        await carregarUsuarios();
        Toast.show({
            type: 'success',
            text1: 'Usuário criado',
            text2: `O usuário foi criado com sucesso!`,
            position: 'bottom',
            
            visibilityTime: 3000
        })
        setCarregando(false)
    }

    useFocusEffect( React.useCallback(() => {
        setCarregando(true)
        // carregarGroups()
        carregarUsuarios()
        setCarregando(false)
    },[]))
    
    if(carregando){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }

    const usuariosFiltrados = usuarios.filter(usuario => {
        if (filtro === 'Admins'){
            return usuario.is_superuser
        }
        if(filtro === 'Usuários padrões'){
            return !usuario.is_superuser
        }
        return true
    })

    const contagemUsuarios = usuarios.length;
    const contagemUsuariosAdmins = usuarios.filter(usuario => usuario.is_superuser === true).length
    const contagemUsuariosMembros = usuarios.filter(usuario => usuario.is_superuser === false).length
    
    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4 pb-10">

            <UsuariosForms visible={criarUsuarioForm} onClose={() => setCriarUsuarioFormVisible(false)} onSubmit={criarUsuario}/>

            <SegmentedButtons
                value={filtro}
                onValueChange={setFiltro}
                style={{marginHorizontal:15, marginVertical: 15}}
                density="regular"
                theme={{colors: {secondaryContainer: colors.sblue + '30'}}}
                buttons={[
                    {
                        value: 'Todos',
                        label: `Todos (${contagemUsuarios})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12, flexWrap: 'wrap', flex: 1, height: 'auto'},
                        
                    },
                    {
                        value: 'Admins',
                        label: `Admins (${contagemUsuariosAdmins})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12, flexWrap: 'wrap', flex: 1, height: 'auto'},
                        
                    },
                    {
                        value: 'Usuários padrões',
                        label: `Membros (${contagemUsuariosMembros})`,
                        checkedColor: 'black',
                        labelStyle:{fontSize: 12, flexWrap: 'wrap', textAlign: 'center', flex: 1, height: 'auto'},
                        
                    },
                ]}
            />

            <ScrollView className="p-3 flex-1" refreshControl={<RefreshControl onRefresh={carregarUsuarios} refreshing={refreshing}/>}>
                {usuariosFiltrados.map((usuario) => (
                    <UsuarioCard key={usuario.id} usuario={usuario} usersGroups={usersGroups}/>
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

