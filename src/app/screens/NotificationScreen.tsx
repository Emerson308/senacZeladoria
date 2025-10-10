import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { lerNotificacao, lerTodasAsNotificacoes, listarNotificacoes } from "../servicos/servicoSalas";
import { Notification } from "../types/apiTypes";
import Toast from "react-native-toast-message";
import NotificationCard from "../components/cards/NotificationCard";
import { showErrorToast } from "../utils/functions";




export default function NotificationScreen(){

    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false)
    const [notificacoes, setNotificacoes] = useState<Notification[]>([])


    useEffect(() => {
        carregarNotificacoes()
    }, [])

    const carregarNotificacoes = async () => {
        const listarNotificacoesResult = await listarNotificacoes()
        if(!listarNotificacoesResult.success){
            showErrorToast({errMessage: listarNotificacoesResult.errMessage})
            return
        }
        
        setNotificacoes(listarNotificacoesResult.data)
    }
    
    const readAllNotifications = async () => {
        const lerTodasAsNotificacoesResult = await lerTodasAsNotificacoes()
        if(!lerTodasAsNotificacoesResult.success){
            showErrorToast({errMessage: lerTodasAsNotificacoesResult.errMessage})
            return
        }
        
        setRefreshing(true)
        await carregarNotificacoes()
        setRefreshing(false)
    }
    
    const readNotification = async (id: number) => {
        const lerNotificacaoResult = await lerNotificacao(id)
        if(!lerNotificacaoResult.success){
            showErrorToast({errMessage: lerNotificacaoResult.errMessage})
            return
        }

        setRefreshing(true)
        await carregarNotificacoes()
        setRefreshing(false)
    }

    return (
        <SafeAreaView className=" bg-gray-100 flex-col p-1 flex-1">
            <View className=" items-center flex-row py-4 px-5 rounded-lg rounded-b-none gap-4 border-b-2 border-gray-200">
                <TouchableRipple 
                    borderless={true}
                    onPress={navigation.goBack}
                    className=" p-3 rounded-full"
                >
                    <Ionicons name="arrow-back" size={24}/>
                </TouchableRipple>
                <Text className=" text-2xl flex-1 text-black">Notificações</Text>
            </View>
            <View className=" items-end my-4">
                <TouchableRipple className=" bg-sblue px-4 py-3 rounded-full" borderless={true} onPress={async () => await readAllNotifications()}>
                    <View className=" ">
                        <Text className=" text-white">Marcar notificações como lidas</Text>
                    </View>
                </TouchableRipple>
            </View>
            <FlatList
                renderItem={(item) => <NotificationCard {...item.item} onNotificationRead={
                    async () => await readNotification(item.item.id)
                }/>}
                data={notificacoes}
                keyExtractor={(item) => String(item.id)}
                contentContainerClassName="gap-4 px-3 pb-4"
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true)
                    carregarNotificacoes().then(() => setRefreshing(false))
                }}
            />
        </SafeAreaView>
    )
}