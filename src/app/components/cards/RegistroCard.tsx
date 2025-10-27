import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import { Card, Button } from "react-native-paper"
import { RegistroSala, Sala } from "../../types/apiTypes";
import { formatarDataISO, formatSecondsToHHMMSS, getSecondsUtcDiference } from "../../utils/functions";
import { colors } from "../../../styles/colors";
import React from "react";



interface CampoTextProps {
    keyText: string,
    value: string | number
}

const CampoText = ({keyText, value}: CampoTextProps) => {

    return (
        <View className=" gap-1 flex-row items-center">
            <Text className=" text-sm font-bold">{keyText}</Text>
            <Text className=" text-sm">{value}</Text>
        </View>
    )

}

interface TempoDeLimpezaProps{
    inicio: string,
    fim: string
}

const TempoDeLimpeza = ({inicio, fim}: TempoDeLimpezaProps) => {
    const seconds = getSecondsUtcDiference(inicio, fim)
    const limpezaTimer = formatSecondsToHHMMSS(seconds)

    const contadorStyle = {
        fastTime: 'text-sgreen',
        mediumTime: 'text-syellow',
        slowTime: 'text-sred'
    }

    const getContadorStyle = (seconds: number): string => {
        if (seconds < 1200) {
            return contadorStyle.fastTime;
        } else if (seconds < 2400) {
            return contadorStyle.mediumTime;
        } else {
            return contadorStyle.slowTime;
        }
    }


    return (
        <View className=" items-center justify-center gap-1">
            <Text className=" text-lg font-bold">Tempo de limpeza</Text>
            <Text className={` text-lg font-bold ${getContadorStyle(seconds)} `}>{limpezaTimer}</Text>
        </View>

    )
}

interface RegistroDataTempoProps{
    inicio: string,
    fim: string
}

const RegistroDataTempo = ({inicio, fim}: RegistroDataTempoProps) => {


    return (
        <View className=" bg-gray-100 p-3 rounded-md flex-row gap-2 justify-between items-center">
            <View className=" gap-1">
                <CampoText keyText="Início:" value={formatarDataISO(inicio)}/>
                <CampoText keyText="Fim:" value={formatarDataISO(fim)}/>
            </View>
            <TempoDeLimpeza inicio={inicio} fim={fim}/>
        </View>
    )
    
}

interface RegistroTitles {
    nomeSala: string,
    nomeResponsavel: string,
    type: RegistroCardType
}

const RegistroTitles = ({nomeSala, nomeResponsavel, type}: RegistroTitles) => {

    let salaTitleVisible = true
    let responsavelTitleVisible = true
    let ResponsavelTitle = "text-xl font-bold"

    if(type === 'Sala'){
        salaTitleVisible = false;
        ResponsavelTitle = "text-2xl font-bold"
    }

    if(type === 'Zelador'){
        responsavelTitleVisible = false
    }


    return (
        <View className="  flex-1">
            {!salaTitleVisible ? null : 
                <Text className=" text-2xl font-bold" numberOfLines={1} ellipsizeMode="middle">{nomeSala}</Text>
            }
            {!responsavelTitleVisible ? null : 
                <Text className={ResponsavelTitle} numberOfLines={1} ellipsizeMode="tail">{nomeResponsavel}</Text>
            }
        </View>

    )
}

interface RegistroTags{
    imagesCount: number,
    observacoesVisible: boolean,
}

const RegistroTags = ({imagesCount, observacoesVisible}: RegistroTags) => {

    return (
        <View className=" h-16 justify-between">
            <Text className=" p-1 bg-sgray/20 text-sgray rounded-md text-sm text-center font-bold">{imagesCount} imagens</Text>
            {
                observacoesVisible ? null :
                <Text className=" p-1 px-2 bg-syellow/20 text-syellow rounded-md text-sm text-center font-bold">Observação</Text>

            }
        </View>

    )
}

interface RegistroCardTopProps{
    type: RegistroCardType,
    nomeSala: string,
    nomeResponsavel: string,
    imagesCount: number,
    observacoesVisible: boolean
}

const RegistroCardTop = ({type, nomeSala, nomeResponsavel, imagesCount, observacoesVisible}: RegistroCardTopProps) => {



    return (
        <View className=" flex-row gap-4">
            <RegistroTitles nomeSala={nomeSala} nomeResponsavel={nomeResponsavel} type={type}/>
            <RegistroTags imagesCount={imagesCount} observacoesVisible={observacoesVisible}/>
        </View>
    )
}

type RegistroCardType = 'All' | 'Sala' | 'Zelador'

interface propsRegistroCard{
    registro: RegistroSala;
    type: RegistroCardType
    // key: number;
    onPress?: (registro: RegistroSala) => void,
}

function RegistroCard({registro, onPress, type}: propsRegistroCard){

    if(registro.data_hora_fim === null){
        return null
    }

    return (
        <TouchableOpacity onPress={() => onPress?.(registro)} className=" rounded-xl h-48 justify-center shadow-md bg-white">
            <View className="  flex-1 p-4 flex-col gap-3">
                <RegistroCardTop 
                    nomeSala={registro.sala_nome}
                    nomeResponsavel={registro.funcionario_responsavel}
                    imagesCount={registro.fotos.length}
                    observacoesVisible={ !registro.observacoes ? true : false}
                    type={type}
                />
                <RegistroDataTempo inicio={registro.data_hora_inicio} fim={registro.data_hora_fim} /> 
            </View>
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