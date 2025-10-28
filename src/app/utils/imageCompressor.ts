import {ImageManipulator} from 'expo-image-manipulator';
// import 
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024; 

interface CompressedImageResult {
  uri: string;
  size: number; 
  wasResized: boolean; 
  finalQuality: number; 
}

export async function getFileSizeInBytes(fileUri: string): Promise<number | null> {
  let localUri = fileUri;
  // if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
  //     localUri = `file://${fileUri}`;
  // }

  try {
      const response = await fetch(localUri);
      
      if (!response.ok) {
          console.error(`Falha ao ler o arquivo: Status ${response.status}`);
          return null;
      }

      const blob = await response.blob();

      const sizeInBytes = blob.size; 

      console.log(`Tamanho da foto (usando fetch/Blob.size): ${sizeInBytes} bytes`);

      return sizeInBytes;

  } catch (error) {
      console.error('Erro ao obter Blob/tamanho do arquivo:', error);
      return null;
  }
}

// const imageOptimized = async (uri: string) => {
//   try {
//     // 1. Array de ações: Redimensionar para largura máxima de 1000 pixels
//     const actions = [
//       { 
//         resize: { width: 1000 } 
//       }
//     ];

//     // 2. Opções de salvamento: Formato JPEG e qualidade de compressão
//     const saveOptions = { 
//       compress: 0.7, 
//       format: ImageManipulator.SaveFormat.JPEG 
//     };

//     // Chamada correta: ImageManipulator.manipulate(uri, actions, saveOptions)
//     const manipResult = await ImageManipulator.manipulate(
//       uri,
//       actions, 
//       saveOptions
//     );

//     console.log('URI da Imagem Otimizada (Novo Método):', manipResult.uri);
//     return manipResult.uri;

//   } catch (error) {
//     console.error('Erro ao otimizar imagem (Novo Método):', error);
//     return null;
//   }
// };