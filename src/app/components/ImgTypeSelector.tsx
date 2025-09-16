import React, {useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text, ImageSourcePropType, Alert } from "react-native";
import { Modal, Portal, Provider, List } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker'
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import * as NativeImagePicker from 'react-native-image-picker'
import { ImageURISource } from "react-native";

import { Ionicons } from '@expo/vector-icons'
import { alterarFotoPerfil } from "../servicos/servicoUsuarios";

interface RodapeImgSelectorProps{
    visible: boolean,
    // showModal: () => void
    hideModal: () => void
    recarregarPerfil: () => void
    // setVisible: ()
}

type option = 'camera' | 'galeria'

export default function ImgTypeSelector({visible, hideModal, recarregarPerfil}: RodapeImgSelectorProps){

    const [selectedImage, setSelectedImage] = useState<ImageURISource | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleTakePhoto = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync()
        if ( status !== 'granted'){
            Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a câmera!');
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
      
        if (!result.canceled) {
            setSelectedImage({ uri: result.assets[0].uri });
        }
        
    }
    
    const handlePickPhoto = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if ( status !== 'granted'){
            Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a câmera!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
            quality: 1,
          });
      
        if (!result.canceled) {
            setSelectedImage({ uri: result.assets[0].uri });
        }
        
    }

    const handleUploadImage = async () => {
        if (!selectedImage) {
            Alert.alert('Erro', 'Nenhuma imagem selecionada para enviar.');
            return;
        }
        
        if(!selectedImage.uri){
            Alert.alert('Erro', 'Nenhuma imagem selecionada para enviar.');
            return
        }

        console.log(selectedImage.uri)

        setIsUploading(true); // Ativa o indicador de carregamento

        const formData = new FormData();
        const imageName = selectedImage.uri.split('/').pop();

        // Anexa a imagem ao FormData
        formData.append('profile_picture', {
            uri: selectedImage.uri,
            name: imageName,
            type: 'image/jpeg', // Exemplo: pode ser 'image/png' dependendo do formato
        } as any);

        try {
            const resposta = await alterarFotoPerfil(formData)
            recarregarPerfil()
            // Alert.alert('Sucesso!', 'Imagem enviada com sucesso para a API.');
            // console.log('Resposta do servidor:', resposta.data);
            
        } catch (error: any) {
            console.error('Erro ao enviar a imagem:', error);
            Alert.alert('Erro', `Falha ao enviar a imagem: ${error.message}`);
        } finally {
            setIsUploading(false); // Desativa o indicador de carregamento
        }
    }

    const handleOptionPress = async (option: option) => {
        // console.log(`Opcao ${option} selecionada`);
        hideModal()
        if (option === 'camera'){
            // const result = await launchCamera({mediaType: 'photo'})
            await handleTakePhoto()
        } else if (option === 'galeria'){
            await handlePickPhoto()
            // const result = await launchImageLibrary({mediaType: 'photo'})
        }

        await handleUploadImage()

        // const resposta = 

    }

    return (
        <Portal>
            <Modal
                
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={{
                    marginHorizontal: 16,
                    borderRadius: 15,
                    paddingTop: 16,
                    backgroundColor: '#121212'
                }}
            >

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 16,
                    paddingHorizontal: 16
                }}
                    // className=" mt-auto"
                >
                    {/* <TouchableOpacity onPress={hideModal} style={{position: 'absolute', left: 16}}>
                        <Ionicons name="close" size={24} color="gray" />
                    </TouchableOpacity> */}
                    <Text className=" text-white text-xl">Foto de perfil</Text>
                    
                </View>

                <List.Item
                    // className=" text-white"
                    style={{paddingHorizontal: 15}}
                    // contentStyle={{}}
                    titleStyle={{color: 'white'}}
                    title='Câmera'
                    left={()=> <Ionicons size={24} color={'white'} name="camera" />}
                    onPress={() => handleOptionPress('camera')}
                    />

                <List.Item
                    // className=" text-white"
                    style={{paddingHorizontal: 15}}
                    // contentStyle={{}}
                    titleStyle={{color: 'white'}}
                    title='Galeria'
                    left={()=> <Ionicons size={24} color={'white'} name='images-outline' />}
                    onPress={() => handleOptionPress('galeria')}
                />


            </Modal>
        </Portal>
    )


}











