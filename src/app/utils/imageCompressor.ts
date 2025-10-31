import { ImageManipulator, ImageRef, SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const MAX_FILE_SIZE_BYTES = 5 * 1024**2; 

interface CompressedImageResult {
  uri: string;
  size: number; 
  wasResized: boolean; 
  finalQuality: number; 
}

export async function getFileSizeInBytes(fileUri: string): Promise<number | null> {
  let localUri = fileUri;

  try {
      const response = await fetch(localUri);
      
      if (!response.ok) {
          console.error(`Falha ao ler o arquivo: Status ${response.status}`);
          return null;
      }

      const blob = await response.blob();

      const sizeInBytes = blob.size; 

      // console.log(`Tamanho da foto (usando fetch/Blob.size): ${sizeInBytes} bytes`);

      return sizeInBytes;

  } catch (error) {
      console.error('Erro ao obter Blob/tamanho do arquivo:', error);
      return null;
  }
}

export const imageOptimized = async (uri: string, compress: number = 1) => {
  try {

    if(compress <= 0 || compress > 1){
      return null
    }

    const saveOptions = { 
      compress: compress, 
      format: SaveFormat.JPEG
    };

    // console.log(uri)
    
    const manipulator = ImageManipulator.manipulate(uri);  
    
    console.log(manipulator)

    manipulator.resize({width: 1000})

    const renderedImage = await manipulator.renderAsync();

    const manipResult = await renderedImage.saveAsync(saveOptions)

    console.log('URI da Imagem Otimizada (Novo Método):', manipResult.uri);
    return manipResult.uri;

  } catch (error) {
    console.error('Erro ao otimizar imagem (Novo Método):', error);
    return null;
  }
};

export const compressImage = async (uri: string) => {

  let i = 1;
  let compressImage = uri
  let imageBytes = await getFileSizeInBytes(compressImage)

  if(!imageBytes){
    return compressImage
  }

  while (i >= 0.1 && imageBytes > MAX_FILE_SIZE_BYTES){
    console.log(`Images bytes: ${imageBytes}`)
    
    if (imageBytes <= MAX_FILE_SIZE_BYTES){
      return compressImage
    }
    
    const imageOptimizedUri = await imageOptimized(compressImage, i)

    if(imageOptimizedUri){

      compressImage = imageOptimizedUri

      const imageBytesResult = await getFileSizeInBytes(compressImage)

      if(imageBytesResult){
        imageBytes = imageBytesResult
      }

    }


    
    console.log(i.toFixed(1)); 
    let nextValue = i - 0.1;
    i = parseFloat(nextValue.toFixed(1)); 
    i = Math.max(0, i);
  }

  return compressImage

}





