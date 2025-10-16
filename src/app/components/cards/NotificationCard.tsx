import { Notification } from "../../types/apiTypes";
import { View, Text } from "react-native";
import { Card, TouchableRipple } from "react-native-paper";
import { formatarDataISO } from "../../utils/functions";
import { Ionicons } from '@expo/vector-icons'






const estiloCard = {
    naoLida: ' rounded-xl shadow-md flex-row bg-white items-center gap-3 px-4',
    lida: ' rounded-xl shadow-md flex-row bg-gray-200 items-center gap-3 px-4'

}

type NotificationCardProps = {
    onNotificationRead: (id: number) => void, 
    navegarParaDetalhesSala: (id: string) => void
} & Notification

export default function NotificationCard({mensagem, lida, link, id, data_criacao, onNotificationRead, navegarParaDetalhesSala}: NotificationCardProps){
    const linkFormatado = link.replace('/salas/', "").replace('/', '')
    
    return (
        <TouchableRipple className='' onPress={() => navegarParaDetalhesSala(linkFormatado)}>
            <View className={lida ? estiloCard.lida : estiloCard.naoLida}>
                <View className="">
                    {lida ? 
                        <Ionicons name="checkmark-done-outline" size={28} />
                        :
                        <Ionicons name="alert-circle-outline" size={40}/>
                    }
                </View>
                <View className=" flex-col flex-1 justify-center items-end gap-2 rounded-xl p-1 h-24">
                    <Text numberOfLines={2} ellipsizeMode="tail"
                        className=" text-sm text-right"
                        // style={{textAlign: 'right'}}
                    >
                        {mensagem}
                    </Text>
                    <Text className="text-sm text-sgray">{formatarDataISO(data_criacao)}</Text>
                </View>
                {lida ? null : 
                    <TouchableRipple borderless={true} className=" bg-sblue p-3 rounded-full" 
                        onPress={() => onNotificationRead(id)}
                    >
                        <Ionicons name="checkmark-done" size={28} color={'white'}/>
                    </TouchableRipple>            
                }
            </View>
        </TouchableRipple>
    )
}
