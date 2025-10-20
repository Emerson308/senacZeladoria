
import '../styles/global.css'
 
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthNavigator } from './navigation/stacks/AuthStack';
import { UserNavigator } from './navigation/stacks/UserStack';
import { AdminNavigator } from './navigation/stacks/AdminStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message'
import CustomToast from './components/CustomToast';
import { SalasProvider } from './contexts/SalasContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

const RootNavigation = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { userRole } = authContext;

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
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <PaperProvider>
          <AuthProvider>
            <NotificationsProvider>
              <SalasProvider>
                <RootNavigation />
                <CustomToast/>
              </SalasProvider>
            </NotificationsProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>

  );
}

