import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { obterToken, removerToken } from './servicos/servicoArmazenamento';
import api from './api/axiosConfig';
// import { usuarioLogado } from './servicos/servicoAutenticacao';
import { getAllUsersGroups, usuarioLogado } from './servicos/servicoUsuarios';
import { UserGroup, Usuario } from './types/apiTypes';
import { View, ActivityIndicator } from 'react-native';

type UserRole = 'user' | 'admin' | null;

interface AuthContextType {
  signIn: (role: UserRole) => void;
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
        // setMensagemErro(erro.message || 'Não foi possivel carregar os grupos de usuario')
        // if(erro.message.includes('Token de autenticação expirado ou inválido.')){
        //     signOut()
        // }
        // Alert.alert('Erro', mensagemErro)

    }
  }
  

  useEffect(() => {
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
    carregarGroups()
    verificarAutenticacao()
    // setTimeout(() => {
    //   // Exemplo: se houver um token, você extrai o papel dele
    //   // setUserRole('user'); // Exemplo de usuário comum
    //   // setUserRole('admin'); // Exemplo de admin
    // }, 1000);
  }, [userRole]);

  const authContext = {
    signIn: (role: UserRole) => {
      // Lógica de login: salvar token, definir o papel, etc.
      setUserRole(role);
    },
    signOut: async () => {
      // Lógica de logout: limpar token, redefinir o papel
      await removerToken()
      setUserRole(null);
    },
    userRole,
    user,
    usersGroups,
    isLoading,
  };

  if (isLoading) {
    // Você pode retornar uma tela de carregamento aqui
    return( 
      <View className='flex-1 bg-gray-50 justify-center p-16'>

        <ActivityIndicator size={80}/>
      </View>
    )

  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};