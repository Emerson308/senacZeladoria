import { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native"
// import toast
// import { Alert } from "react-native";
import { Button, Portal, TextInput, HelperText } from "react-native-paper"
import { colors } from "../../styles/colors";
import * as z from 'zod'
import { SafeAreaView } from "react-native-safe-area-context";
import { newSala, NovoUsuario, Sala, Usuario } from "../types/apiTypes";
import {Picker} from '@react-native-picker/picker'
import { AuthContext } from "../AuthContext";
import Toast from "react-native-toast-message";

interface propsCriarUsuarioForm{
    visible: boolean,
    onClose: () => void,
    onSubmit: (novoUsuario: NovoUsuario, id?: number) => void,

}

type typeRole = 'User' | 'Admin'

const RoleEnum = z.enum(['User', 'Admin'])

const usuarioSchema = z.object({
    username: z.string().min(1, 'O nome do usuário é obrigatório'),
    password: z.string().min(1, 'O campo senha é obrigatório'),
    confirmPassword: z.string().min(1, 'O campo confirme a senha é obrigatório'),
    nome: z.string().optional().or(z.literal('')),
    email: z.email('E-mail inválido').optional().or(z.literal('')),
    role: RoleEnum.default('User'),
    selectedGroups: z.array(z.number('Os IDs, de grupo devem ser números inteiros').min(0, 'O número de grupo deve ser no mínimo 0'))
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword']
})


export default function UsuariosForms({onClose, visible, onSubmit }: propsCriarUsuarioForm){

    const authContext = useContext(AuthContext)

    if(!authContext) {
        return null
    }

    const {usersGroups} = authContext

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [nome, setNome] = useState('')
    const [role, setRole] = useState<typeRole>('User')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([])
    // const [] = useState('User')

    useEffect(() => {
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setEmail('')
        setRole('User')
    },[visible])

    const handleSubmit = () => {

        const usuarioJSON = {
            username,
            password,
            confirmPassword,
            nome,
            email
        }

        const validationResult = usuarioSchema.safeParse(usuarioJSON)

        if(!validationResult.success){
            const errorMessages = validationResult.error.issues.map(err => {
                console.log(err)
                return err.message
            }).join('\n');
            Toast.show({
                type: 'error',
                text1: 'Erro de validação',
                text2: errorMessages,
                position: 'bottom',
                visibilityTime: 3000
            })
            return;
        }
        

        let isSuperuser = false;
        if (role === 'Admin'){
            isSuperuser = true
        }

        return

        onSubmit({
            username,
            password,
            confirm_password: confirmPassword,
            email,
            nome,
            groups: selectedGroups,
            is_superuser: isSuperuser
        })

        onClose()


    }

    return (
        <Modal className=" m-20" visible={visible} onRequestClose={() => onClose} onDismiss={onClose} animationType="slide" transparent={true} style={styles.modal}>
            <Pressable onPress={onClose} style={styles.centeredView} className=" flex-1 justify-center items-center">
                <Pressable className="bg-white rounded-lg p-4 py-8 m-4 max-w-sm w-full" onPress={(e) => e.stopPropagation()}>
                    <Text className=" text-center mb-8 text-4xl font-bold">Criar Usuário</Text>
                    <View className=" mb-4">
                        <TextInput
                            label="Nome de usuário"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            keyboardType='default'
                            mode="outlined"
                            // style={styles.input}
                            activeOutlineColor='#004A8D'
                            
                        />
                    </View>
                    

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
                        label="Nome completo"
                        value={nome}
                        // placeholder="Nome completo (Opcional)"
                        onChangeText={setNome}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
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

                    <Text style={{ marginBottom: 5 }}>Selecione o(s) Grupo(s) (Opcional):</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }} >
                        {
                            usersGroups.map((group) => (
                                <Pressable 
                                    key={group.id}
                                    style={[
                                        styles.tag,
                                        selectedGroups.includes(group.id) && styles.selectedTag,
                                    ]}
                                    onPress={() => {
                                        setSelectedGroups((prevSelected) => {
                                            if (prevSelected.includes(group.id)){
                                                return prevSelected.filter((id) => id !== group.id)
                                            } else{
                                                return [...prevSelected, group.id]
                                            }
                                        })
                                    }}
                                >
                                    <Text style={styles.tagText} >{group.name}</Text>
                                </Pressable>
                            ))
                        }
                    </View>

                    <Picker
                        selectedValue={role}
                        onValueChange={setRole}
                        style={styles.picker}
                        // itemStyle={{paddingLeft: 100}}
                        // className=" w-full border-2 border-solid border-sblue"
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






















