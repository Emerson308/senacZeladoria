import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../AuthContext";
import React, { useContext, useEffect, useState } from "react";
import LimpezasAndamentoCard from "../components/cards/LimpezasAndamentoCard";
import { RegistroSala } from "../types/apiTypes";
import { getRegistrosService } from "../servicos/servicoLimpezas";
import { showErrorToast } from "../utils/functions";







export default function LimpezasAndamentoScreen(){

    const authContext = useContext(AuthContext)

    if(!authContext){
        return
    }

    if(!authContext.user){
        return
    }

    const { user } = authContext
    const navigation = useNavigation()
    const [ refreshing, setRefreshing ] = useState(false)

    const [limpezasEmAndamento, setLimpezasEmAndamento] = useState<RegistroSala[]>([])

    useFocusEffect(React.useCallback(() => {
        carregarLimpezasAndamento()
    }, []))

    const carregarLimpezasAndamento = async () => {
        const username = user.username
        const getAllRegistrosServiceResult = await getRegistrosService({
            username,
        })
        if(!getAllRegistrosServiceResult.success){
            showErrorToast({errMessage: getAllRegistrosServiceResult.errMessage})
            return
        }

        const limpezasEmAndamento = getAllRegistrosServiceResult.data.filter(item => {
            return item.data_hora_fim === null
        })

        setLimpezasEmAndamento(limpezasEmAndamento)

        if(limpezasEmAndamento.length === 0){
            navigation.goBack()
        }
        return

    }





    return (
        <SafeAreaView className=" flex-1 bg-white">
            <View className=" items-center flex-row py-4 px-5 rounded-lg rounded-b-none gap-4 border-b-2 border-gray-200">
                <TouchableRipple 
                    borderless={true}
                    onPress={navigation.goBack}
                    className=" p-3 rounded-full"
                >
                    <Ionicons name="arrow-back" size={24}/>
                </TouchableRipple>
                <Text className=" text-2xl flex-1 text-black">Limpezas em andamento</Text>
            </View>

            <FlatList
                renderItem={(item) => <LimpezasAndamentoCard {...item.item} onPress={() => navigation.navigate('ConcluirLimpeza', {registroSala: item.item})} />}
                data={limpezasEmAndamento}
                keyExtractor={(item) => String(item.id)}
                contentContainerClassName=" gap-4 px-3 my-4"
                refreshing={refreshing}
                onRefresh={ async () => {
                    setRefreshing(true)
                    // updateLimpezasEmAndamento()
                    await carregarLimpezasAndamento().then(() => {
                        setRefreshing(false)
                    })
                }}
            />
        </SafeAreaView>
    )
}