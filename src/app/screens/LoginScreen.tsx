import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Text } from 'react-native';
import { TextInput as TextInputPaper ,Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod'
import {useForm, Controller} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {CustomTextInput as TextInput} from '../components/CustomTextInput';
import { useAuthContext } from '../contexts/AuthContext';

const LoginSchema = z.object({
  username: z.string().min(1, 'Esse campo é obrigatório'),
  password: z.string().min(1, 'Esse campo é obrigatório')
})

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginScreen = () => {
  const { signIn } = useAuthContext();

  const [carregando, setCarregando] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema), 
    defaultValues: {
      username: '',
      password: ''
  }})

  const onSubmit = async (data: LoginFormData) => {
    setCarregando(true);
    signIn(data.username, data.password)
    setCarregando(false)
  }


  if(carregando){
    return(
      <View className='flex-1 bg-gray-50 justify-center p-16'>

        <ActivityIndicator size={80}/>
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50 justify-center p-16'>
      <KeyboardAvoidingView behavior='padding'>

        <View className='items-center mb-10'>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Senac_logo.svg/1200px-Senac_logo.svg.png" }}
            resizeMode="contain"
            className='h-24 w-40 mb-10'
          />
          <Text className='items-center text-3xl font-bold font-regular'>Login</Text>
        </View>

        <View className='max-w-sm w-full gap-4 self-center'>
          <View>
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <TextInput
                  label="Usuário"
                  value={field.value}
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                  keyboardType="default"
                  mode="outlined"
                  activeOutlineColor='#004A8D'
                  errorMessage={fieldState.error?.message}
                />
            )}
            />

          </View>

          <View>
            <Controller
              control={control}
              name='password'
              render={({ field, fieldState }) => (
                <TextInput
                  label="Senha"
                  value={field.value}
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                  keyboardType='default'
                  mode="outlined"
                  activeOutlineColor='#004A8D'
                  secureTextEntry={!showPassword}
                  right={<TextInputPaper.Icon icon="eye" onPress={() => setShowPassword(!showPassword)}/>}
                  errorMessage={fieldState.error?.message}
                />
            )}
            />

          </View>
          
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            className='mb-6'
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Conectar
          </Button>
        </View>
       </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    height: 96,
    width: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#004A8D'
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen

