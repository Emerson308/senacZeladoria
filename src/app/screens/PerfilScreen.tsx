import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usuarioLogado, alterarFotoPerfil } from "../servicos/servicoUsuarios";
import { Usuario } from "../types/apiTypes";
import { Alert, Text, View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { Avatar, Button, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../styles/colors";
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { apiURL } from "../api/axiosConfig";
import ImgTypeSelector from "../components/ImgTypeSelector";
import { ImageURISource } from "react-native";
import Toast from "react-native-toast-message";
import { showErrorToast } from "../utils/functions";
import SalasAtribuidasModal from "../components/SalasAtribuidasModal";
import { useSalas } from "../contexts/SalasContext";
import { useAuthContext } from "../contexts/AuthContext";
import LoadingComponent from "../components/LoadingComponent";
import { getFileSizeInBytes } from "../utils/imageCompressor";






export default function PerfilScreen(){

    const {salas} = useSalas()

    const { signOut, usersGroups } = useAuthContext()
    const [userData, setUserData] = useState<Usuario|null>(null)
    const [carregando, setCarregando] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [salasAtribuidasModalVisible, setSalasAtribuidasModalVisible] = useState(false)
    const navigation = useNavigation()

    const [rodapeImgSelectorVisible, setRodapeImgSelectorVisible] = useState(false)    

    useEffect(() => {
        setCarregando(true)
        carregarDadosDoUsuario()
        setCarregando(false)
    }, [])

    const carregarDadosDoUsuario = async () => {
        setRefreshing(true)
        const usuarioLogadoResult = await usuarioLogado()
        if(!usuarioLogadoResult.success){
            showErrorToast({errMessage: usuarioLogadoResult.errMessage})
            return
        }
        
        setUserData(usuarioLogadoResult.data)
        setRefreshing(false)
        
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
                onPress: async () => await signOut()
            }
        ])
    }

    const handleUploadImage = async (photo:ImageURISource) => {
        console.log('Teste imagem: \n')
        console.log(getFileSizeInBytes(photo.uri ? photo.uri : ''))
        console.log(photo)
        
        if(!photo.uri){
            showErrorToast({errMessage: 'Nenhuma imagem selecionada para enviar'})
            return
        }

        const formData = new FormData();
        const imageName = photo.uri.split('/').pop();

        formData.append('profile_picture', {
            uri: photo.uri,
            name: imageName,
            type: 'image/jpeg',
        } as any);
        

        const alterarFotoPerfilResult = await alterarFotoPerfil(formData)
        if(!alterarFotoPerfilResult.success){
            showErrorToast({errMessage: alterarFotoPerfilResult.errMessage})
        }
        
        await carregarDadosDoUsuario()
    }

    const deleteProfileImage = async () => {
        const formData = new FormData();

        formData.append('profile_picture', '');
        

        const alterarFotoPerfilResult = await alterarFotoPerfil(formData)
        if(!alterarFotoPerfilResult.success){
            showErrorToast({errMessage: alterarFotoPerfilResult.errMessage})
        }
        
        await carregarDadosDoUsuario()

    }

    const handleDeleteimage = async () => {
        Alert.alert('Excluir imagem de perfil', 'Tem certeza que deseja excluir sua imagem de perfil?', [
            {
                text: 'Cancelar',
                style: 'cancel'
            },
            {
                text: 'Confirmar',
                style: 'destructive',
                onPress: async () => await deleteProfileImage()
            }
        ])
    }

    const salasAtribuidas = salas.filter(sala => {
        if(!userData){
            return false
        }
        return sala.responsaveis.includes(userData.username)
    })


    const irParaAlterarSenha = () => {
        navigation.navigate('AlterarSenha')
    }

    if (carregando || userData === null){
        return (
            <LoadingComponent loadLabel="Carregando dados do usuário..." reLoadFunction={async () => await carregarDadosDoUsuario()}/>
        )
    }
    
    return (
        <SafeAreaView edges={['top']} className=" flex-1 flex-col pb-4 bg-gray-100" >
            <SalasAtribuidasModal 
                salasAtribuidas={salasAtribuidas} 
                visible={salasAtribuidasModalVisible}
                onDismiss={() => setSalasAtribuidasModalVisible(false)}
                navigateDetalhesSala={(id) => navigation.navigate('DetalhesSala', {id})}
            />
            <ImgTypeSelector visible={rodapeImgSelectorVisible} header="Foto de perfil" hideModal={() => setRodapeImgSelectorVisible(false)} handleUploadImage={handleUploadImage}/>
            <View className=" bg-white py-2 pt-4 px-5 flex-row gap-6 items-center border-b-2 border-gray-100">
                <Text className=" text-2xl flex-1" >Perfil</Text>
                {
                    !userData.groups.includes(1) ? null : 
                    <View className=" flex-row gap-8">
                        <TouchableOpacity
                            onPress={() => setSalasAtribuidasModalVisible(true)}
                            className=" p-2"
                            >
                            <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color={'black'}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Registros', {zelador: userData})}
                            className=" p-2"
                        >
                            <Ionicons name="stats-chart" size={24} color={'black'}/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <ScrollView style={{}} className=" flex-1 " contentContainerClassName=" flex-1" 
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarDadosDoUsuario}/>}
            >
                <View className=" items-center py-10 bg-white border-b border-gray-200">
                    <View className=" ">
                        <TouchableOpacity onPress={handleDeleteimage} className=" bg-gray-300 absolute -right-6 -top-3 z-10 p-1 rounded-full">
                            <Ionicons name="close" size={24} color={colors.sgray}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setRodapeImgSelectorVisible(true)}>
                        {
                            userData.profile.profile_picture === null ?
                                <Avatar.Text label={userData.username.charAt(0)} size={86}/>
                            :
                                <Avatar.Image size={86} source={ { uri: apiURL + userData.profile.profile_picture}} />
                                // null
                        }
                        </TouchableOpacity>
                    </View>
                    <Text className=" text-xl font-bold text-gray-800">{userData.username}</Text>
                </View>

                <View className="flex-1 px-5 pt-5">
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

                    <View className=" flex-row flex-wrap gap-2 justify-between items-center bg-white p-4 rounded-lg mb-2 shadow-sm">
                        <Text className=" text-base font-bold text-gray-600">Grupos do usuário: </Text>
                        <View className=" flex-row gap-2 flex-wrap">

                        {
                            userData.groups.length === 0 ?
                            <Text className=" self-center" style={{
                                padding: 1,
                                paddingHorizontal: 5,
                                borderRadius: 5,
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

                    <TouchableOpacity onPress={irParaAlterarSenha} className=" flex-row flex-wrap items-center bg-white p-4 rounded-lg mt-10 shadow-sm">
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
                    </TouchableOpacity>
                </View>

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

            </ScrollView>
            {/* <View className=" h-10 border"></View> */}
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










