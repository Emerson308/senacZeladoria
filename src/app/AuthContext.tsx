import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { obterToken, removerToken, salvarToken } from './servicos/servicoArmazenamento';
import { realizarLogin } from './servicos/servicoAutenticacao';
import api from './api/axiosConfig';
// import { usuarioLogado } from './servicos/servicoAutenticacao';
import { getAllUsersGroups, usuarioLogado } from './servicos/servicoUsuarios';
import { UserGroup, Usuario } from './types/apiTypes';
import { View, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native';
import eventBus from './utils/eventBus';
import Toast from 'react-native-toast-message';
import { listarNotificações } from './servicos/servicoSalas';

type UserRole = 'user' | 'admin' | null;

interface AuthContextType {
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  userRole: UserRole;
  user: Usuario | null;
  usersGroups: UserGroup[];
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Usuario | null>(null);
  const [usersGroups, setUsersGroups] = useState<UserGroup[]>([]);


  const carregarGroups = async () => {
    const getAllUsersGroupsResult = await getAllUsersGroups()
    if(!getAllUsersGroupsResult.success){
      Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: getAllUsersGroupsResult.errMessage,
          position: 'bottom',
          visibilityTime: 3000
      })
      return;
    }

    setUsersGroups(getAllUsersGroupsResult.data)
  }

  const verificarAutenticacao = async () => {
    const obterTokenResult = await obterToken();
    if (!obterTokenResult.success){
      Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: obterTokenResult.errMessage,
          position: 'bottom',
          visibilityTime: 3000
      })
      setIsLoading(false);
      return
    }

    if(!obterTokenResult.data){
      setIsLoading(false);
      return
    }

    api.defaults.headers.common['Authorization'] = `Token ${obterTokenResult.data}`;
    // const result = await listarNotificações()

    const usuarioLogadoResult = await usuarioLogado();
    if(!usuarioLogadoResult.success){
      Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: usuarioLogadoResult.errMessage,
          position: 'bottom',
          visibilityTime: 3000
      })
      return
    }

    const usuario = usuarioLogadoResult.data
    if(usuario){
      setUser(usuario)
      if(usuario.is_superuser){
        setUserRole('admin')
      } else{        
        setUserRole('user')
      }
      // setUserRole('user')
    }
}

  const deslogarUsuario = async () => {

    const removerTokenResult = await removerToken()
    if(!removerTokenResult.success){
      console.log(removerTokenResult.errMessage)
    }
    setUserRole(null);
    setUser(null)
    setUsersGroups([])

    delete api.defaults.headers.common['Authorization']

  }

  const logarUsuario = async (username: string, password: string) => {
    const resposta = await realizarLogin({username: username, password: password})
    const {success} = resposta
    if(!success){
      Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: resposta.errMessage,
          position: 'bottom',
          visibilityTime: 3000
      })
      return
    }
    
    const loginData = resposta.data
    
    api.defaults.headers.common['Authorization'] = `Token ${loginData.token}`
    setUser(loginData.user_data)
    if (loginData.user_data.is_superuser){
      setUserRole('admin')
    } else{
      setUserRole('user')
    }
    await carregarGroups()
    
    const resultSalvarToken = await salvarToken(resposta.data.token)
    if(!resultSalvarToken.success){
      Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: resultSalvarToken.errMessage,
          position: 'bottom',
          visibilityTime: 3000
      })
    }
  }

  useEffect(() => {
    carregarGroups()
    verificarAutenticacao()

    eventBus.on('LOGOUT', async () => await deslogarUsuario())

    return () => {
      eventBus.off('LOGOUT')
    }
  }, []);

  const authContext = {
    signIn: async (username: string, password: string) => await logarUsuario(username, password),
    signOut: async () => await deslogarUsuario(),
    userRole,
    user,
    usersGroups,
    isLoading,
  };

  if (isLoading) {
    return( 
      <View className='flex-1 bg-gray-50 justify-center p-16'>
        <TouchableOpacity onPress={async () => await verificarAutenticacao()}>
          <ActivityIndicator size={80}/>
        </TouchableOpacity>
        <Text className=' mt-2 text-center'>Erro ao conectar na sua conta, Tente novamente mais tarde</Text>
      </View>
      
    )

  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};