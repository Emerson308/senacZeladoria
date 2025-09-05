import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import { Sala, Usuario } from "../types/apiTypes";
import { formatarDataISO } from "../functions/functions";
import { colors } from "../../styles/colors";

interface propsUsuarioCard{
    key: number
    usuario: Usuario
}

export default function UsuarioCard({usuario}: propsUsuarioCard){
    return (
        <TouchableOpacity className="mb-4 mx-3 rounded-lg shadow-md bg-white">
            <Card  style={styles.bgWhite}>
                <Card.Content style={styles.contentCard}>
                    <View className=" mx-4">
                        <Text numberOfLines={1} ellipsizeMode="tail" variant="headlineSmall">{usuario.username}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" variant="bodyMedium"> Email: {usuario.email ? usuario.email : 'Sem email'}</Text>
                        <View className="flex-row">
                            <Text variant="bodyMedium"> Nível de permissão: </Text>
                            {
                                usuario.is_staff
                                ? <Text style={styles.textGreen} variant="bodyMedium">Admin</Text>
                                : <Text style={styles.textYellow} variant="bodyMedium">Usuário Padrão</Text>
                            }
                            
                        </View>

                    </View>
                    {/* <View className=" mt-2 mr-4">
                        <Text variant="bodyMedium">Última Limpeza:</Text>
                        <Text variant="bodySmall"> {formatarDataISO(props.sala.ultima_limpeza_data_hora)}</Text>
                        <Text variant="bodySmall"> Por {props.sala.ultima_limpeza_funcionario}</Text>

                    </View> */}
                </Card.Content>
                {/* <Card.Actions>
                    <Button
                        mode="contained-tonal"
                        buttonColor={colors.sblue}
                        textColor={'white'}
                        onPress={(e) => {
                            e.stopPropagation();
                            // props.marcarSalaComoLimpa(props.sala.id)
                            
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


















