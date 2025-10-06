import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import { RegistroSala, Sala } from "../types/apiTypes";
import { formatarDataISO } from "../utils/functions";
import { colors } from "../../styles/colors";
import React from "react";

interface propsRegistroCard{
    registro: RegistroSala;
    key: number;
    onPress?: () => void,
}

function RegistroCard({registro, onPress}: propsRegistroCard){


    return (
        <View className="mb-4 mx-3 rounded-lg shadow-md bg-white">
            <Card  style={styles.bgWhite}>
                <Card.Content style={styles.contentCard}>
                    <View className=" mx-4 flex-1">
                        <Text variant="headlineSmall" numberOfLines={1} ellipsizeMode="tail"
                            className=""
                        >
                            {registro.sala_nome}
                        </Text>

                        <View className="mt-2 pl-2 ">
                            <Text variant="bodyMedium">Última Limpeza: 
                            </Text>
                            <Text variant="bodySmall"> {formatarDataISO(registro.data_hora_inicio) + ' até ' + 
                                formatarDataISO(registro.data_hora_fim)}
                            </Text>
                            <Text variant="bodySmall"> Por {registro.funcionario_responsavel}</Text>

                        </View>

                    </View>
                </Card.Content>
            </Card>
        </View>

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

export default React.memo(RegistroCard)