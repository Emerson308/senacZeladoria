
import '../styles/global.css'
 
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './AuthContext';

import { AuthNavigator } from './navigation/stacks/AuthStack';
import { UserNavigator } from './navigation/stacks/UserStack';
import { AdminNavigator } from './navigation/stacks/AdminStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message'

const RootNavigation = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { userRole, signOut } = authContext;

  return (
      <NavigationContainer>
        {userRole === 'admin' ? (
          <AdminNavigator />
        ) : userRole === 'user' ? (
          <UserNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigation />
        <Toast/>
      </AuthProvider>
    </SafeAreaProvider>

  );
}

