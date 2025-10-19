import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Dimensions, Image, ScrollView, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { TouchableRipple } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons'
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";
import { CustomTextInput as TextInput } from "../components/CustomTextInput";
import { colors } from "../../styles/colors";
import * as ImagePicker from 'expo-image-picker'
import { formatSecondsToHHMMSS, getSecondsElapsed, showErrorToast, showSuccessToast } from "../utils/functions";
import { imageRegistro, imagesToUpload } from "../types/apiTypes";
import { TelaConcluirLimpeza } from "../navigation/types/StackTypes";
import { getRegistrosService, adicionarFotoLimpezaService, concluirLimpezaService, deletarFotoLimpezaService } from '../servicos/servicoLimpezas';
import { apiURL } from "../api/axiosConfig";


type CarouselItem = {
  id: string;
  uri: string;
};

const { width: screenWidth } = Dimensions.get('window');

interface CarrosselImageProps {
    index: number;
    images: imageRegistro[];
    onDelete: (id: number) => void;
    addImage?: () => void;
}

function CarrosselImage({index, images, onDelete, addImage}: CarrosselImageProps) {

    const getImageSource = (image: imageRegistro) => {
        return { uri: apiURL + image.imagem };
    }

    const getImageId = (image: imageRegistro) => {
        return image.id;
    }

    if(index > images.length || index === 3){
        return null
    }

    if(images[index || 0]){
        return(
            <View className="  p-4 w-screen">
                <View className="bg-gray-200 aspect-video rounded-lg items-center justify-center">
                    <TouchableRipple 
                        className=" absolute top-3 right-3 z-10 bg-white rounded-full p-1" 
                        onPress={() => {
                            onDelete(getImageId(images[index || 0]))
                        }}
                        borderless={true}
                    >
                        <Ionicons name="close" size={24} color="gray" />
                    </TouchableRipple>
                    <Image
                        source={getImageSource(images[index || 0])}
                        className=" w-full h-full rounded-lg"
                    />
                </View>
            </View>
        )
    }
    return(
        <View className="  p-4 w-screen">
            <TouchableRipple 
                className="bg-gray-200 aspect-video rounded-lg items-center justify-center"
                onPress={addImage}
                borderless={true}
            
            >
                <View className=" items-center">
                    <View className=" bg-gray-300 p-4 rounded-full mb-2">
                        <Ionicons name="camera" size={32} color="gray" />
                    </View>
                    <Text className=" text-gray-500">Adicionar foto</Text>
                </View>
            </TouchableRipple>
        </View>
    )

}

interface PaginationProps {
    data: number[];
    activeIndex: number;
    imagesLength: number;
}

function Pagination({ data, activeIndex, imagesLength }: PaginationProps) {

    const dotsStyle = {
        activeDot: 'bg-sblue',
        activeFilledDot: 'bg-green-900',
        filledDot: 'bg-sgreen',
        emptyDot: 'bg-gray-300'
    };

    const getDotStyle = (index: number) => {
        if (index === activeIndex && index < imagesLength) {
            return dotsStyle.activeFilledDot;
        }
        if (index < imagesLength) {
            return dotsStyle.filledDot;
        }
        if (index === activeIndex) {
            return dotsStyle.activeDot;
        }
        return dotsStyle.emptyDot;
    };


    return (
        <View className="flex-row justify-center">
            {data.map((_, index) => {
                const returnBoolean = index <= imagesLength
                if (!returnBoolean) return null;
                return (
                    <View 
                        key={index.toString()}
                        className={`h-2 w-2 rounded-full mx-1 ${getDotStyle(index)}`}
                    />
                )
            })}
        </View>
    );
}



