import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import { RegistroSala, Sala } from "../types/apiTypes";
import { formatarDataISO } from "../functions/functions";
import { colors } from "../../styles/colors";

interface propsRegistroCard{
    registro: RegistroSala;
    key: number;
    onPress?: () => void,
}

export default function RegistroCard({registro, onPress}: propsRegistroCard){


    return (
        <TouchableOpacity className="mb-4 mx-3 rounded-lg shadow-md bg-white" onPress={onPress}>
            <Card  style={styles.bgWhite}>
                <Card.Content style={styles.contentCard}>
                    <View className=" mx-4 flex-1">
                        <Text variant="headlineSmall" numberOfLines={1} ellipsizeMode="tail">{registro.sala_nome}</Text>
                        <View className="mt-2">
                            <Text variant="bodyMedium">Última Limpeza:</Text>
                            <Text variant="bodySmall"> {formatarDataISO(registro.data_hora_limpeza)}</Text>
                            <Text variant="bodySmall"> Por {registro.funcionario_responsavel.username}</Text>

                        </View>
                        {/* <Text variant="bodyMedium"> Capacidade: {}</Text> */}

                    </View>
                        {/* <View className=" mt-2 mr-4">

                        </View> */}
                </Card.Content>
                {/* <Card.Actions>
                    <Button
                        mode="contained-tonal"
                        buttonColor={colors.sblue}
                        textColor={'white'}
                        className=" mt-2"
                        onPress={(e) => {
                            e.stopPropagation();
                            // props.marcarSalaComoLimpa()
                            
                        }
                        }
                    >
                        Marcar como limpa
                    </Button>
                </Card.Actions> */}
            </Card>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    contentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingHorizontal: 'auto',
        gap: 10,
        // backgroundColor: 'white',
        // borderStyle: 'solid',
        // borderColor: 'black',
        // borderWidth: 2,
        // padding: 0,
        paddingLeft: 'auto',
        paddingRight: 'auto',
    },

    bgWhite:{
        backgroundColor: 'white'
    },

    textYellow:{
        color: '#854d0e',
        backgroundColor: '#fef9c3',
        padding: 1,
        paddingHorizontal: 5,
        borderRadius: 20
    },
    
    textGreen:{
        color: '#166534',
        backgroundColor: '#dcfce7',
        padding: 1,
        paddingHorizontal: 5,
        borderRadius: 20
    }
})