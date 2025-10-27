import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Text, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { ActivityIndicator, Avatar, Button, TextInput as TextInputPaper } from "react-native-paper";
import { CustomTextInput as TextInput } from "../components/CustomTextInput";
import * as z from 'zod'
import {useForm, Controller} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import { alterarSenha } from "../servicos/servicoUsuarios";
import { useAuthContext } from "../contexts/AuthContext";

const changePasswordSchema = z.object({
    old_password: z.string().min(1, 'Esse campo é obrigatório'),
    new_password: z.string().min(1, 'Esse campo é obrigatório'),
    confirm_new_password: z.string().min(1, 'Esse campo é obrigatório')
}).refine((data) => data.new_password === data.confirm_new_password, {
    error: 'As senhas não coincidem',
    path: ['confirm_new_password']
})

type changePasswordFormData = z.infer<typeof changePasswordSchema>

export default function AlterarSenhaScreen(){

    const {signOut} = useAuthContext()
    const navigation = useNavigation()
    const { control, handleSubmit } = useForm<changePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_new_password: ''
        }
    })

    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleAlterarSenha = async (data: changePasswordFormData) => {

        const alterarSenhaResult = await alterarSenha(data)
        if(!alterarSenhaResult.success){
            Alert.alert('Erro', alterarSenhaResult.errMessage)
            return
        }

        Alert.alert('Senha alterada', 'Sua senha foi alterada com sucesso', [
            {
                text: 'Ok',
                onPress: async () => await signOut(),
                style: 'default'
            }
        ])

    }


    return (
        <SafeAreaView className=" bg-gray-100 flex-1 justify-center">
            <KeyboardAvoidingView behavior="padding">

                <View className="max-w-sm w-full self-center bg-white shadow-sm px-6 rounded-xl">

                    <Text className=" text-3xl text-center my-14">Alterar Senha</Text>

                    <Controller
                        control={control}
                        name="old_password"
                        render={({field, fieldState}) => (
                            <TextInput
                                label="Senha Atual"
                                value={field.value}
                                onChangeText={field.onChange}
                                style={{marginBottom: 16}}
                                autoCapitalize="none"
                                keyboardType='default'
                                mode="outlined"
                                activeOutlineColor={colors.sblue}
                                secureTextEntry={!showOldPassword}
                                errorMessage={fieldState.error?.message}
                                right={<TextInputPaper.Icon icon="eye" onPress={() => setShowOldPassword(!showOldPassword)}/>}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="new_password"
                        render={({field, fieldState}) => (
                            <TextInput
                                label=" Nova Senha"
                                value={field.value}
                                onChangeText={field.onChange}
                                style={{marginBottom: 16}}
                                autoCapitalize="none"
                                keyboardType='default'
                                mode="outlined"
                                activeOutlineColor={colors.sblue}
                                secureTextEntry={!showPassword}
                                errorMessage={fieldState.error?.message}
                                right={<TextInputPaper.Icon icon="eye" onPress={() => setShowPassword(!showPassword)}/>}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirm_new_password"
                        render={({field, fieldState}) => (
                            <TextInput
                                label="Confirme a Nova Senha"
                                value={field.value}
                                onChangeText={field.onChange}
                                style={{marginBottom: 16}}
                                autoCapitalize="none"
                                keyboardType='default'
                                mode="outlined"
                                activeOutlineColor={colors.sblue}
                                secureTextEntry={!showConfirmPassword}
                                errorMessage={fieldState.error?.message}
                                right={<TextInputPaper.Icon icon="eye" onPress={() => setShowConfirmPassword(!showConfirmPassword)}/>}
                            />
                        )}
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
                            onPress={handleSubmit(handleAlterarSenha)}
                        
                        >
                            Confirmar
                        </Button>

                    </View>



                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )



}