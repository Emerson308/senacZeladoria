import React, { useState, useMemo } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors } from '../../styles/colors';
import { string } from 'zod';
import { obterDetalhesSala } from '../servicos/servicoSalas';
import { showErrorToast, showSuccessToast } from '../utils/functions';
import { CommonActions, useNavigation, NavigationProp } from '@react-navigation/native';
import { AdminStackParamList } from '../navigation/types/StackTypes';
import { Ionicons } from '@expo/vector-icons'


const { width, height } = Dimensions.get('window');
const FRAME_SIZE = 250;


export default function QRCodeScanner() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [checkingData, setCheckingData] = useState<Boolean>(false)
  const navigation = useNavigation<NavigationProp<AdminStackParamList>>()


  const roiLimits = useMemo(() => {
    const minX = (width - FRAME_SIZE) / 2;
    const minY = (height - FRAME_SIZE) / 2;
    
    const maxX = minX + FRAME_SIZE;
    const maxY = minY + FRAME_SIZE;

    return { minX, minY, maxX, maxY };
  }, [width, height]);


  interface handleBarCodeScannedParams{
    data: string,
    bounds: {
      origin:{
        x: number,
        y: number
      },
      size:{
        width: number,
        height: number
      }
    }
  }

  const handleBarCodeScanned = async ({ data, bounds }: handleBarCodeScannedParams) => {
    if (scanned) return;
    
    if (bounds && bounds.origin && bounds.size) {
      
        const qrCodeCenterX = bounds.origin.x + bounds.size.width / 2;
        const qrCodeCenterY = bounds.origin.y + bounds.size.height / 2;
        
        const isInsideROI = (
          qrCodeCenterX >= roiLimits.minX &&
            qrCodeCenterX <= roiLimits.maxX &&
            qrCodeCenterY >= roiLimits.minY &&
            qrCodeCenterY <= roiLimits.maxY
          );
          
          if (isInsideROI) {
            setScanned(true);
            setCheckingData(true)
            const checkResult = await checkQrCodeData(data)
            if(checkResult){
              setTimeout(() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Tabs'}, {name: 'DetalhesSala', params:{id: data}}]
                  })
                )
              }, 3000)
            }
            // alert(`QR Code LIDO! Conteúdo: ${data}`);
            return;
          }
        }
    
  };

  const checkQrCodeData = async (data: string): Promise<Boolean> => {
    const detalhesSalaServiceResult = await obterDetalhesSala(data)
    if(!detalhesSalaServiceResult.success){
      console.log(detalhesSalaServiceResult.errMessage)
      showErrorToast({errMessage: 'QR Code inválido'})
      setCheckingData(false)
      return false
    }
    showSuccessToast({successMessage: 'Sala encontrada.'})
    // setCheckingData(false)
    return true
  }

  if (!permission) {
    return <View className=' flex-1 justify-center items-center bg-white' />;
  }
  if (!permission.granted) {
    requestPermission()
  }

  return (
    <View className=' flex-1 bg-black'>
      <CameraView
        onBarcodeScanned={handleBarCodeScanned} 
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject} 
      />

      <TouchableOpacity className='absolute top-10 bg-black/20 p-4 rounded-full left-4' onPress={navigation.goBack}>
        <Ionicons name='arrow-back' size={24} color={'white'}/>
      </TouchableOpacity>

      <View className=' justify-center items-center bg-transparent' style={{...StyleSheet.absoluteFillObject}}>
        
        <View style={{width: FRAME_SIZE, height: FRAME_SIZE}} className=' border-4 border-white rounded-xl' />
        
        <Text className=' text-white mt-64 w-4/5 text-center text-lg font-bold bg-black/60 p-3 rounded-md'>
          Posicione o QR Code da sala dentro do quadrado
        </Text>
      </View>

      {(scanned && !checkingData) && (
        <SafeAreaView className=' absolute bottom-80 w-4/5 self-center '>
            <TouchableOpacity className=' items-center p-3 bg-sblue rounded-xl' onPress={() => setScanned(false)}>
                <Text className=' text-white text-lg'>Tocar para Escanear Novamente</Text>
            </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
}
