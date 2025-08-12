import React, { createContext, useState, useEffect, ReactNode } from 'react';

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
    // Simule a verificação de um token ou sessão salvo
    // Na vida real, você faria uma chamada assíncrona aqui (e.g. AsyncStorage)
    setIsLoading(false);
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
    signOut: () => {
      // Lógica de logout: limpar token, redefinir o papel
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