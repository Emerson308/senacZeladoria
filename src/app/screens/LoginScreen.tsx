
// screens/LoginScreen.tsx
import React, { useContext, useState, useEffect } from 'react';
import { View, Button, Text, TextInput } from 'react-native';
import { AuthContext } from '../AuthContext';

// import '.../styles/global.css'

export default function LoginScreen() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // ou uma tela de erro
  }

  const { signIn } = authContext;
  const [email, setEmail] = useState('')

  return (
    <View className='flex min-h-full flex-col justify-center px-6 py-12 lg:pg-8 bg-gray-900'>
      <View className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <Text className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-white'>Login</Text>

      </View>
      
      <View className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <View>
          <Text className='block text-sm/6 font-medium text-gray-100'>Email</Text>
          <View className='mt-2'>
            <TextInput
              onChangeText={setEmail}
              value={email}
              autoCapitalize='none'
              autoComplete='email'
              keyboardType='email-address'
              className='black w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10  focus:outline-2  focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6'
              placeholder='Digite seu email'
              placeholderTextColor="gray"
            />
          </View>
        </View>
      </View>
        {/* <Button title="Entrar como Usuário Comum" onPress={() => signIn('user')} />
        <Button title="Entrar como Admin" onPress={() => signIn('admin')} /> */}
    </View>
  );
}