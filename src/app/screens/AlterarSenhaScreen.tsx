import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usuarioLogado } from "../servicos/servicoUsuarios";
import { Usuario } from "../types/apiTypes";
import { Alert, Text, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { ActivityIndicator, Avatar, Button, TextInput } from "react-native-paper";
import { AuthContext } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import { alterarSenha } from "../servicos/servicoUsuarios";


export default function AlterarSenhaScreen(){

    const authContext = useContext(AuthContext)

    if (!authContext){
        return null
    }

    const {signOut} = authContext

    const navigation = useNavigation()

    const [oldPassword, setOldPassword] = useState('')
    const [showOldPassword, setShowOldPassword] = useState(false)

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [confirmPassword, setConfirmPassword] = useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleAlterarSenha = async () => {
        if(!oldPassword || !password || !confirmPassword){
            Alert.alert('Erro', 'Preencha todos os campos')
            return;
        }

        if (password !== confirmPassword){
            Alert.alert('Erro', 'Os campos "Nova Senha" e "Confirme a Nova Senha tem que ser iguais"')
            return;
        }

        const senhas = {
            old_password: oldPassword,
            new_password: password,
            confirm_new_password: confirmPassword
        }

        try{
            const resposta = await alterarSenha(senhas)
            Alert.alert('Senha alterada', 'Sua senha foi alterada com sucesso', [
                {
                    text: 'Ok',
                    onPress: async () => await signOut(),
                    style: 'default'
                }
            ])
        } catch(erro: any){
            // console.error(erro)
            // console.log(erro.message)
            // console.log(typeof erro)
            if (erro.message.includes('A senha antiga está incorreta')){
                Alert.alert('Erro', 'A senha antiga está incorreta')
                return
                
            }
            if(erro.message.includes('Token inválido.')){
                signOut()
                return
            }
            Alert.alert('Erro', 'Erro ao conectar com o servidor. Tente novamente mais tarde.')
            
        }

    }


    return (
        <SafeAreaView className=" bg-gray-100 flex-1 justify-center">
            <KeyboardAvoidingView behavior="padding">

                <View className="max-w-sm w-full self-center bg-white shadow-sm px-6 rounded-xl">

                    <Text className=" text-3xl text-center my-14">Alterar Senha</Text>

                    <TextInput
                        label="Senha Atual"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        // className=" mb-4"
                        style={{marginBottom: 16}}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        activeOutlineColor={colors.sblue}
                        secureTextEntry={!showOldPassword}
                        right={<TextInput.Icon icon="eye" onPress={() => setShowOldPassword(!showOldPassword)}/>}
                    />

                    <TextInput
                        label=" Nova Senha"
                        value={password}
                        onChangeText={setPassword}
                        // className=" mb-4"
                        style={{marginBottom: 16}}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        activeOutlineColor={colors.sblue}
                        secureTextEntry={!showPassword}
                        right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)}/>}
                    />

                    <TextInput
                        label="Confirme a Nova Senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        // className=" mb-4"
                        style={{marginBottom: 16}}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        activeOutlineColor={colors.sblue}
                        secureTextEntry={!showConfirmPassword}
                        right={<TextInput.Icon icon="eye" onPress={() => setShowConfirmPassword(!showConfirmPassword)}/>}
                    />

                    <View className=" items-center justify-between flex-row gap-4 mb-6 mt-4">
                        <Button
                            style={{flex: 1, borderRadius: 10}}
                            mode='contained'
                            buttonColor={colors.sgray}    
                            onPress={navigation.goBack}
                            >
                            Cancelar
                        </Button>

                        <Button
                            mode='contained'
                            style={{flex: 1, borderRadius: 10}}
                            buttonColor={colors.sblue}
                            onPress={handleAlterarSenha}
                        
                        >
                            Confirmar
                        </Button>

                    </View>



                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )



}