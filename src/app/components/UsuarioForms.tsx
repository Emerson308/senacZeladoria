import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native"
// import toast
// import { Alert } from "react-native";
import { Button, Portal, TextInput } from "react-native-paper"
import { colors } from "../../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { newSala, NovoUsuario, Sala, Usuario } from "../types/apiTypes";
import {Picker} from '@react-native-picker/picker'

interface propsCriarUsuarioForm{
    visible: boolean,
    onClose: () => void,
    onSubmit: (novoUsuario: NovoUsuario, id?: number) => void,

}

type typeRole = 'User' | 'Admin'

export default function UsuariosForms({onClose, visible, onSubmit }: propsCriarUsuarioForm){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<typeRole>('User')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // const [] = useState('User')

    useEffect(() => {
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setEmail('')
        setRole('User')
    },[visible])

    const handleSubmit = () => {
        if (username === '' || password === '' || confirmPassword === ''){
            Alert.alert('Erro', 'Insira todos os campos');
            return
        }

        if(password !== confirmPassword){
            Alert.alert('Erro', 'As senhas não coincidem')
            return;
        }

        let isSuperuser = false;
        if (role === 'Admin'){
            isSuperuser = true
        }

        onSubmit({
            username,
            password,
            confirm_password: confirmPassword,
            email,
            is_superuser: isSuperuser
        })

        onClose()


    }

    return (
        <Modal className=" m-20" visible={visible} onRequestClose={() => onClose} onDismiss={onClose} animationType="slide" transparent={true} style={styles.modal}>
            <Pressable onPress={onClose} style={styles.centeredView} className=" flex-1 justify-center items-center">
                <Pressable className="bg-white rounded-lg p-8 m-4 max-w-sm w-full" onPress={(e) => e.stopPropagation()}>
                    <Text className=" text-center mb-8 text-4xl font-bold">Criar Usuário</Text>
                    <TextInput
                        label="Nome de usuário"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                    />
                    

                    <TextInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        // keyboardType='default'
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                        secureTextEntry={!showPassword}
                        right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)}/>}                        
                        />
                    

                    <TextInput
                        label="Confirme a senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        secureTextEntry={!showConfirmPassword}
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                        right={<TextInput.Icon icon="eye" onPress={() => setShowConfirmPassword(!showConfirmPassword)}/>}                        
                        
                    />
                    

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType='email-address'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                    />

                    <Picker
                        selectedValue={role}
                        onValueChange={setRole}
                        style={styles.picker}
                        // className=" w-full border-2 border-solid border-sblue"
                    >
                        <Picker.Item
                            key={'User'}
                            label="Usuário comum"
                            value={'User'}
                        />

                        <Picker.Item
                            key={'Admin'}
                            label="Admin"
                            value={'Admin'}
                        />
                    </Picker>
                    
                    

                    <Button 
                        mode='contained-tonal'
                        className=" mt-3"
                        buttonColor={colors.sblue}
                        textColor="white"
                        onPress={handleSubmit}
                    >
                        Criar usuário
                    </Button>
                    
                </Pressable>
            </Pressable>
        </Modal>
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
    }
    

})






















