import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { obterToken, removerToken } from './servicos/servicoArmazenamento';
import api from './api/axiosConfig';
// import { usuarioLogado } from './servicos/servicoAutenticacao';
import { usuarioLogado } from './servicos/servicoUsuarios';

type UserRole = 'user' | 'admin' | null;

interface AuthContextType {
  signIn: (role: UserRole) => void;
  signOut: () => void;
  userRole: UserRole;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token){
        api.defaults.headers.common['Authorization'] = `Token ${token}`
        const usuario = await usuarioLogado();
        // console.log(usuario)
        if(usuario){
          if(usuario.is_staff){
            setUserRole('admin')
          } else{
            
            setUserRole('user')
          }
          
        }


      }
      setIsLoading(false);
    }
    verificarAutenticacao()
    // setTimeout(() => {
    //   // Exemplo: se houver um token, você extrai o papel dele
    //   // setUserRole('user'); // Exemplo de usuário comum
    //   // setUserRole('admin'); // Exemplo de admin
    // }, 1000);
  }, []);

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
    isLoading,
  };

  if (isLoading) {
    // Você pode retornar uma tela de carregamento aqui
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};