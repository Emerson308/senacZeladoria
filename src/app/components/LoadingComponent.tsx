import { useEffect, useState } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import {Ionicons} from '@expo/vector-icons'






interface LoadingComponentProps{
    loadLabel?: string,
    reLoadLabel?: string
    reLoadFunction?: () => void
}

export default function LoadingComponent({loadLabel, reLoadFunction, reLoadLabel}: LoadingComponentProps){

    const [reLoadButton, setReLoadButton] = useState(false)
    const [label, setLabel] = useState(loadLabel)


    useEffect(() => {
        setTimeout(() => {
            setReLoadButton(true)
            if(reLoadLabel){
                setLabel(reLoadLabel)
            }
        }, 2000)
    }, [])


    return( 
      <SafeAreaView className='flex-1 bg-gray-50 justify-center p-16'>
        <View className=" gap-4 items-center">
            {
                !reLoadButton || !reLoadFunction? 
                <ActivityIndicator size={80}/>
                :
                <View className=" bg-gray-200 p-4 rounded-full">
                    <Ionicons name="close" size={100}/>
                </View>

            }
            {!label ? null : 
                <Text className=' mt-2 text-center'>{label}</Text>
            }
            {
                !reLoadButton || !reLoadFunction ? null : 
                <TouchableOpacity onPress={reLoadFunction} className='bg-gray-300 self-center p-2 rounded-md'>
                    <Text>Tentar novamente</Text>
                </TouchableOpacity>
            }
        </View>
      </SafeAreaView>
      
    )
}