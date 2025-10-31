import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, Modal as ModalN, Pressable, Alert, TouchableOpacity } from "react-native"
import { Button, Portal, TextInput as TextInputPaper, Modal } from "react-native-paper"
import { useForm, Controller} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { colors } from "../../styles/colors";
import * as z from 'zod'
import { newSala, NovoUsuario, Sala, UserGroup, Usuario } from "../types/apiTypes";
import {Picker} from '@react-native-picker/picker'
import { CustomTextInput as TextInput } from "./CustomTextInput";
import GroupsSelector from "./GroupsSelector"
import { useAuthContext } from "../contexts/AuthContext"


interface propsCriarUsuarioForm{
    visible: boolean,
    onClose: () => void,
    onSubmit: (novoUsuario: NovoUsuario, id?: number) => void,

}

type typeRole = 'User' | 'Admin'

const usuarioSchema = z.object({
    username: z.string().min(1, 'Esse campo é obrigatório'),
    password: z.string().min(1, 'Esse campo é obrigatório').min(8, 'A senha deve ter no mínimo 8 caracteres').refine(password => isNaN(Number(password)),{error: 'A senha não pode ser apenas números'}),
    confirm_password: z.string().min(1, 'Esse campo é obrigatório'),
    nome: z.string(),
    email: z.email('E-mail inválido').or(z.literal('')),
    role: z.enum(['User', 'Admin']).default('User').optional(),
    groups: z.array(z.number('Os IDs, de grupo devem ser números inteiros').min(1, 'O número de grupo deve ser no mínimo 1'))
}).refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem.',
    path: ['confirm_password']
})

type UsuarioFormData = z.infer<typeof usuarioSchema>


export default function UsuariosForms({onClose, visible, onSubmit }: propsCriarUsuarioForm){

    const {usersGroups} = useAuthContext()

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {control, handleSubmit, reset} = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            username: '',
            email: '',
            role: 'User',
            password: '',
            confirm_password: '',
            groups: [],
            nome: '',
        }
    })

    useEffect(() => {
        reset()
    },[visible])

    const SubmitData = async ({role, ...data}: UsuarioFormData) => {

        // console.log({...data, is_superuser: role === 'Admin'})
        await onSubmit({...data, is_superuser: role === 'Admin'
        })
        onClose()


    }

    return (
        <Portal>
        <Modal visible={visible} onDismiss={onClose} style={{

        }}>
                <View className="bg-white rounded-lg p-8 py-8 m-4 max-w-sm w-full self-center">
                    <Text className=" text-center mb-8 text-4xl font-bold">Criar Usuário</Text>
                    <Controller
                        control={control}
                        name="username"
                        render={({field, fieldState}) => (
                            <TextInput
                                label="Nome de usuário"
                                value={field.value}
                                onChangeText={field.onChange}
                                autoCapitalize="none"
                                keyboardType='default'
                                mode="outlined"
                                activeOutlineColor='#004A8D'
                                errorMessage={fieldState.error?.message}
                                className=" mb-2"
                            />
                        )}
                    
                    />
                    
                    <Controller
                        control={control}
                        name="password"
                        render={({field, fieldState}) => (
                            <TextInput
                                label="Senha"
                                value={field.value}
                                onChangeText={field.onChange}
                                autoCapitalize="none"
                                keyboardType='default'
                                mode="outlined"
                                activeOutlineColor='#004A8D'
                                secureTextEntry={!showPassword}
                                errorMessage={fieldState.error?.message}
                                right={<TextInputPaper.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)}/>}                        
                                className=" mb-2"
                            />
                        )}                    
                    />
                    
                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({field, fieldState}) => (
                            <TextInput
                                label="Confirme a senha"
                                value={field.value}
                                onChangeText={field.onChange}
                                autoCapitalize="none"
                                keyboardType='default'
                                mode="outlined"
                                secureTextEntry={!showConfirmPassword}
                                activeOutlineColor='#004A8D'
                                errorMessage={fieldState.error?.message}
                                right={<TextInputPaper.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)}/>}                        
                                className=" mb-2"
                            />
                            
                        )}                    
                    />
                    
                    <Controller
                        control={control}
                        name="nome"
                        render={({field, fieldState}) => (
                            <TextInput
                                label="Nome completo"
                                value={field.value}
                                onChangeText={field.onChange}
                                autoCapitalize="none"
                                keyboardType='default'
                                mode="outlined"
                                errorMessage={fieldState.error?.message}
                                activeOutlineColor='#004A8D'
                                className=" mb-2"
                            />
                        )}                    
                    />
                    
                    <Controller
                        control={control}
                        name="email"
                        render={({field, fieldState}) => (
                            <TextInput
                                label="Email"
                                value={field.value}
                                onChangeText={field.onChange}
                                autoCapitalize="none"
                                keyboardType='email-address'
                                mode="outlined"
                                activeOutlineColor='#004A8D'
                                errorMessage={fieldState.error?.message}
                                className=" mb-2"
                            />
                        )}                    
                    />
                    
                    <Controller
                        control={control}
                        name="groups"
                        render={({field, fieldState}) => (
                            <GroupsSelector usersGroups={usersGroups} selectedGroupsProps={field.value} setSelectedGroupsProps={field.onChange} />
                        )}
                    />

                    <Controller
                        control={control}
                        name="role"
                        render={({field}) => (
                            <Picker
                                selectedValue={field.value}
                                onValueChange={field.onChange}
                                style={styles.picker}
                            >
                                <Picker.Item
                                    key={'User'}
                                    label="Usuário comum"
                                    value={'User'}
                                    color={colors.syellow}
                                    />

                                <Picker.Item
                                    key={'Admin'}
                                    label="Admin"
                                    value={'Admin'}
                                    color={colors.sgreen}
                                    // style={{paddingLeft: 100}}
                                />
                            </Picker>
                        )}
                    />

                    <Button 
                        mode='contained-tonal'
                        className=" mt-3"
                        buttonColor={colors.sblue}
                        textColor="white"
                        onPress={handleSubmit(SubmitData)}
                    >
                        Criar usuário
                    </Button>
                    
                </View>
        </Modal>
        </Portal>
    )

}

const styles = StyleSheet.create({

    centeredView: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    modal:{
        backgroundColor: 'white'
    },

    input: {
        marginBottom: 16,
    },

    picker:{
        width: '100%',
        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: colors.sblue
    },
    tag: {
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
        marginBottom: 8
    },
    selectedTag: {
        backgroundColor: colors.sblue + '20',
        borderColor: colors.sblue,
        color: colors.sblue
    },
    tagText: {
        color: '#000',
        fontSize: 14
    }

})






















