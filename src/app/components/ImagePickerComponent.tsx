import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, Alert, ImageSourcePropType } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = () => {
  const [image, setImage] = useState<ImageSourcePropType | null>(null);

  const handlePickImage = async () => {
    // 1. Pedir permissão para acessar a galeria de mídia
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // 2. Checar o status da permissão
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Desculpe, precisamos de permissão para acessar a galeria de fotos!');
      return;
    }

    // 3. Abrir a galeria de imagens
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // 4. Se o usuário não cancelou, atualize a imagem
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  const handleTakePhoto = async () => {
    // 1. Pedir permissão para acessar a câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    // 2. Checar o status da permissão
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Desculpe, precisamos de permissão para acessar a câmera!');
      return;
    }

    // 3. Abrir a câmera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas fotos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // 4. Se o usuário não cancelou, atualize a imagem
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seletor de Imagens com Expo</Text>
      <View style={styles.buttonContainer}>
        <Button title="Escolher Imagem" onPress={handlePickImage} />
        <Button title="Tirar Foto" onPress={handleTakePhoto} />
      </View>
      {image && <Image source={image} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default ImagePickerComponent;