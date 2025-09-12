
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native"
// import toast
// import { Alert } from "react-native";
import { Button, Portal, TextInput } from "react-native-paper"
import { colors } from "../../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { newSala, Sala } from "../types/apiTypes";

interface propsCriarSalaForm{
    // id?: number,
    visible: boolean,
    onClose: () => void,
    onSubmit: (sala: newSala, id?: string) => void,
    typeForm: 'Criar'| 'Editar',
    sala?: Sala| null

}

export default function SalaForms({onClose, visible, onSubmit, typeForm, sala}: propsCriarSalaForm){
    
    const [id, setId] = useState<string| undefined>(undefined)
    const [nomeSala, setNomeSala] = useState('')
    const [capacidade, setCapacidade] = useState('')
    const [descricao, setDescricao] = useState('')
    const [localizacao, setLocalizacao] = useState('')

    const handleSubmit = () => {
        if (nomeSala === '' || capacidade === '' || localizacao === '') {
            Alert.alert('Erro', 'Insira todos os campos');
            return;
        }

        const capacidadeConvertida = parseInt(capacidade, 10)
        // console.log(capacidadeConvertida)

        if(isNaN(capacidadeConvertida) && !Number.isInteger(capacidadeConvertida)){
            Alert.alert('Erro', 'Capacidade precisa ser um número válido')
            return;
        }
        if(String(capacidadeConvertida) !== capacidade.trim()){
            Alert.alert('Erro', 'Capacidade precisa ser um número válido')
            return;
            
        }

        if (typeForm === 'Criar'){
            onSubmit(
                {
                    nome_numero: nomeSala,
                    capacidade: capacidadeConvertida,
                    descricao: descricao,
                    localizacao: localizacao,
                
                }
            )

        } else if(typeForm === 'Editar'){
            onSubmit(
                // id: id,
                {
                    nome_numero: nomeSala,
                    capacidade: capacidadeConvertida,
                    descricao: descricao,
                    localizacao: localizacao,
                },
                id
            )
        }
        
        
        onClose()
    }

    useEffect(() => {
        if(visible && sala){
            setId(sala.qr_code_id)
            setNomeSala(sala.nome_numero)
            setCapacidade(String(sala.capacidade))
            setDescricao(sala.descricao)
            setLocalizacao(sala.localizacao)
        } else if(!visible){
            setNomeSala('')
            setCapacidade('')
            setDescricao('')
            setLocalizacao('')

        }


    }, [visible, ])
    
    return (
        <Modal className=" m-20" visible={visible} onRequestClose={() => onClose} onDismiss={onClose} animationType="slide" transparent={true} style={styles.modal}>
            <Pressable onPress={onClose} style={styles.centeredView} className=" flex-1 justify-center items-center">
                <Pressable className="bg-white rounded-lg p-8 m-4 max-w-sm w-full" onPress={(e) => e.stopPropagation()}>
                    {/* <Text>Oi</Text> */}
                    {
                        typeForm === 'Criar' ?
                        <Text className=" text-center mb-8 text-4xl font-bold">Criar sala</Text>
                        :
                        <Text className=" text-center mb-8 text-4xl font-bold">Editar sala</Text>

                    }
                    <TextInput
                        label="Nome da sala"
                        value={nomeSala}
                        onChangeText={setNomeSala}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                    />
                    
                    <TextInput
                        label="Capacidade"
                        value={capacidade}
                        onChangeText={setCapacidade}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                    />
                    
                    <TextInput
                        label="Descrição"
                        value={descricao}
                        onChangeText={setDescricao}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                    />
                    
                    <TextInput
                        label="Localização"
                        value={localizacao}
                        onChangeText={setLocalizacao}
                        autoCapitalize="none"
                        keyboardType='default'
                        mode="outlined"
                        style={styles.input}
                        activeOutlineColor='#004A8D'
                    />

                    {
                        typeForm === 'Criar' ?
                        <Button 
                            mode='contained-tonal'
                            className=" mt-3"
                            buttonColor={colors.sblue}
                            textColor="white"
                            onPress={handleSubmit}
                        >
                            Criar sala
                        </Button>
                        :
                        <Button 
                            mode='contained-tonal'
                            className=" mt-3"
                            buttonColor={colors.sblue}
                            textColor="white"
                            onPress={handleSubmit}
                        >
                            Editar sala
                        </Button>


                    }
                    
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