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
    hideModal: () => void,
    aspect? : [number, number]
    handleUploadImage: (photo: ImageURISource) => void,
    header? : string

}

type imageOption = 'camera' | 'galeria'

export default function ImgTypeSelector({visible, hideModal, handleUploadImage, aspect=[1,1], header}: RodapeImgSelectorProps){

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
            aspect: aspect,
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
            aspect: aspect,
            quality: 1,
        });
                
        if (result.canceled) {
            return null
        }
        
        return {uri : result.assets[0].uri}
    }
    
    const handleOptionPress = async (option: imageOption) => {
        hideModal()
        let photo = null
        if (option === 'camera'){
            photo = await handleTakePhoto()
        } else if (option === 'galeria'){
            photo = await handlePickPhoto()
        }
        if(photo){
            handleUploadImage(photo)

        }

    }

    return (
        <Portal>
            <Modal
                
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={{
                    marginHorizontal: 16,
                    borderRadius: 15,
                    backgroundColor: '#121212'
                }}
                >
                {header ? 
                    <View style={{
                        flexDirection: 'row',
                        paddingTop: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: 16,
                        paddingHorizontal: 16
                    }}
                    >
                        <Text className=" text-white text-xl">Foto de perfil</Text>
                        
                    </View>
                : null                
                }

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











