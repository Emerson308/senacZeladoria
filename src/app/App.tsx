
import '../styles/global.css'
 
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import { View, Text } from 'react-native';
import { useAuthContext, AuthProvider } from './contexts/AuthContext';

const RootNavigation = () => {
  const { userRole } = useAuthContext();

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
  // return (
  //   <View>
  //     <Text>Teste</Text>
  //   </View>
  // )

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

