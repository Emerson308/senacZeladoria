import React, { use, useEffect } from "react";
import { View, Text } from "react-native";
import { Modal, Portal, TouchableRipple } from "react-native-paper";
import {Ionicons} from '@expo/vector-icons'

interface FiltersOptionsProps<T extends string = string>{
    visible: boolean,
    onDismiss: () => void,
    children: React.ReactNode,
    className?: string,
    // filterSelectors: FilterSelector<T>[] 
}

export default function FiltersOptions<T extends string = string>({visible, onDismiss, children, className}: FiltersOptionsProps<T>){

    return(
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{
                backgroundColor: 'white', 
                margin: 20, 
                borderRadius: 10
            }}>
                <View className=" py-5">
                    <View className=" px-5 flex-row items-center">
                        <Text className="font-bold text-2xl flex-1">Filtros</Text>
                        <TouchableRipple onPress={onDismiss} borderless={true} className=" rounded-full p-2">
                            <Ionicons name="close" size={24} />
                        </TouchableRipple>
                    </View>
                    <View className=" border-b border-gray-300 my-2"/>
                    <View className={` px-5 ${className}`}>
                        {children}
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}