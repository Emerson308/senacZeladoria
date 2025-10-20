import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState } from "react";
import { colors } from "../../styles/colors";

interface ChartData {
    value: number;
    color: string;
    label: string;
    legendFontColor: string;
    legendFontSize: number
}

const data: ChartData[] = [
    {
        label: 'Alimentos',
        value: 30,
        color: colors.sblue,
        legendFontColor: 'black',
        legendFontSize: 15
    },
    {
        label: 'Transporte',
        value: 30,
        color: colors.sred,
        legendFontColor: 'black',
        legendFontSize: 15
    },
    {
        label: 'Moradia',
        value: 30,
        color: colors.syellow,
        legendFontColor: 'black',
        legendFontSize: 15
    },
    {
        label: 'Outros',
        value: 30,
        color: colors.sgray,
        legendFontColor: 'black',
        legendFontSize: 15
    },
]

const widthAndHeight = 250;

const sliceWidth = 50;



const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientColor: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`
}

export default function EstatisticasLimpeza() {

    const [refreshing, setRefreshing] = useState(false)

    const series = data.map(item => item.value)
    const sliceColor = data.map(item => item.color)

    const seriesData = data.map(item => ({
        value: item.value,
        color: item.color
    }))

    return (
        <SafeAreaView edges={['top']} className=" flex-1 bg-gray-100 pb-4 flex-col">
            <View className=" bg-white py-2 pt-4 px-5 flex-row gap-6 items-center border-b-2 border-gray-100">
                <Text className=" text-2xl" >Estatísticas</Text>
            </View>
            <ScrollView 
                className=" border my-4 py-4"
                contentContainerClassName=" gap-4 px-4"
                refreshControl={<RefreshControl refreshing={refreshing}/>}
            >
                <View className=" p-4 shadow-md bg-white rounded-lg flex-col">
                    <Text className=" text-xl font-bold">Status das salas</Text>
                    <View className=" border">

                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}