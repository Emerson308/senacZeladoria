import { View } from "react-native";





interface LoadingCardProps {
    loadingImage?: boolean
}

export default function LoadingCard({ loadingImage }: LoadingCardProps){
    return(
        <View className="shadow-md p-4 flex-row bg-white rounded-xl mb-3">
            {loadingImage && <View className=" aspect-square bg-gray-200 rounded" />}
            <View className="animate-pulse flex-col flex-1 gap-3 justify-center pl-4">
                <View className="h-5 bg-gray-200 rounded mb-1.5 w-2/5" />
                <View className="h-3.5 bg-gray-200 rounded mb-1.5 w-1/5" />
                <View className="h-4 bg-gray-200 rounded mb-1.5 w-4/5" />
                <View className="h-4 bg-gray-200 rounded mb-1.5 w-1/2" />
            </View>
        </View>
    )
}