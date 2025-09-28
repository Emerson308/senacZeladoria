import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { obterToken, removerToken, salvarToken } from './servicos/servicoArmazenamento';
import { realizarLogin } from './servicos/servicoAutenticacao';
import api from './api/axiosConfig';
// import { usuarioLogado } from './servicos/servicoAutenticacao';
import { getAllUsersGroups, usuarioLogado } from './servicos/servicoUsuarios';
import { UserGroup, Usuario } from './types/apiTypes';
import { View, ActivityIndicator, Text } from 'react-native';
import eventBus from './utils/eventBus';

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
    try{
        const resposta = await getAllUsersGroups()
        setUsersGroups(resposta)
        // console.log(resposta)
    } catch(erro: any){

    }
  }

  const verificarAutenticacao = async () => {
  const token = await obterToken();
  if (token){
    api.defaults.headers.common['Authorization'] = `Token ${token}`
    const usuario = await usuarioLogado();
    // console.log(usuario)
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
  setIsLoading(false);
}

  const deslogarUsuario = async () => {
    await removerToken()
    setUserRole(null);
    setUser(null)
    setUsersGroups([])

    delete api.defaults.headers.common['Authorization']

  }

  const logarUsuario = async (username: string, password: string) => {
    try{
      const resposta = await realizarLogin({username: username, password: password})
      // console.log(resposta)
      await salvarToken(resposta.token)
      api.defaults.headers.common['Authorization'] = `Token ${resposta.token}`
      setUser(resposta.user_data)
      if (resposta.user_data.is_superuser){
        setUserRole('admin')
      } else{
        setUserRole('user')
        
      }
      await carregarGroups()
    } catch(erro: any){
      throw new Error(erro)
    } finally{

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

        <ActivityIndicator size={80}/>
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