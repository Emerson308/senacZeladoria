// import { StatusBar } from 'expo-status-bar';
// import { Text, View } from 'react-native';

import '../styles/global.css'
 
// export default function App() {
//   return (
//     <View className="flex-1 bg-white items-center justify-center">
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// App.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './AuthContext';

import { AuthNavigator } from './navigation/stacks/AuthStack';
import { UserNavigator } from './navigation/stacks/UserStack';
import { AdminNavigator } from './navigation/stacks/AdminStack';

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
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

