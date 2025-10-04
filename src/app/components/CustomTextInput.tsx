
import { TextInput, TextInputProps } from "react-native-paper";
import { Text, View } from "react-native";

interface CustomTextInputProps extends TextInputProps{
    errorMessage? : string
}

export function CustomTextInput({errorMessage, error, className, style, ...restOfProps}: CustomTextInputProps){

    const hasError = !!errorMessage

    return(
        <View className={className} style={style}>
            <TextInput
                error={hasError}
                {...restOfProps}
            />
            {errorMessage && <Text className=" text-red-500 text-sm">{errorMessage}</Text>}        
        </View>

    )

}