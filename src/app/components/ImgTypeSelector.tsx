import React, {useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text, ImageSourcePropType, Alert } from "react-native";
import { Modal, Portal, Provider, List } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker'
import { MediaType } from "expo-image-picker";
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import * as NativeImagePicker from 'react-native-image-picker'
import { ImageURISource } from "react-native";

import { Ionicons } from '@expo/vector-icons'
import { alterarFotoPerfil } from "../servicos/servicoUsuarios";

interface RodapeImgSelectorProps{
    visible: boolean,
    hideModal: () => void
    recarregarPerfil: () => void
}

type imageOption = 'camera' | 'galeria'

export default function ImgTypeSelector({visible, hideModal, recarregarPerfil}: RodapeImgSelectorProps){

    const handleTakePhoto = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync()
        if ( status !== 'granted'){
            Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a câmera!');
            console.log('negada')
            return null;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
                
        if (result.canceled) {
            return null
        }
        
        return {uri : result.assets[0].uri}
        
    }
    
    const handlePickPhoto = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if ( status !== 'granted'){
            Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a câmera!');
            return null;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
                
        if (result.canceled) {
            return null
        }
        
        return {uri : result.assets[0].uri}
    }

    const handleUploadImage = async (photo:ImageURISource|null) => {
        console.log(photo)
        if (!photo) {
            Alert.alert('Erro', 'Nenhuma imagem selecionada para enviar.');
            return;
        }
        
        if(!photo.uri){
            Alert.alert('Erro', 'Nenhuma imagem selecionada para enviar.');
            return
        }

        const formData = new FormData();
        const imageName = photo.uri.split('/').pop();

        formData.append('profile_picture', {
            uri: photo.uri,
            name: imageName,
            type: 'image/jpeg',
        } as any);

        try {
            const resposta = await alterarFotoPerfil(formData)
            
        } catch (error: any) {
            console.error('Erro ao enviar a imagem:', error);
            Alert.alert('Erro', `Falha ao enviar a imagem: ${error.message}`);
        } finally {
            recarregarPerfil()
        }
    }
    
    const handleOptionPress = async (option: imageOption) => {
        hideModal()
        let photo = null
        if (option === 'camera'){
            photo = await handleTakePhoto()
        } else if (option === 'galeria'){
            photo = await handlePickPhoto()
        }
        
        await handleUploadImage(photo)

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
                >
                    <Text className=" text-white text-xl">Foto de perfil</Text>
                    
                </View>

                <List.Item
                    style={{paddingHorizontal: 15}}
                    titleStyle={{color: 'white'}}
                    title='Câmera'
                    left={()=> <Ionicons size={24} color={'white'} name="camera" />}
                    onPress={async () => await handleOptionPress('camera')}
                    />

                <List.Item
                    style={{paddingHorizontal: 15}}
                    titleStyle={{color: 'white'}}
                    title='Galeria'
                    left={()=> <Ionicons size={24} color={'white'} name='images-outline' />}
                    onPress={async () => await handleOptionPress('galeria')}
                />


            </Modal>
        </Portal>
    )


}











