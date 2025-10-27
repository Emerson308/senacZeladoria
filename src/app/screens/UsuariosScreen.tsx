import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Card, Button, Text, Appbar, SegmentedButtons, BottomNavigation, Icon } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors } from "../../styles/colors";
import { NovoUsuario, UserGroup, Usuario } from "../types/apiTypes";
import { criarUsuarioService, getAllUsersGroups, obterUsuarios } from "../servicos/servicoUsuarios";
import UsuarioCard from "../components/cards/UsuarioCard";
import UsuariosForms from "../components/UsuarioForms";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderScreen from "../components/HeaderScreen";
import { normalizarTexto, showErrorToast } from "../utils/functions";
import {Ionicons} from '@expo/vector-icons';
import FiltersOptions from "../components/FiltersOptions";
import FilterSelector from "../components/FilterSelector";
import LoadingCard from "../components/cards/LoadingCard";
import { useAuthContext } from "../contexts/AuthContext";



type UsuarioStatus = 'Todos' | 'Admin' | 'Usuário padrão'

export default function UsuariosScreen(){

    const {usersGroups} = useAuthContext()
    const [carregando, setCarregando] = useState(false)
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [criarUsuarioForm, setCriarUsuarioFormVisible] = useState(false)
    const [searchUsuariosText, setSearchUsuariosText] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [filtroOptionsVisible, setFiltroOptionsVisible] = useState(false)

    const [filtroUserStatus, setFiltroUserStatus] = useState<UsuarioStatus>('Todos')
    const [filtroUserGroup, setFiltroUserGroup] = useState<string[]>([])


    const carregarUsuarios = async () => {
        setRefreshing(true)
        const obterUsuariosResult = await obterUsuarios()
        if(!obterUsuariosResult.success){
            showErrorToast({errMessage: obterUsuariosResult.errMessage})
            return;
        }
        setUsuarios(obterUsuariosResult.data)
        setRefreshing(false)

    }

    const criarUsuario = async (novoUsuario: NovoUsuario) => {
        // setCarregando(true)
        // console.log(novoUsuario)
        const criarUsuarioServiceResult = await criarUsuarioService(novoUsuario)
        if(!criarUsuarioServiceResult.success){
            showErrorToast({errMessage: criarUsuarioServiceResult.errMessage})
            return
        }
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
        carregarUsuarios().then(() => setCarregando(false))
    },[]))
    
    const searchUsuariosTextFormatado = normalizarTexto(searchUsuariosText)

    const usuariosFiltrados = usuarios.filter(usuario => {
        const usernameFormatado = normalizarTexto(usuario.username)
        const emailFormatado = normalizarTexto(usuario.email)
        const nomeFormatado = normalizarTexto(usuario.nome)
        
        if(usernameFormatado.includes(searchUsuariosTextFormatado) ||
           emailFormatado.includes(searchUsuariosTextFormatado) ||
           nomeFormatado.includes(searchUsuariosTextFormatado)
        ){
            return (
                (filtroUserStatus === 'Todos' ? true : usuario.is_superuser === (filtroUserStatus === 'Admin'))
                &&
                (
                    filtroUserGroup.length === 0
                        ? true
                        : (
                            filtroUserGroup.every(groupId => usuario.groups.includes(Number(groupId))) ||
                            (filtroUserGroup.includes('none') && usuario.groups.length === 0)
                        )
                )
            )
        }

    })

    const contagemUsuarios = usuarios.length;
    const contagemUsuariosAdmins = usuarios.filter(usuario => usuario.is_superuser === true).length
    const contagemUsuariosMembros = usuarios.filter(usuario => usuario.is_superuser === false).length

    const contagemUsuariosGroups = usersGroups.map(group => {
        const newGroup ={
            groupId: group.id,
            groupName: group.name,
            contagem: usuarios.filter(usuario => {
                return usuario.groups.some(userGroup => userGroup === group.id)
            }).length
        }
        return newGroup
    })


    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100 pb-4">
            <HeaderScreen
                headerText="Usuários"
                // filterOptions={true}
                showFilterOptions={() => setFiltroOptionsVisible(true)}
                searchBar={{searchLabel: 'Pesquisar usuários', searchText: searchUsuariosText, setSearchText: setSearchUsuariosText}}
            />

            <FiltersOptions visible={filtroOptionsVisible} onDismiss={() => setFiltroOptionsVisible(false)}>
                <FilterSelector
                    label="Status do usuário"
                    type="single"
                    defaultValue="Todos"
                    buttons={[
                        { label: `Admin (${contagemUsuariosAdmins})`, value: 'Admin' },
                        { label: `Usuários padrões (${contagemUsuariosMembros})`, value: 'Usuário padrão' },
                    ]}
                    value={filtroUserStatus}
                    onValueChange={setFiltroUserStatus}
                />

                {usersGroups.length > 0 &&
                    <FilterSelector
                        label="Grupo do usuário"
                        type="multiple"
                        noneValue={{label: 'Sem grupos', value: 'none'}}
                        buttons={[...usersGroups.map(group => ({ 
                            label: `${group.name} (${contagemUsuariosGroups.find(g => g.groupId === group.id)?.contagem || 0})`, 
                            value: String(group.id) }))]}
                        value={filtroUserGroup}
                        onValueChange={setFiltroUserGroup}
                    />
                }
            </FiltersOptions>

            <UsuariosForms visible={criarUsuarioForm} onClose={() => setCriarUsuarioFormVisible(false)} onSubmit={criarUsuario}/>

            {carregando ? (
                <ScrollView className="p-3 flex-1">
                    {[...Array(5)].map((_, i) => (
                        <LoadingCard key={i} loadingImage={true}/>
                    ))}
                </ScrollView>
            ) : usuariosFiltrados.length === 0 ?
                <View className=" flex-1 justify-center gap-2 items-center px-10">
                    <Ionicons name="close-circle-outline" size={64} color={colors.sgray}/>
                    <Text className="text-gray-500">Nenhum usuário encontrado</Text>
                </View>
                :
                <ScrollView className="p-3 flex-1" refreshControl={<RefreshControl onRefresh={carregarUsuarios} refreshing={refreshing}/>}>
                    {usuariosFiltrados.map((usuario) => (
                        <UsuarioCard key={usuario.id} usuario={usuario} usersGroups={usersGroups}/>
                    ))}
                </ScrollView>
                
            }

            
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

