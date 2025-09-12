import { TouchableOpacity, View, StyleSheet, Text as TextN } from "react-native"
import { Card, Button, Text } from "react-native-paper"
import { Sala } from "../types/apiTypes";
import { formatarDataISO } from "../functions/functions";
import { colors } from "../../styles/colors";
import {Ionicons} from '@expo/vector-icons'


interface propsSalaCard{
    sala: Sala;
    key: number;
    onPress: () => void,
    marcarSalaComoLimpa: (id:string) => void,
    editarSala: (sala: Sala) => void,
    excluirSala: (id: string) => void,
    userRole: 'user' | 'admin',
    userGroups: number[]

}

export default function SalaCard({sala, onPress, marcarSalaComoLimpa, editarSala, excluirSala, userRole, userGroups}: propsSalaCard){

    // console.log(userGroups)

    return (
        <TouchableOpacity className="mb-4 mx-3 rounded-lg shadow-md bg-white" onPress={onPress}>
            <Card  style={styles.bgWhite}>
                <Card.Content style={styles.contentCard}>
                    <View className=" ml-4 flex-1">
                        <Text variant="headlineSmall" numberOfLines={1} ellipsizeMode="tail">{sala.nome_numero}</Text>
                        <Text variant="bodyMedium"> Capacidade: {sala.capacidade}</Text>
                        <Text variant="bodySmall"> Última Limpeza: 
                            {sala.ultima_limpeza_funcionario ? 
                                ' ' + formatarDataISO(sala.ultima_limpeza_data_hora) + ' Por ' + sala.ultima_limpeza_funcionario 
                                :
                                ' Sala sem histórico de limpeza'
                            }
                        </Text>
                        {/* <Text variant="bodySmall" > { sala.ultima_limpeza_funcionario ? formatarDataISO(sala.ultima_limpeza_data_hora) : 'Sala sem historico de limpeza'}</Text>
                        {!sala.ultima_limpeza_funcionario ? null : 
                        
                            <Text variant="bodySmall"> Por {sala.ultima_limpeza_funcionario}</Text>
                        } */}
                        <View className="flex-row">
                            <Text variant="bodyMedium"> Status: </Text>
                            {
                                sala.status_limpeza === 'Limpa'
                                ? <Text style={styles.textGreen} variant="bodyMedium">{sala.status_limpeza}</Text>
                                : <Text style={styles.textYellow} variant="bodyMedium">{sala.status_limpeza}</Text>
                            }
                            
                        </View>

                    </View>
                </Card.Content>
                    {userRole === 'user' ?
                    (
                        <Card.Actions>
                            {/* <TouchableOpacity
                                className=" mt-2 flex-1 flex-row rounded-full p-2 gap-2 items-center justify-center"
                                style={{backgroundColor: colors.sgreen + '20'}}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    marcarSalaComoLimpa(sala.id)
                                    
                                }
                            }
                            >
                                <View className="flex-row gap-2 mr-2">
                                    <Ionicons
                                        name='checkmark-circle-outline' 
                                        size={22} 
                                        color={colors.sgreen}
                                        // style={{ marginLeft: 15 }} 
                                    />
                                    <TextN className="text-sgreen" >Limpar sala</TextN>    
                                </View>
                            </TouchableOpacity> */}
                            {
                                userGroups.includes(1) ?
                                <Button
                                    mode='contained-tonal'
                                    buttonColor={colors.sgreen + '20'}
                                    textColor={colors.sgreen}
                                    icon={'broom'}
                                    className=" mx-5 my-3 mb-0 mt-5"
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        marcarSalaComoLimpa(sala.qr_code_id)
                                    }}
                                    
                                >
                                    Limpar sala
                                </Button>
                                :
                                null

                            }
                        </Card.Actions>
                    )
                    : 
                    (
                        <Card.Actions>
                            <View className=" flex-row items-center justify-center mt-1 gap-4">
                                
                                <View className="flex-1 items-center flex-row gap-2">
                                    {
                                        userGroups.includes(1) ?
                                        <Button
                                            mode='contained-tonal'
                                            buttonColor={colors.sgreen + '20'}
                                            textColor={colors.sgreen}
                                            icon={'broom'}
                                            className=" flex-1"
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                marcarSalaComoLimpa(sala.qr_code_id)
                                            }}
                                            
                                        >
                                            Limpar sala
                                        </Button>
                                        :
                                        null

                                    }

                                </View>
                                <View className=" flex-row gap-2 items-center justify-center h-full">

                                    <TouchableOpacity
                                        className="flex-row rounded-full p-2 px-4 gap-2 items-center justify-center"
                                        style={{backgroundColor: colors.sred + '20'}}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            excluirSala(sala.qr_code_id)
                                            
                                        }
                                    }
                                    >
                                        <Ionicons
                                            name='trash-outline' 
                                            size={22} 
                                            color={colors.sred}
                                            // style={{ marginLeft: 15 }} 
                                        />
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        className="flex-row rounded-full p-2 px-4 gap-2 items-center justify-center"
                                        style={{backgroundColor: colors.sblue + '20'}}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            editarSala(sala)
                                            
                                        }
                                    }
                                    >
                                        <Ionicons
                                            name='pencil-outline' 
                                            size={22} 
                                            color={colors.sblue}
                                            // style={{ marginLeft: 15 }} 
                                        />
                                    </TouchableOpacity>
                                </View>

                            </View>

                        </Card.Actions>

                    )
                    }
            </Card>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    contentCard: {
        flexDirection: 'column',
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
        color: colors.syellow,
        backgroundColor: colors.syellow + '20',
        padding: 1,
        paddingHorizontal: 5,
        borderRadius: 20
    },
    
    textGreen:{
        color: colors.sgreen,
        backgroundColor: colors.sgreen + '20',
        padding: 1,
        paddingHorizontal: 5,
        borderRadius: 20
    }
})