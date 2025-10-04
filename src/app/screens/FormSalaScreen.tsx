import { imageType, newSala, Sala, Usuario } from "../types/apiTypes";
import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, Modal, Pressable, Alert, ScrollView, TouchableOpacity, TextInput as TextI, FlatList, ImageURISource } from "react-native"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button, Portal, TextInput as TextInputPaper, Provider, ActivityIndicator } from "react-native-paper"
import { CustomTextInput as TextInput } from "../components/CustomTextInput";
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
import Toast from "react-native-toast-message";


const salaSchema = z.object({
    nome_numero: z.string().min(1, 'O nome da sala é obrigatório'),
    capacidade: z.string().min(1, 'Esse campo é obrigatório').refine(num => !isNaN(Number(num)), {
        error: 'Capacidade tem que ser um número inteiro válido'
    }).refine(num => Number(num)%1 === 0 && Number(num) > 0, {
        error: 'Capacidade tem que ser um número inteiro válido'
    }).refine(num => Number(num) <= 2000, {
        error: 'Capacidade tem que ser menor ou igual à 2000'
    })
    ,
    localizacao: z.string().min(1, 'A localização é obrigatória'),
    descricao: z.string().optional(),
    instrucoes: z.string().optional(),
    validade_limpeza_horas: z.string().refine(num => !!num ? !isNaN(Number(num)) : true, {
        error: 'Capacidade tem que ser um número inteiro válido'
    }).refine(num => !!num ? (Number(num)%1 === 0 && Number(num) > 0) : true, {
        error: 'Capacidade tem que ser um número inteiro válido'
    }),
    ativa: z.enum(['Ativa', 'Inativa']).default('Ativa').optional(),
    responsaveis: z.array(z.string('A lista deve ter os usernames dos usuários'))
})

