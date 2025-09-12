import { TouchableOpacity, View, StyleSheet, Text as TextS } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import { Sala, UserGroup, Usuario } from "../types/apiTypes";
import { formatarDataISO } from "../functions/functions";
import { colors } from "../../styles/colors";

interface propsUsuarioCard{
    key: number
    usuario: Usuario,
    usersGroups: UserGroup[]
}

export default function UsuarioCard({usuario, usersGroups}: propsUsuarioCard){
    return (
        <TouchableOpacity className="mb-4 mx-3 rounded-lg shadow-md bg-white">
            <Card  style={styles.bgWhite}>
                <Card.Content style={styles.contentCard}>
                    <View className=" mx-4">
                        <Text numberOfLines={1} className=" mb-2" ellipsizeMode="tail" variant="headlineSmall">{usuario.username}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" variant="bodyMedium"> Email: {usuario.email ? usuario.email : 'Sem email'}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" variant="bodyMedium"> Nome: {usuario.nome ? usuario.nome : 'Sem nome'}</Text>
                        <View className="flex-row mt-1">
                            <Text variant="bodyMedium"> Nível de permissão: </Text>
                            {
                                usuario.is_superuser
                                ? <Text style={styles.textGreen} variant="bodyMedium">Admin</Text>
                                : <Text style={styles.textYellow} variant="bodyMedium">Usuário Padrão</Text>
                            }
                            
                        </View>
                        <Text className=""> Grupos do usuario:</Text>
                        <View className=" flex-wrap flex-row mt-1 mx-2 gap-3">
                            {
                                usuario.groups.length === 0 ?
                                    <Text style={{
                                        padding: 1,
                                        paddingHorizontal: 5,
                                        borderRadius: 5,
                                        // flex: 1,
                                        // textAlign: 'center',
                                        // opacity: 0,
                                        color: colors.sgray,
                                        backgroundColor: colors.sgray + '20',
                                    }} >Sem Grupos</Text>
                                :
                                    usersGroups.map(group => {
                                        if (usuario.groups.includes(group.id)){
                                            return <Text key={group.id} style={{
                                                padding: 1,
                                                paddingHorizontal: 5,
                                                borderRadius: 5,
                                                color: colors.tagColors[group.id -1],
                                                backgroundColor: colors.tagColors[group.id -1] + '20',
                                            }} >{group.name}</Text>
                                        }
                                    })
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


















