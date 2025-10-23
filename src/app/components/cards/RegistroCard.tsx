import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import { Card, Button } from "react-native-paper"
import { RegistroSala, Sala } from "../../types/apiTypes";
import { formatarDataISO } from "../../utils/functions";
import { colors } from "../../../styles/colors";
import React from "react";

interface propsRegistroCard{
    registro: RegistroSala;
    key: number;
    onPress?: (registro: RegistroSala) => void,
}

function RegistroCard({registro, onPress}: propsRegistroCard){


    return (
        <TouchableOpacity onPress={() => onPress?.(registro)} className="mb-4 mx-3 rounded-xl shadow-md bg-white">
            <Card  style={{backgroundColor: 'white'}}>
                <Card.Content style={styles.contentCard}>
                    <View className=" mx-4 flex-1">
                        <Text numberOfLines={1} ellipsizeMode="tail"
                            className=" text-2xl"
                        >
                            {registro.sala_nome}
                        </Text>

                        <View className="mt-2 pl-2 ">
                            <Text className=" text-base">Última Limpeza: 
                            </Text>
                            <Text className=" text-sm"> {formatarDataISO(registro.data_hora_inicio) + ' até ' + 
                                formatarDataISO(registro.data_hora_fim)}
                            </Text>
                            <Text className=" text-sm"> Por {registro.funcionario_responsavel}</Text>

                        </View>

                    </View>
                </Card.Content>
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
})

export default React.memo(RegistroCard)