export default function ConcluirLimpezaForm() {
    
    
    const navigation = useNavigation()
    const route = useRoute<TelaConcluirLimpeza['route']>()
    const [activeIndex, setActiveIndex] = useState(0);
    const [images, setImages] = useState<imageRegistro[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [observacao, setObservacao] = useState('')
    const { registroSala } = route.params;
    const [registroSalaState, setRegistroSalaState] = useState(registroSala)
    const [cronometro, setCronometro] = useState(getSecondsElapsed(registroSala.data_hora_inicio))

    const arrayPlaceholder = [1,2,3]
    const contadorFormatado = formatSecondsToHHMMSS(cronometro)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCronometro(prevCronometro => prevCronometro + 1)
        }, 1000)

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        carregarRegistroSala()
    }, [])

    const carregarRegistroSala = async () => {
        const getRegistrosServiceResult = await getRegistrosService({
            username: registroSalaState.funcionario_responsavel,
            sala_uuid: registroSalaState.sala,
            data_inicio: registroSalaState.data_hora_inicio,
            // data_fim: null
        })
        if(!getRegistrosServiceResult.success){
            showErrorToast({errMessage: 'Erro ao carregar dados da limpeza'})
            return
        }

        // console.log(getRegistrosServiceResult.data)

        const registroAtualizado = getRegistrosServiceResult.data.filter((registro) => 
            registro.data_hora_fim === null
        )

        // console.log(registroAtualizado)

        if(registroAtualizado.length === 0){
            showErrorToast({errMessage: 'Nenhum registro de limpeza encontrado'})
            return
        }

        setRegistroSalaState(registroAtualizado[0])
        setImages(registroAtualizado[0].fotos)
    }

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / screenWidth); 
        setActiveIndex(currentIndex);
    };
    
    const handleTakePhoto = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync()
        if ( status !== 'granted'){
            showErrorToast({
                errMessage: 'Precisamos de permissão para acessar a câmera!', 
                errTitle: 'Permissão negada'
            })
            console.log('negada')
            return null;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16,9],
            quality: 0.5,
        });
                
        if (result.canceled) {
            return null
        }

        if(images.length >= 3){
            showErrorToast({errMessage: 'Número máximo de fotos atingido (3)'})
            return null
        }

        if(!result.assets[0].uri){
            showErrorToast({errMessage: 'Erro ao capturar imagem'})
            return null
        }

        const imageName = result.assets[0].uri.split('/').pop() || '';
        const newImage = {
            uri: result.assets[0].uri,
            name: imageName,
            type: 'image/jpeg'
        };

        await enviarImagem(newImage)        
    }

    const enviarImagem = async (image: imagesToUpload) => {
        const formData = new FormData();
        formData.append('registro_limpeza', String(registroSalaState.id));
        formData.append('imagem', image as any);

        const adicionarFotoLimpezaServiceResult = await adicionarFotoLimpezaService(formData);
        if(!adicionarFotoLimpezaServiceResult.success){
            showErrorToast({errMessage: adicionarFotoLimpezaServiceResult.errMessage || 'Erro ao enviar imagem'})
            return
        }
        await carregarRegistroSala()
    }

    const deleteImage = async (id: number) => {
        const deletarFotoLimpezaServiceResult = await deletarFotoLimpezaService(id);
        if(!deletarFotoLimpezaServiceResult.success){
            showErrorToast({errMessage: deletarFotoLimpezaServiceResult.errMessage || 'Erro ao deletar imagem'})
            return
        }
        await carregarRegistroSala()
    }

    const concluirLimpeza = async () => {
        if(images.length === 0){
            showErrorToast({errMessage: 'Adicione ao menos uma foto da limpeza'})
            return
        }

        const concluirLimpezaServiceResult = await concluirLimpezaService(registroSalaState.sala, observacao);
        if(!concluirLimpezaServiceResult.success){
            showErrorToast({errMessage: concluirLimpezaServiceResult.errMessage || 'Erro ao concluir limpeza'})
            return
        }
        showSuccessToast({successMessage: 'Limpeza concluída com sucesso!'})
        setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Tabs'}]
                })
            )
            // navigation.navigate('Home')
        }, 4000);
    }


    const contadorStyle = {
        fastTime: 'text-sgreen',
        mediumTime: 'text-syellow',
        slowTime: 'text-sred'
    }

    const getContadorStyle = (seconds: number): string => {
        if (seconds < 1200) {
            return contadorStyle.fastTime;
        } else if (seconds < 2400) {
            return contadorStyle.mediumTime;
        } else {
            return contadorStyle.slowTime;
        }
    }


    return (
        <SafeAreaView className="flex-1 bg-white">

            <View className=" items-center flex-row py-4 px-5 rounded-lg rounded-b-none gap-4 border-b-2 border-gray-200">
                <Text className=" text-2xl flex-1 text-black">Concluir Limpeza</Text>
            </View>
            <ScrollView 
                className=" my-8 flex-1"
                contentContainerClassName=" flex-col gap-12 justify-center"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
                    setRefreshing(true)
                    await carregarRegistroSala().then(() => setRefreshing(false))
                }
                } />}
            >

                <View className=" ">
                    <Text className=" px-4 text-lg">Imagens da Limpeza</Text>
                    <FlatList
                        data={arrayPlaceholder}
                        keyExtractor={(item) => String(item)}
                        horizontal
                        renderItem={({ index }) => 
                            <CarrosselImage index={index} images={images} 
                                onDelete={async (id) => {
                                    await deleteImage(id);
                                }}
                                addImage={async () => await handleTakePhoto()}
                            />
                        }
                        pagingEnabled
                        className=" pb-1"
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        snapToInterval={screenWidth}
                        decelerationRate={"fast"}
                        contentContainerClassName=""
                    />
                    <Pagination data={arrayPlaceholder} activeIndex={activeIndex} imagesLength={images.length} />
                </View>

                <View className=" bg-gray-200 rounded-lg py-2 mx-4 pb-3">
                    <TextInput
                        label="Observações (opcional)"
                        multiline
                        value={observacao}
                        onChangeText={setObservacao}
                        mode="outlined"
                        numberOfLines={4}
                        className=" mx-4"
                        activeOutlineColor={colors.sblue}
                    />
                </View>

                <View className=" items-center gap-2 bg-gray-200 p-2 rounded-lg mx-4">
                    <Text className=" px-4 text-lg">Tempo de Limpeza</Text>
                    <Text className={` px-4 text-4xl text-center ${getContadorStyle(cronometro)}`}>{contadorFormatado}</Text>
                </View>

            </ScrollView>
            <View className=" flex-row gap-4 px-4 pb-4">
                <TouchableRipple
                    borderless={true}
                    className=" bg-gray-200 flex-1 rounded-lg py-3 items-center"
                    onPress={() => navigation.goBack()}
                >
                    <Text className=" text-black text-lg font-medium">Cancelar</Text>
                </TouchableRipple>

                <TouchableRipple
                    borderless={true}
                    className=" bg-sblue flex-1 rounded-lg py-3 items-center"
                    onPress={async () => await concluirLimpeza()}
                >
                    <Text className=" text-white text-lg font-medium">Concluir Limpeza</Text>
                </TouchableRipple>
            </View>
        </SafeAreaView>
    )
}