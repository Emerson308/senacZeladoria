import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { Portal, Modal, TouchableRipple } from "react-native-paper";
import React from "react";
import {Ionicons} from '@expo/vector-icons'







interface EstatisticasCardListProps{
    visible: boolean,
    onDismiss: () => void,
    children?: React.ReactNode
}

export default function EstatisticasCardList({
    visible,
    onDismiss: onDismiss,
    children
}: EstatisticasCardListProps){
    


    return(
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={{
                    backgroundColor: 'white', 
                    margin: 20, 
                    borderRadius: 12
                }}
            >
                <View className="py-4 rounded-xl bg-gray-100 flex-col">
                    <View className=" flex-row px-4 items-center">
                        <Text className=" text-2xl flex-1 font-bold" >Limpezas em andamento</Text>
                        <TouchableRipple onPress={onDismiss} borderless={true} className=" rounded-full p-2">
                            <Ionicons name="close" size={24} />
                        </TouchableRipple>

                    </View>
                    <View className=" border-b border-gray-300 my-2"/>
                    <Text className=" text-sgray px-4 mb-2">7 resultados</Text>
                    <View className=" h-80">
                        {children}
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}