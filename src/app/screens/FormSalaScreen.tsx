import { newSala, Sala } from "../types/apiTypes";
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, Modal, Pressable, Alert, ScrollView, TouchableOpacity, TextInput as TextI, FlatList, ImageURISource } from "react-native"
import { Button, Portal, TextInput, Provider } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import ImgTypeSelector from "../components/ImgTypeSelector";




interface FormSalaScreenProps{
    sala? : Sala
    // onSubmit : (newSala: newSala, id? : string) => void
}

export default function FormSalaScreen({sala}: FormSalaScreenProps){
    

    const navigation = useNavigation()
    const [imgSelectorVisible, setImgSelectorVisible] = useState(false)
    const [id, setId] = useState<string| null>('')
    const [nomeSala, setNomeSala] = useState('')
    const [capacidade, setCapacidade] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [responsaveisInputText, setResponsaveisInputText] = useState('')
    const [responsaveisSuggestions, setResponsaveisSuggestions] = useState<testUserType[]>([])
    const [selectedResponsaveis, setSelectedResponsaveis] = useState<testUserType[]>([])
    const [descricao, setDescricao] = useState('')
    const [instrucoes, setInstrucoes] = useState('')
    const [validade_limpeza_horas, setValidade_limpeza_horas] = useState('')
    const [statusSala, setStatusSala] = useState<'Ativa' | 'Inativa'>('Ativa')
    const [image, setImage] = useState<ImageURISource | null>(null)

    const users = [
        {id: '1', name: 'aklu'},
        {id: '2', name: 'bklo'},
        {id: '3', name: 'ckli'},
        {id: '4', name: 'dkle'},
        {id: '5', name: 'ekla'},
        {id: '6', name: 'fklu'},
    ]

    interface testUserType{
        id: string,
        name: string
    }


    useEffect(() => {
        if (responsaveisInputText.length > 0) {
          const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(responsaveisInputText.toLowerCase())
          );
          setResponsaveisSuggestions(filteredUsers);
        } else {
          setResponsaveisSuggestions([]);
        }
    }, [responsaveisInputText]);


    const handleSelectUser = (user: testUserType) => {
        if (!selectedResponsaveis.some(u => u.id === user.id)) {
          setSelectedResponsaveis([...selectedResponsaveis, user]);
        }
        setResponsaveisInputText('');
        setResponsaveisSuggestions([]);
    };

    const handleRemoveUser = (userId: string) => {
        const updatedUsers = selectedResponsaveis.filter(user => user.id !== userId);
        setSelectedResponsaveis(updatedUsers);
    };

    const handleSubmit = () => {
        if (nomeSala === '' || capacidade === '' || localizacao === '') {
            Alert.alert('Erro', 'Insira os campos: nome da sala, capacidade, localização');
            return;
        }

        const capacidadeConvertida = parseInt(capacidade, 10)
        // console.log(capacidadeConvertida)

        if(isNaN(capacidadeConvertida) && !Number.isInteger(capacidadeConvertida)){
            Alert.alert('Erro', 'Capacidade precisa ser um número inteiro válido')
            return;
        }
        if(String(capacidadeConvertida) !== capacidade.trim()){
            Alert.alert('Erro', 'Capacidade precisa ser um número nteiro válido')
            return;
            
        }

        const validade_limpezaConvertida = parseInt(validade_limpeza_horas, 10)
        // console.log(validade_limpezaConvertida)

        if(isNaN(validade_limpezaConvertida) && !Number.isInteger(validade_limpezaConvertida)){
            Alert.alert('Erro', 'Validade da limpeza precisa ser um número inteiro válido')
            return;
        }
        if(String(validade_limpezaConvertida) !== validade_limpeza_horas.trim()){
            Alert.alert('Erro', 'Validade da limpeza precisa ser um número inteiro válido')
            return;
            
        }

        if (sala){
            onSubmit(
                {
                    nome_numero: nomeSala,
                    capacidade,
                    descricao,
                    localizacao,
                    instrucoes,
                    validade_limpeza_horas,
                    ativa : statusSala === 'Ativa',
                    image
                    
                
                }
            )

        } else {
            onSubmit(
                // id: id,
                {
                    nome_numero: nomeSala,
                    capacidade,
                    descricao,
                    localizacao,
                    instrucoes,
                    validade_limpeza_horas,
                    ativa : statusSala === 'Ativa',
                    image
                },
                id
            )
        }
        
        
        // onClose()
    }

    const onSubmit = (newSala: any, id?: string | null) => {

    }

    



    return (
        <Provider>
        <SafeAreaView className="bg-white rounded-lg p-8 flex-1">
            <ImgTypeSelector visible={imgSelectorVisible} aspect={[4,2]} hideModal={() => setImgSelectorVisible(false)} handleUploadImage={setImage}/>
            {
                !sala ?
                <Text className=" text-center mb-8 text-4xl font-bold">Criar sala</Text>
                :
                <Text className=" text-center mb-8 text-4xl font-bold">Editar sala</Text>

            }
            <View className=" h-80 gap-2 flex-1 mb-8 flex-col">
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
                    // className=" mt-0"
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
                
                {/* Trocar Pra user selection */}
                {/* <View className=" p-2 rounded-md border-gray-500 border mt-2">
                    <Text className=" text-base mb-2 font-bold">Responsáveis</Text>
                    <View className=" flex-row flex-wrap mb-2">
                        {selectedResponsaveis.map(user => (
                            <TouchableOpacity onPress={() => handleRemoveUser(user.id)} key={user.id} className=" flex-row bg-gray-200 rounded-full py-1.5 px-3 mb-2 mr-2 items-center">
                                <Text className=" text-sm">{user.name}</Text>
                            </TouchableOpacity>
                        ))}

                        <View key={99999} className=" flex-row opacity-0 bg-gray-200 rounded-full py-1.5 px-3 mb-2 mr-2 items-center">
                            <Text className=" text-sm">Test</Text>
                        </View>

                    </View>

                    <View>
                        <TextI
                            className=" h-12 border border-gray-300 rounded-lg px-2"
                            placeholder="Adicione um responsável para a sala..."
                            onChangeText={setResponsaveisInputText}
                            value={responsaveisInputText}
                        />

                        {responsaveisSuggestions.length > 0 && (
                            <FlatList
                                className=" absolute w-full mt-12 max-h-32 bg-white border border-gray-300 rounded-lg z-50"
                                data={responsaveisSuggestions}
                                keyExtractor={(item) => item.id}

                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={() => handleSelectUser(item)}>
                                        <Text className=" p-2 border-b border-gray-200">{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}


                    </View>
                </View> */}

                
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
                    label="Instruções"
                    // numberOfLines={2}
                    value={instrucoes}
                    onChangeText={setInstrucoes}
                    autoCapitalize="none"
                    keyboardType='default'
                    mode="outlined"
                    style={styles.input}
                    activeOutlineColor='#004A8D'
                />
                
                <TextInput
                    label="Validade da limpeza (Horas)"
                    value={validade_limpeza_horas}
                    onChangeText={setValidade_limpeza_horas}
                    autoCapitalize="none"
                    keyboardType='default'
                    mode="outlined"
                    style={styles.input}
                    activeOutlineColor='#004A8D'
                />

                <Picker
                    selectedValue={statusSala}
                    onValueChange={setStatusSala}
                    
                >
                    <Picker.Item
                        key={'Ativa'}
                        value={'Ativa'}
                        label="Sala ativa"
                        color={colors.sgreen}
                        
                    />

                    <Picker.Item
                        key={'Inativa'}
                        value={'Inativa'}
                        label="Sala inativa"
                        color={colors.syellow}
                    />
                </Picker>

                <View className=" gap-4 flex-row mt-1 items-center">
                    <View className=" border aspect-video flex-1">
                    {image ? 
                        <Image
                            source={{uri: image.uri}}
                            className=" flex-1"
                        />

                        : null
                    }

                    </View>

                    <TouchableOpacity onPress={() => setImgSelectorVisible(true)} className=" border border-gray-700 items-center h-14 justify-center rounded-lg bg-gray-300">
                        <Text className=" text-lg text-center text-black px-2" numberOfLines={1}>Inserir imagem da sala</Text>
                    </TouchableOpacity>

                </View>


                {/* <TextInput
                    label="Responsáveis"
                    value={localizacao}
                    onChangeText={setLocalizacao}
                    autoCapitalize="none"
                    keyboardType='default'
                    mode="outlined"
                    style={styles.input}
                    activeOutlineColor='#004A8D'
                /> */}
            </View>

            <View className=" flex-row justify-between gap-8">
                <Button
                    mode="outlined"
                    textColor="black"
                    className=" "
                    onPress={navigation.goBack}
                    // buttonColor={colors.sblue}
                    style={{}}
                >
                    Cancelar
                </Button>
                {
                    !sala ?
                    <Button 
                        mode='contained-tonal'
                        className=" flex-1"
                        
                        buttonColor={colors.sblue}
                        textColor="white"
                        onPress={() => null}
                    >
                        Criar sala
                    </Button>
                    :
                    <Button 
                        mode='contained-tonal'
                        className=" flex-1"
                        buttonColor={colors.sblue}
                        textColor="white"
                        onPress={() => null}
                    >
                        Editar sala
                    </Button>


                }

            </View>

            
        </SafeAreaView>     
        </Provider>   
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
        // marginBottom: 16,
        marginTop: 0
    },
    

})