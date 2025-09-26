import { imageType, newSala, Sala, Usuario } from "../types/apiTypes";
import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, Modal, Pressable, Alert, ScrollView, TouchableOpacity, TextInput as TextI, FlatList, ImageURISource } from "react-native"
import { Button, Portal, TextInput, Provider, ActivityIndicator } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import ImgTypeSelector from "../components/ImgTypeSelector";
import * as z from 'zod'
import { criarNovaSala, editarSalaService } from "../servicos/servicoSalas";
import { TelaEditarSala } from "../navigation/types/AdminStackTypes";
import { apiURL } from "../api/axiosConfig";
import { obterUsuarios } from "../servicos/servicoUsuarios";
import { AuthContext } from "../AuthContext";
import ResponsaveisMultiselect from "../components/ResponsaveisMultiselect";
import { Ionicons } from '@expo/vector-icons'





// interface FormSalaScreenProps{
//     sala? : Sala
//     // onSubmit : (newSala: newSala, id? : string) => void
// }

export default function FormSalaScreen(){

    const authContext = useContext(AuthContext)

    if (!authContext){
        return null
    }
    if (!authContext.usersGroups){
        return null
    }
    

    const {usersGroups} = authContext
    const navigation = useNavigation()
    // const sala = ''
    const route = useRoute<TelaEditarSala['route']>()
    const {sala} = route.params;
    const [imgSelectorVisible, setImgSelectorVisible] = useState(false)
    const [responsaveisMultiselectVisible, setResponsaveisMultiselectVisible] = useState(false)
    const [loading, setLoading] = useState(false)


    const [zeladores, setZeladores] = useState<Usuario[]>([])

    const [nomeSala, setNomeSala] = useState('')
    const [capacidade, setCapacidade] = useState('')
    const [localizacao, setLocalizacao] = useState('')
    const [selectedResponsaveis, setSelectedResponsaveis] = useState<string[]>([])
    const [descricao, setDescricao] = useState('')
    const [instrucoes, setInstrucoes] = useState('')
    const [validade_limpeza_horas, setValidade_limpeza_horas] = useState('')
    const [statusSala, setStatusSala] = useState<'Ativa' | 'Inativa'>('Ativa')
    const [image, setImage] = useState<ImageURISource | null>(null)

    useFocusEffect( React.useCallback(() => {
        carregarZeladores()

        if(sala){
            console.log(sala)
            setNomeSala(sala.nome_numero)
            setCapacidade(String(sala.capacidade))
            setLocalizacao(sala.localizacao)
            setDescricao(sala.descricao ? sala.descricao : '')
            setInstrucoes(sala.instrucoes ? sala.instrucoes : '')
            setSelectedResponsaveis(sala.responsaveis)
            setValidade_limpeza_horas(String(sala.validade_limpeza_horas))
            setStatusSala(sala.ativa ? 'Ativa' : 'Inativa')
            setImage(sala.imagem ? {uri: apiURL + sala.imagem} : null)
        }
    }, []))

    const carregarZeladores = async () => {
        try{
            // setLoading(true)
            // console.log(usersGroups[1].name)
            const resposta = await obterUsuarios(usersGroups.filter(item => item.id === 1)[0].name)
            // console.log(resposta)
            setZeladores(resposta)
            
        } catch(erro: any){
            
        } finally{
            // setLoading(false)
        }
    }

    const handleSubmit = async () => {
        const salaSchema = z.object({
            nome_numero: z.string().min(1, 'O nome da sala é obrigatório'),
            capacidade: z.coerce.number().int('A capacidade deve ser um número inteiro válido')
                .positive('A capacidade deve ser um número inteiro válido'),
            localizacao: z.string().min(1, 'A localização é obrigatória'),
            descricao: z.string().optional(),
            instrucoes: z.string().optional(),
            validade_limpeza_horas: z.coerce.number('Validade da limpeza (Horas) deve ser um número inteiro válido')
            .int('Validade da limpeza (Horas) deve ser um número inteiro válido').optional(),
            ativa: z.boolean().optional().default(true),
        })

        const formDataJSON: newSala = {
            nome_numero: nomeSala,
            capacidade,
            descricao,
            responsaveis: selectedResponsaveis,
            localizacao,
            instrucoes,
            validade_limpeza_horas,
            ativa: statusSala === 'Ativa',
        }

        const validationResult = salaSchema.safeParse(formDataJSON)

        if(!validationResult.success){
            const errorMessages = validationResult.error.issues.map(err => {
                console.log(err.message)
                return err.message
            }).join('\n\n');
            Alert.alert('Erro de Validação', errorMessages);
            return;
        }

        if (Number(validade_limpeza_horas) < 0){
            Alert.alert('Erro de Validação', 'Validade da limpeza (Horas) deve ser um número inteiro válido')
            return
        }

        console.log(selectedResponsaveis)

        const formData = new FormData()
        // formData.append('responsaveis', 'Eb')

        Object.entries(formDataJSON).forEach(([key, value]) => {
            if(key === 'responsaveis'){
                selectedResponsaveis.map(item => {
                    formData.append(key, item)
                })
            }
            if ((value || key === 'ativa') && key !== 'responsaveis'){
                formData.append(key, value)
            }
        })

        if (image && image.uri && !sala){
            const imageName = image.uri.split('/').pop();
            formData.append('imagem', {
                uri: image.uri,
                name: imageName,
                type: 'image/jpeg',

        } as any)
        }
        console.log(formData)

        await onSubmit(formData)
    }

    const onSubmit = async (newSala: FormData) => {
        try{
            if(sala){
                const resposta = await editarSalaService(newSala, sala.qr_code_id)
                Alert.alert('Aviso', 'Sala editada com sucesso', [
                    {
                        "text": "Ok",
                        "onPress": () => navigation.navigate('AdminTabs')
                    }
                ])

            } else{
                const resposta = await criarNovaSala(newSala)
                Alert.alert('Aviso', 'Sala criada com sucesso', [
                    {
                        "text": "Ok",
                        "onPress": () => navigation.navigate('AdminTabs')
                    }
                ])
            }
        } catch (erro: any){
            if(erro.message === 'AxiosError: Request failed with status code 400'){
                Alert.alert('Erro','Esse nome de sala está em uso, digite um nome diferente')
                return
            }
            if (sala){
                Alert.alert('Erro','Não foi possivel editar sala')

            } else{
                Alert.alert('Erro','Não foi possivel criar sala')
            }
        }
    }

    if(loading){
        return(
        <View className='flex-1 bg-gray-50 justify-center p-16'>

            <ActivityIndicator size={80}/>
        </View>
        )
    }

    
    return (
        <Provider>
        <SafeAreaView className="bg-white rounded-lg p-8 flex-1">
            <ResponsaveisMultiselect refreshZeladores={carregarZeladores} visible={responsaveisMultiselectVisible} hideModal={() => setResponsaveisMultiselectVisible(false)} zeladores={zeladores} selectedResponsaveis={selectedResponsaveis} setSelectedResponsaveis={setSelectedResponsaveis}/>
            <ImgTypeSelector visible={imgSelectorVisible} aspect={[1,1]} hideModal={() => setImgSelectorVisible(false)} handleUploadImage={setImage}/>
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
                
                <TouchableOpacity onPress={() => setResponsaveisMultiselectVisible(true)} className=" mt-1.5 border border-gray-700 items-center h-14 flex-row justify-center rounded-lg bg-gray-300">
                    <Ionicons
                        name='list-outline' 
                        size={22} 
                        color={'black'}
                    />
                    <Text className=" text-lg text-center text-black px-2" numberOfLines={1}>Responsáveis pela limpeza</Text>
                </TouchableOpacity>
                
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
                    itemStyle={{paddingLeft: 10}}
                    
                    
                >
                    <Picker.Item
                        key={'Ativa'}
                        value={'Ativa'}
                        label="Sala ativa"
                        color={colors.sgreen}
                        
                        // style={{paddingLeft: 10}}
                        
                        
                        />

                    <Picker.Item
                        key={'Inativa'}
                        value={'Inativa'}
                        label="Sala inativa"
                        color={colors.syellow}
                        style={{marginLeft: 8}}
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
                        onPress={async () => await handleSubmit()}
                    >
                        Criar sala
                    </Button>
                    :
                    <Button 
                        mode='contained-tonal'
                        className=" flex-1"
                        buttonColor={colors.sblue}
                        textColor="white"
                        onPress={async () => await handleSubmit()}
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