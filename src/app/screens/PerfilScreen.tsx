import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usuarioLogado } from "../servicos/servicoUsuarios";
import { Usuario } from "../types/apiTypes";
import { Alert, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Avatar, Button } from "react-native-paper";
import { AuthContext } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import {Ionicons} from '@expo/vector-icons'





export default function PerfilScreen(){

    const authContext = useContext(AuthContext);

    if (!authContext){
        return null
    }


    const { signOut, usersGroups } = authContext
    const [userData, setUserData] = useState<Usuario|null>(null)
    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const navigation = useNavigation()
    

    useEffect(() => {
        setCarregando(true)
        carregarDadosDoUsuario()
        setCarregando(false)
    }, [])

    const carregarDadosDoUsuario = async () => {
        try{
            const resposta = await usuarioLogado()
            if (resposta === null){
                Alert.alert('Erro', 'Erro ao carregar dados', [
                    {
                        text: 'Ok',
                        style: 'default',
                        onPress: () => navigation.navigate('Home')
                    }
                ])
                // navigation.navigate('Home')
                return
                
            }        
            setUserData(resposta)
            // console.log(resposta)
        } catch(erro: any){
            setMensagemErro(erro.message || 'Não foi possivel carregar seu perfil')
            if(erro.message.includes('Token de autenticação expirado ou inválido.')){
                signOut()
            }
            Alert.alert('Erro', mensagemErro, [
                {
                    text: 'Ok',
                    style:'default',
                    // onPress: () => navigation.navigate('Home')
                    
                }
            ])
            

        }
    }
    
    const handleExit = () => {
        Alert.alert('Confirmar logout', 'Tem certeza de que deseja sair da sua conta?', [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Confirmar',
                style: 'destructive',
                onPress: () => navigation.navigate('Logout')
            }
        ])
    }

    const irParaAlterarSenha = () => {
        navigation.navigate('AlterarSenha')
    }

    if (carregando){
        return(
            <View className='flex-1 bg-gray-50 justify-center p-16'>
                <ActivityIndicator size={80}/>
            </View>
        )    
    }

    if (userData === null){
        return (
            <View className='flex-1 bg-gray-50 justify-center p-16'>
                <ActivityIndicator size={80}/>
            </View>
        )
    }
    
    return (
        <SafeAreaView className=" flex-1 bg-gray-100">
            <View className=" items-center py-10 bg-white border-b border-gray-200">
                {/* <View className=" w-20 h-20 rounded-full bg-blue-500 justify-center items-center mb-2">
                    <Text className=" text-4xl font-bol
                d text-white">{userData.username.charAt(0)}</Text>
                </View> */}
                {
                    userData.profile.profile_picture === null ?
                        <Avatar.Text label={userData.username.charAt(0)} size={86}/>
                    :
                        // <Avatar.Image size={86} source={userData.profile.profile_picture} />
                        null
                }
                <Text className=" text-xl font-bold text-gray-800">{userData.username}</Text>
            </View>

            <View className="flex-1 p-5">
                <View className=" flex-row flex-wrap justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm">
                    <Text className=" text-base font-bold text-gray-600">Email:</Text>
                    <Text className=" text-base text-gray-800">{userData.email ? userData.email : 'Sem email'}</Text>
                </View>

                <View className=" flex-row flex-wrap justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm">
                    <Text className=" text-base font-bold text-gray-600">Nome:</Text>
                    <Text className=" text-base text-gray-800">{userData.nome ? userData.nome : 'Sem nome'}</Text>
                </View>

                <View className=" flex-row justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm">
                    <Text className=" text-base font-bold text-gray-600">Nivel de permissão:</Text>
                    {userData.is_superuser ? <Text className="text-base font-bold text-sgreen">Admin</Text> : <Text className="text-base font-bold text-syellow">Usuário comum</Text>}
                </View>

                <View className=" flex-row justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm">
                    <Text className=" text-base font-bold text-gray-600">Grupos do usuário: </Text>
                    <View className=" flex-row gap-2 flex-wrap">

                    {
                        userData.groups.length === 0 ?
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
                                if (userData.groups.includes(group.id)){
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

                <TouchableOpacity onPress={irParaAlterarSenha} className=" flex-row flex-wrap items-center bg-white p-4 rounded-lg mt-20 shadow-sm">
                    <Ionicons
                        name="key-outline"
                        size={24}
                    />
                    <Text className=" text-base font-bold ml-4 text-gray-600">Alterar Senha</Text>
                    <Ionicons 
                        name="arrow-forward-outline"
                        size={26}
                        className=" ml-auto"
                    />
                    {/* <Text className=" text-base text-gray-800">{userData.email ? userData.email : 'Sem email'}</Text> */}
                </TouchableOpacity>
            </View>

            {/* <View className=" bg-white p-5 mb-16">

            </View> */}

            <Button
                className="mt-8 mx-5"
                mode='contained-tonal'
                buttonColor={colors.sred}
                textColor={'white'}
                icon={'logout'}
                contentStyle={{paddingVertical: 3}}
                onPress={handleExit}
            >
                Sair
            </Button>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    textYellow:{
        color: '#eab308',
        // backgroundColor: '#fef9c3',
        // padding: 1,
        // paddingHorizontal: 5,
        // borderRadius: 20
    },
    
    textGreen:{
        color: '#00292E',
        // backgroundColor: '#dcfce7',
        // padding: 1,
        // paddingHorizontal: 5,
        // borderRadius: 20
    }
})










