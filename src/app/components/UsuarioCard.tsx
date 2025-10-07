import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import { Card, Button, Avatar } from "react-native-paper"
import { Sala, UserGroup, Usuario } from "../types/apiTypes";
import { formatarDataISO } from "../utils/functions";
import React from "react";
import { colors } from "../../styles/colors";
import { apiURL } from "../api/axiosConfig";

interface propsUsuarioCard{
    key: number
    usuario: Usuario,
    usersGroups: UserGroup[]
}

function UsuarioCard({usuario, usersGroups}: propsUsuarioCard){
    return (
        <View className="mb-4 mx-3 rounded-lg shadow-md bg-white">
            <Card  style={styles.bgWhite}>
                <Card.Content style={styles.contentCard}>
                    <View className=" flex-1 px-4 flex-row gap-3">
                        <View className=" items-center flex-row">
                            {
                                usuario.profile.profile_picture ? 
                                    <Avatar.Image source={{uri: apiURL + usuario.profile.profile_picture}}/>
                                :
                                    <Avatar.Text label={usuario.username.charAt(0).toUpperCase()}/>
                            }
                        </View>
                        <View className=" flex-1 flex-col">
                            <View className=" flex-row gap-2 items-center">
                                <Text numberOfLines={1} className=" flex-1 text-2xl" ellipsizeMode="tail">{usuario.username}</Text>
                                {
                                    usuario.is_superuser
                                    ? <Text style={styles.textGreen} className=" text-sm">Admin</Text>
                                    : <Text style={styles.textYellow} className=" text-sm">Usuário padrão</Text>
                                }

                            </View>
                            <Text numberOfLines={1} ellipsizeMode="tail" className=" text-sm"> Email: {usuario.email ? usuario.email : 'Sem email'}</Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" className=" text-sm"> Nome: {usuario.nome ? usuario.nome : 'Sem nome'}</Text>
                        </View>
                    </View>
                    <View className=" flex-1 flex-row gap-2 px-4 flex-wrap">
                        {
                            usuario.groups.length === 0 ?
                            <Text style={{
                                padding: 1,
                                paddingHorizontal: 5,
                                borderRadius: 5,
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
                </Card.Content>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    contentCard: {
        flexDirection: 'column',
        gap: 12,
        paddingLeft: 0,
        paddingRight: 0,
    },

    bgWhite:{
        backgroundColor: 'white'
    },

    textYellow:{
        color: colors.syellow,
        backgroundColor: colors.syellow + '20',
        padding: 1,
        textAlign: 'center',
        paddingHorizontal: 5,
        borderRadius: 20
    },
    
    textGreen:{
        color: colors.sgreen,
        backgroundColor: colors.sgreen + '20',
        padding: 1,
        textAlign: 'center',
        paddingHorizontal: 5,
        borderRadius: 20
    }
})

export default React.memo(UsuarioCard)

















