import { View, Text } from 'react-native'
import { Modal, Portal, TouchableRipple, TextInput } from 'react-native-paper';
import React, { useState } from 'react';
import { colors } from '../../styles/colors';


interface HandleConfirmationTexts{
    headerText: string;
    bodyText: string;
    confirmText: string;
    cancelText?: string;
}


type HandleConfirmationProps = {
    visible: boolean;
    onConfirm: () => void;
    confirmationTexts: HandleConfirmationTexts;
    onCancel: () => void;
    type: 'confirmAction' | 'destructiveAction' | 'reportAction';
    setObservacao?: (text: string) => void;
    observacao?: string;
}


export default function HandleConfirmation({ 
    visible, 
    onConfirm, 
    onCancel, 
    type, 
    setObservacao,
    observacao,
    confirmationTexts: { headerText, bodyText, confirmText, cancelText='Cancelar' }
}: HandleConfirmationProps) {

    const typeStyles = {
        confirmAction: {
            headerColor: 'text-sblue',
            bodyColor: 'text-gray-800',
            confirmButtonColor: 'bg-sblue',
            cancelButtonColor: 'bg-gray-300'
        },
        destructiveAction: {
            headerColor: 'text-sred',
            bodyColor: 'text-gray-800',
            confirmButtonColor: 'bg-sred',
            cancelButtonColor: 'bg-gray-300'
        },
        reportAction: {
            headerColor: 'text-syellow',
            bodyColor: 'text-gray-800',
            confirmButtonColor: 'bg-syellow',
            cancelButtonColor: 'bg-gray-300'
        }
    };
    
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={{
                backgroundColor: 'white', 
                padding: 20, 
                margin: 20, 
                borderRadius: 10
            }}>
                <View className=" gap-8">
                    <Text
                        className={typeStyles[type].headerColor + ' font-bold text-2xl'}
                    >{headerText}</Text>
                    {type === 'reportAction' ? (
                        <TextInput
                            label="Observação (opcional)"
                            value={observacao}
                            onChangeText={setObservacao}
                            activeOutlineColor={colors.sblue}
                            mode='outlined'
                        />
                    )
                        :
                        <Text className={typeStyles[type].bodyColor}>{bodyText}</Text>
                    }
                    <View className="flex-row justify-between  gap-8">
                        <TouchableRipple
                            onPress={onCancel}
                            className={`flex-1 py-4 rounded-xl ${typeStyles[type].cancelButtonColor}`}
                        >
                            <Text className="text-center">{cancelText}</Text>
                        </TouchableRipple>
                        <TouchableRipple
                            onPress={() => onConfirm()}
                            className={`flex-1 py-4 rounded-xl ${typeStyles[type].confirmButtonColor}`}
                        >
                            <Text className="text-center text-white">{confirmText}</Text>
                        </TouchableRipple>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}