import React, {useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text, ImageSourcePropType, Alert } from "react-native";
import { Modal, Portal, Provider, List, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker'
import { MediaType } from "expo-image-picker";
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import * as NativeImagePicker from 'react-native-image-picker'

import { Ionicons } from '@expo/vector-icons'
import { Usuario } from "../types/apiTypes";


interface ResponsaveisMultiselectProps{
        visible: boolean,
        hideModal: () => void,
        zeladores?: Usuario[],
        selectedResponsaveis?: Usuario[] | number[]
    
}

export default function ResponsaveisMultiselect({visible, hideModal}: ResponsaveisMultiselectProps){

    const [responsaveisInputText, setResponsaveisInputText] = useState('')




    return (
        <Portal>
        <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
                marginHorizontal: 16,
                borderRadius: 15,
                backgroundColor: 'white'
            }}
            >
            <View style={{
                flexDirection: 'row',
                paddingTop: 16,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 16,
                paddingHorizontal: 16
            }}
            >
                <Text className=" text-black text-xl">Zeladores</Text>
                
            </View>
            <View className=" flex-col px-4">
                <TextInput
                    label="Pesquisar zelador"
                    value={responsaveisInputText}
                    onChangeText={setResponsaveisInputText}
                    autoCapitalize="none"
                    keyboardType='default'
                    mode="outlined"
                    // style={styles.input}
                    activeOutlineColor='#004A8D'
                />
                

                <List.Item
                    style={{paddingHorizontal: 15}}
                    titleStyle={{color: 'black'}}
                    title='Câmera'
                    left={()=> <Ionicons size={24} color={'black'} name="camera" />}
                    onPress={async () => null}
                    />

                <List.Item
                    style={{paddingHorizontal: 15}}
                    titleStyle={{color: 'black'}}
                    title='Galeria'
                    left={()=> <Ionicons size={24} color={'black'} name='images-outline' />}
                    onPress={async () => null}
                />
            </View>

        </Modal>
    </Portal>

    )
}








