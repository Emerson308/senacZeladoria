
import { TextInput, TextInputProps } from "react-native-paper";
import { Text, View } from "react-native";
import { colors } from "../../styles/colors";

interface CustomTextInputProps extends TextInputProps{
    errorMessage? : string
}

export function CustomTextInput({errorMessage, error, className, style, ...restOfProps}: CustomTextInputProps){

    const hasError = !!errorMessage

    return(
        <View className={className} style={style}>
            <TextInput
                error={hasError}
                textColor="black"
                outlineColor={colors.sgray}
                theme={{colors:{onSurfaceVariant: colors.sgray}}}
                outlineStyle={{borderWidth: 1.5}}
                style={{
                    backgroundColor: 'white',
                    color: 'black',
                }}
                {...restOfProps}
            />
            {errorMessage && <Text className=" text-red-500 text-sm">{errorMessage}</Text>}        
        </View>

    )

}