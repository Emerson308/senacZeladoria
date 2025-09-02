import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native"
// import toast
// import { Alert } from "react-native";
import { Button, Portal, TextInput } from "react-native-paper"
import { colors } from "../../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { newSala, Sala, Usuario } from "../types/apiTypes";

interface propsCriarUsuarioForm{
    visible: boolean,
    onClose: () => void,
    onSubmit: (usuario: Usuario, id?: number) => void,

}

export default function UsuariosForm({onClose, visible, onSubmit }: propsCriarUsuarioForm){

    const [username, setUsername] = useState('')

    return (
        <Modal className=" m-20" visible={visible} onRequestClose={() => onClose} onDismiss={onClose} animationType="slide" transparent={true} style={styles.modal}>
            <Pressable onPress={onClose} style={styles.centeredView} className=" flex-1 justify-center items-center">
                <Pressable className="bg-white rounded-lg p-8 m-4 max-w-sm w-full" onPress={(e) => e.stopPropagation()}>
                    <Text className=" text-center mb-8 text-4xl font-bold">Criar Usuário</Text>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                    />
                    

                        <Button 
                            mode='contained-tonal'
                            className=" mt-3"
                            buttonColor={colors.sblue}
                            textColor="white"
                            onPress={() => console.log('')}
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
    

})






