type salaFormData = z.infer<typeof salaSchema>



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
    const route = useRoute<TelaEditarSala['route']>()
    const {sala} = route.params;
    const [imgSelectorVisible, setImgSelectorVisible] = useState(false)
    const [responsaveisMultiselectVisible, setResponsaveisMultiselectVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [zeladores, setZeladores] = useState<Usuario[]>([])
    const [image, setImage] = useState<ImageURISource | null>(null)
    
    const { control, handleSubmit } = useForm<salaFormData>({
        resolver: zodResolver(salaSchema),
        defaultValues: {
            ativa: 'Ativa',
            nome_numero: '',
            capacidade: '',
            localizacao: '',
            validade_limpeza_horas: '',
            descricao: '',
            instrucoes: '',
            responsaveis: []
        }
    })


    useFocusEffect( React.useCallback(() => {
        carregarZeladores()

        if(sala){

        }
    }, []))

    const carregarZeladores = async () => {
        const obterUsuariosResult = await obterUsuarios(usersGroups.filter(item => item.id === 1)[0].name)
        if(!obterUsuariosResult.success){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: obterUsuariosResult.errMessage,
                position: 'bottom',
                visibilityTime: 3000
            })

            return;
        }
        setZeladores(obterUsuariosResult.data)
    }

    const adicionarImageNoFormdata = (formData: FormData) => {
        if(image && image.uri){
            if(sala && sala.imagem && image.uri.includes(sala.imagem)){
                return
            }
            const imageName = image.uri.split('/').pop();
            formData.append('imagem', {
                uri: image.uri,
                name: imageName,
                type: 'image/jpeg',
            } as any)
            return
            
        }
        if(sala && sala.imagem){
            formData.append('imagem', '')
            return
        }
    }

    const onSubmit = async (data: salaFormData) => {

        const {ativa, responsaveis, ...salaData} = data
            
        const formData = new FormData()
        
        responsaveis.map(item => {
            formData.append('responsaveis', item)
        })

        formData.append('ativa', String(ativa === 'Ativa'))
        
        Object.entries(salaData).forEach(([key, value]) => {
            if ((value || sala)){
                formData.append(key, value)
            }
        })
    
        adicionarImageNoFormdata(formData)
    

        if(!sala){
            const criarNovaSalaResult = await criarNovaSala(formData)
            if(!criarNovaSalaResult.success){
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: criarNovaSalaResult.errMessage,
                    position: 'bottom',
                    visibilityTime: 3000
                })
                return
            }
            
            navigation.navigate('AdminTabs')
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Aviso',
                    text2: 'Sala criada com sucesso!',
                    position: 'bottom',
                    visibilityTime: 3000
                })
            }, 3000)
        }
        if(sala){
            const editarSalaServiceResult = await editarSalaService(formData, sala.qr_code_id)
            if(!editarSalaServiceResult.success){
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: editarSalaServiceResult.errMessage,
                    position: 'bottom',
                    visibilityTime: 3000
                })
                return
            }
            navigation.navigate('AdminTabs')
            setTimeout(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Aviso',
                    text2: 'Sala editada com sucesso!',
                    position: 'bottom',
                    visibilityTime: 3000
                })
            }, 3000)
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
        <SafeAreaView className="bg-white rounded-lg p-8 px-4 flex-1">
            <Controller
                control={control}
                name="responsaveis"
                render={({field, fieldState}) => (
                    <ResponsaveisMultiselect refreshZeladores={carregarZeladores} visible={responsaveisMultiselectVisible} hideModal={() => setResponsaveisMultiselectVisible(false)} zeladores={zeladores} selectedResponsaveisProps={field.value} setSelectedResponsaveisProps={field.onChange}/>

                )}
            />
            <ImgTypeSelector visible={imgSelectorVisible} aspect={[1,1]} hideModal={() => setImgSelectorVisible(false)} handleUploadImage={setImage}/>
            {
                !sala ?
                <Text className=" text-center mb-8 text-4xl font-bold">Criar sala</Text>
                :
                <Text className=" text-center mb-8 text-4xl font-bold">Editar sala</Text>
            }
            <ScrollView className=" flex-1 mb-8 px-4" contentContainerClassName="gap-2 flex-col">
                
                <Controller
                    control={control}
                    name="nome_numero"
                    render={({field, fieldState}) => (
                        <TextInput
                            label="Nome da sala"
                            value={field.value}
                            onChangeText={field.onChange}
                            autoCapitalize="none"
                            keyboardType='default'
                            mode="outlined"
                            style={styles.input}
                            errorMessage={fieldState.error?.message}
                            activeOutlineColor='#004A8D'
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="capacidade"
                    render={({field, fieldState}) => (
                        <TextInput
                            label="Capacidade"
                            value={String(field.value)}
                            onChangeText={field.onChange}
                            autoCapitalize="none"
                            keyboardType='default'
                            mode="outlined"
                            style={styles.input}
                            errorMessage={fieldState.error?.message}
                            activeOutlineColor='#004A8D'
                        />
                        )}
                />

                <Controller
                    control={control}
                    name="localizacao"
                    render={({field, fieldState}) => (
                        <TextInput
                            label="Localização"
                            value={field.value}
                            onChangeText={field.onChange}
                            autoCapitalize="none"
                            keyboardType='default'
                            mode="outlined"
                            errorMessage={fieldState.error?.message}
                            style={styles.input}
                            activeOutlineColor='#004A8D'
                        />

                    )}
                />
                
         
                <TouchableOpacity onPress={() => setResponsaveisMultiselectVisible(true)} 
                className=" mt-1.5 border border-gray-700 items-center h-14 flex-row justify-center rounded-lg bg-sgray/20">
                    <Ionicons
                        name='people-outline' 
                        size={22} 
                        color={'black'}
                    />
                    <Text className=" text-lg text-center text-black px-2" numberOfLines={1}>Selecionar responsáveis pela limpeza</Text>
                </TouchableOpacity>
                
                <Controller
                    control={control}
                    name="descricao"
                    render={({field, fieldState}) => (
                        <TextInput
                            label="Descrição"
                            value={field.value}
                            onChangeText={field.onChange}
                            autoCapitalize="none"
                            keyboardType='default'
                            mode="outlined"
                            style={styles.input}
                            activeOutlineColor='#004A8D'
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="instrucoes"
                    render={({field, fieldState}) => (
                        <TextInput
                            label="Instruções"
                            value={field.value}
                            onChangeText={field.onChange}
                            autoCapitalize="none"
                            keyboardType='default'
                            mode="outlined"
                            style={styles.input}
                            activeOutlineColor='#004A8D'
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="validade_limpeza_horas"
                    render={({field, fieldState}) => (
                        <TextInput
                            label="Validade da limpeza (Horas)"
                            value={field.value}
                            onChangeText={field.onChange}
                            autoCapitalize="none"
                            keyboardType='default'
                            mode="outlined"
                            style={styles.input}
                            errorMessage={fieldState.error?.message}
                            activeOutlineColor='#004A8D'
                        />
                    )}
                />
                
                <Controller
                    control={control}
                    name="ativa"
                    render={({field, fieldState}) => (
                        <Picker
                            selectedValue={field.value}
                            onValueChange={field.onChange}
                            itemStyle={{paddingLeft: 10}}
                            
                            
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
                    )}
                />

                <View className=" gap-4 flex-row flex-1 h-44 items-center">
                    <View className=" border aspect-square h-full">
                    {image ? 
                        <Image
                            source={{uri: image.uri}}
                            className=" flex-1"
                        />

                        : 
                        <View className=" flex-1 bg-gray-200 items-center justify-center">
                            <Ionicons name="image-outline" size={32}/>
                        </View>
                    }

                    </View>

                    <View className=" flex-1 flex-col gap-2">
                        <TouchableOpacity onPress={() => setImgSelectorVisible(true)} className=" items-center h-14 justify-center rounded-lg bg-sblue/20">
                            <Text className=" text-lg text-center text-sblue px-2" numberOfLines={1}>Inserir imagem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setImage(null)} className=" items-center h-14 justify-center rounded-lg px-6 bg-sred/20">
                            <Ionicons name="trash-bin-outline" size={28} color={colors.sred}/>
                        </TouchableOpacity>

                    </View>


                </View>
            </ScrollView>

            <View className=" flex-row justify-between px-4 gap-8">
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
                <Button 
                    mode='contained-tonal'
                    className=" flex-1"
                    
                    buttonColor={colors.sblue}
                    textColor="white"
                    onPress={handleSubmit(onSubmit)}
                >
                    {!sala ? 'Criar sala' : 'Editar sala'}
                </Button>
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