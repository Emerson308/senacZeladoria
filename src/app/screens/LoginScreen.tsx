import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, Provider as PaperProvider } from 'react-native-paper';
import { AuthContext } from '../AuthContext';
import { realizarLogin } from '../servicos/servicoAutenticacao';
import { salvarToken } from '../servicos/servicoArmazenamento';

const LoginScreen = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { signIn } = authContext;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const lidarComLogin = async () => {
    setCarregando(true);
    setMensagemErro('');
    try{
      const resposta = await realizarLogin({username: username, password: password})
      // console.log(resposta)
      await salvarToken(resposta.token)
      if (resposta.user_data.is_staff){
        signIn('admin')
      } else{
        signIn('user')

      }
    } catch(erro: any){
      setMensagemErro(erro.message || 'Ocorreu um erro ao tentar fazer login. Tente novamente.')
    } finally{
      setCarregando(false)
    }

  }

  if(carregando){
    return(
      <View className='flex-1 bg-gray-50 justify-center p-16'>

        <ActivityIndicator size={80}/>
      </View>
    )
  }

  if(mensagemErro){
    return(
      <View className='flex-1 bg-gray-50 justify-center p-16'>
        <Text className='text-center'>{mensagemErro}</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-gray-50 justify-center p-16'>
      <View className='items-center mb-10'>
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Senac_logo.svg/1200px-Senac_logo.svg.png" }}
          resizeMode="contain"
          className='h-24 w-40 mb-10'
        />
        <Text className='items-center text-3xl font-bold font-regular'>Login</Text>
      </View>

      <View className='max-w-sm w-full self-center'>
        {/* Campo de Usuário */}
        <TextInput
          label="Usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="default"
          mode="outlined"
          style={styles.input}
          activeOutlineColor='#004A8D'
          />

        {/* Campo de Senha */}
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          // keyboardType="visible-password"
          mode="outlined"
          style={styles.input}
          activeOutlineColor='#004A8D'
          secureTextEntry
          right={<TextInput.Icon icon="eye"/>}
        />
        
        {/* Botão de Esqueceu a senha */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Botão de Conectar */}
        <Button
          mode="contained"
          onPress={lidarComLogin} //() => signIn('user')
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Conectar
        </Button>
      </View>
    </View>
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
    height: 96, // h-24
    width: 160, // w-40
    marginBottom: 24, // mb-10
  },
  title: {
    fontSize: 32, // text-3xl
    fontWeight: 'bold', // font-bold
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 384, // max-w-sm
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
    color: '#667eea', // A cor padrão de um link do Tailwind
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

export default function App() {
  return (
    <PaperProvider>
      <LoginScreen />
    </PaperProvider>
  );
}