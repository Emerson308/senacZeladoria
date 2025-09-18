import { TouchableOpacity, View, StyleSheet, Text as TextN, Image } from "react-native"
import { Card, Button, Text } from "react-native-paper"
import { Sala } from "../types/apiTypes";
import { formatarDataISO } from "../functions/functions";
import { colors } from "../../styles/colors";
import {Ionicons} from '@expo/vector-icons'
import { apiURL } from "../api/axiosConfig";


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
                    <View className=" h-28 flex-row items-center">
                    {
                        sala.imagem ?
                            <Image
                                source={{uri: apiURL + sala.imagem}}
                                className=" h-full flex-1 rounded-md rounded-b-none"
                            />
                        : 
                            <View className="  h-full flex-1 bg-gray-200 rounded-md rounded-b-none items-center justify-center" >
                                <TextN className=" text-xl text-center">Sem Imagem</TextN>
                            </View>


                    }

                    </View>
                    <View className=" flex-1 flex-row px-4 py-2 gap-3">
                        <View className=" flex-1 ">
                            <View className=" flex-row items-center">
                                <Text className=" flex-1" variant="headlineSmall" numberOfLines={1} ellipsizeMode="tail">{sala.nome_numero}</Text>

                            </View>
                                {
                                    sala.status_limpeza === 'Limpa'
                                    ? <Text style={styles.textGreen} className=" my-1 mr-auto" variant="bodyMedium">{sala.status_limpeza}</Text>
                                    : <Text style={styles.textYellow} className=" my-1 mr-auto" variant="bodyMedium">{sala.status_limpeza}</Text>
                                }
                            <View className=" flex-row gap-2 items-center ml-2">
                                <Ionicons
                                    name='people-outline'
                                    size={18}
                                />
                                <Text variant="bodyMedium" numberOfLines={1} ellipsizeMode="tail">{sala.capacidade}</Text>
                            </View>
                            <View className=" flex-row gap-2 items-center ml-2">
                                <Ionicons
                                    name='location-outline'
                                    size={18}
                                />
                                <Text variant="bodyMedium" numberOfLines={1} ellipsizeMode="tail">{sala.localizacao}</Text>
                            </View>
                        </View>
                        {/* <View className="flex-col ">
                            {
                                sala.status_limpeza === 'Limpa'
                                ? <Text style={styles.textGreen} variant="bodyMedium">{sala.status_limpeza}</Text>
                                : <Text style={styles.textYellow} variant="bodyMedium">{sala.status_limpeza}</Text>
                            }
                            
                        </View> */}
                    </View>
                </Card.Content>
                    {/* {userRole === 'user' ?
                    (
                        <Card.Actions>
                            {null}
                        </Card.Actions>
                    )
                    : 
                    (
                        <Card.Actions>
                            <View className=" flex-row items-center justify-center mt-1 gap-4">
                                
                                <View className="flex-1 items-center flex-row gap-2">
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
                    } */}
            </Card>
        </TouchableOpacity>
        

    )
}

                                    {/* {
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

                                    } */}



const styles = StyleSheet.create({
    contentCard: {
        flexDirection: 'column',
        gap: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0
        // padding: 0
    },

    bgWhite:{
        backgroundColor: 'white'
    },

    textYellow:{
        color: colors.syellow,
        backgroundColor: colors.syellow + '20',
        padding: 1,
        paddingHorizontal: 5,
        borderRadius: 20,
        // height: 
    },
    
    textGreen:{
        color: colors.sgreen,
        backgroundColor: colors.sgreen + '20',
        padding: 1,
        paddingHorizontal: 5,
        borderRadius: 20
    }
})