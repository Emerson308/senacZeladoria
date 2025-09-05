import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import { Sala } from "../types/apiTypes";
import { formatarDataISO } from "../functions/functions";
import { colors } from "../../styles/colors";

interface propsSalaCard{
    sala: Sala;
    key: number;
    onPress: () => void,
    marcarSalaComoLimpa: (id:number) => void
}

export default function SalaCard(props: propsSalaCard){


    return (
        <TouchableOpacity className="mb-4 mx-3 rounded-lg shadow-md bg-white" onPress={props.onPress}>
            <Card  style={styles.bgWhite}>
                <Card.Content style={styles.contentCard}>
                    {/* O componente Title e Paragraph foram descontinuados */}
                    {/* Usando o componente Text do Paper com a propriedade variant */}
                    <View className=" ml-4 flex-1">
                        <Text variant="headlineSmall" numberOfLines={1} ellipsizeMode="tail">{props.sala.nome_numero}</Text>
                        {/* <Text variant="bodyMedium">Localização: {props.sala.localizacao}</Text> */}
                        <Text variant="bodyMedium"> Capacidade: {props.sala.capacidade}</Text>
                        <View className="flex-row">
                            <Text variant="bodyMedium"> Status: </Text>
                            {
                                props.sala.status_limpeza === 'Limpa'
                                ? <Text style={styles.textGreen} variant="bodyMedium">{props.sala.status_limpeza}</Text>
                                : <Text style={styles.textYellow} variant="bodyMedium">{props.sala.status_limpeza}</Text>
                            }
                            
                        </View>

                    </View>
                    <View className=" mt-2 mr-4">
                        <Text variant="bodyMedium">Última Limpeza:</Text>
                        <Text variant="bodySmall"> {formatarDataISO(props.sala.ultima_limpeza_data_hora)}</Text>
                        <Text variant="bodySmall"> Por {props.sala.ultima_limpeza_funcionario}</Text>

                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button
                        mode="contained-tonal"
                        buttonColor={colors.sblue}
                        textColor={'white'}
                        onPress={(e) => {
                            e.stopPropagation();
                            props.marcarSalaComoLimpa(props.sala.id)
                            
                        }
                        }
                    >
                        Marcar como limpa
                    </Button>
                </Card.Actions>
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