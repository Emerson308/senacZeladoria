import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ListRenderItemInfo, RefreshControl, ScrollView, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { lerNotificacao, lerTodasAsNotificacoes, listarNotificacoes } from "../servicos/servicoNotificacoes";
import { Notification } from "../types/apiTypes";
import Toast from "react-native-toast-message";
import NotificationCard from "../components/cards/NotificationCard";
import { showErrorToast } from "../utils/functions";
import LoadingCard from "../components/cards/LoadingCard";
import { useNotifications } from "../contexts/NotificationsContext";




export default function NotificationScreen(){

    const {
        notifications,
        contagemNotificacoesNaoLidas,
        refreshing,
        carregarNotificacoes,
        readAllNotifications,
        readNotification
    } = useNotifications()

    const navigation = useNavigation()


    useEffect(() => {
        carregarNotificacoes()
    }, [])

    const navegarParaDetalhesSala = useCallback((id: string) => {
        navigation.navigate('DetalhesSala', {id})
    }, [])

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
            <View className=" flex-row justify-between px-4 gap-4 my-4 items-center">
                <View className=" flex-1">
                    {/* <Text className=" text-lg font-bold">Notificações: {notifications.length}</Text> */}
                    {/* <Text className=" text-base font-bold">Notificações nao lidas: {contagemNotificacoesNaoLidas}</Text> */}
                </View>
                <TouchableRipple className=" bg-sblue px-4 py-3 rounded-full" borderless={true} onPress={async () => await readAllNotifications()}>
                    <View className=" flex-row gap-2 items-center">
                        <MaterialCommunityIcons size={28} name="bell-check" color={'white'}/>
                        <Text className=" text-white">Marcar notificações como lidas ({contagemNotificacoesNaoLidas})</Text>
                    </View>
                </TouchableRipple>
            </View>
            {refreshing ? 
                <ScrollView className=" gap-4 px-3 pb-4" refreshControl={<RefreshControl
                    refreshing={refreshing}
                />}>
                    {[1,2,3,4,5].map(item => <LoadingCard key={item}/>)}
                </ScrollView>
                :
                <FlatList
                    renderItem={(item) => <NotificationCard {...item.item} 
                        onNotificationRead={
                            async () => await readNotification(item.item.id)
                        }
                        navegarParaDetalhesSala={navegarParaDetalhesSala}
                    />}
                    data={notifications}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerClassName="gap-4 px-3 pb-4"
                    
                    refreshing={refreshing}
                    onRefresh={async () => {
                        await carregarNotificacoes(true)
                    }}
                />

            }
        </SafeAreaView>
    )
}