import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Modal, Portal, TouchableRipple } from "react-native-paper";
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { Sala } from "../types/apiTypes";








interface SalasAtribuidasModalProps{
    visible: boolean,
    onDismiss: () => void
    salasAtribuidas: Sala[],
    navigateDetalhesSala: (id: string) => void

}

export default function SalasAtribuidasModal({salasAtribuidas, visible, onDismiss, navigateDetalhesSala}: SalasAtribuidasModalProps) {

    const renderSalaAtribuida = (sala: Sala) => {

        return (
            <TouchableOpacity onPress={() => {
                onDismiss()
                navigateDetalhesSala(sala.qr_code_id)
            }}>
                <View className=" py-4 h-20 items-center gap-4 flex-row px-2 bg-white rounded-xl shadow-md">
                    <Text className=" text-base flex-1">{sala.nome_numero}</Text>
                    <View>
                        {
                            sala.status_limpeza === 'Limpa'
                            ? <Text className=" p-1 text-sm px-5 rounded-3xl bg-sgreen/20 text-sgreen mr-auto">{sala.status_limpeza}</Text>
                            : sala.status_limpeza === 'Limpeza Pendente'
                            ? <Text className=" p-1 text-sm px-5 rounded-3xl bg-syellow/20 text-syellow mr-auto">{sala.status_limpeza}</Text>
                            : sala.status_limpeza === 'Suja' 
                            ? <Text className=" p-1 text-sm px-5 rounded-3xl bg-sred/20 text-sred mr-auto">{sala.status_limpeza}</Text>
                            : <Text className=" p-1 text-sm px-5 rounded-3xl bg-sgray/20 text-sgray mr-auto">{sala.status_limpeza}</Text>
                        }
                    </View>
                    <Ionicons name="chevron-forward-outline" size={36} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                style={{}}
                contentContainerStyle={{margin: 20, backgroundColor: 'white', borderRadius: 10}}
            >
                <View className=" py-5 shadow-md min-h-96">
                    <View className=" justify-between gap-4 px-4 flex-row items-center">
                        <Text className=" font-bold text-2xl">Salas atribuídas</Text>
                        <TouchableRipple
                            borderless={true}
                            className="p-3 rounded-full items-center justify-center"
                            onPress={onDismiss}
                        >
                            <Ionicons name="close"  size={24}/>
                        </TouchableRipple>
                    </View>
                    <View className=" border-b border-gray-300 my-4"/>
                    <View className=" px-4">
                        <Text className=" text-base text-sgray">{salasAtribuidas.length} resultados.</Text>
                    </View>
                    <FlatList
                        data={salasAtribuidas}
                        renderItem={(item) => renderSalaAtribuida(item.item)}
                        contentContainerClassName="px-4 py-2 gap-4"
                        className=" my-2 max-h-96"
                    />


                </View>
            </Modal>
        </Portal>
    )
}