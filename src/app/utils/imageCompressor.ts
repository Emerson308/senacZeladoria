import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024; 

interface CompressedImageResult {
  uri: string;
  size: number; 
  wasResized: boolean; 
  finalQuality: number; 
}

const getFileSizeInBytes = async (uri: string): Promise<number> => {
  try {
    const file = new FileSystem.File(uri);
    
    const fileInfo = await file.info({ size: true } as FileSystem.InfoOptions);

    return fileInfo.exists && fileInfo.size !== undefined ? fileInfo.size : 0;
  } catch (error) {
    console.error("Erro ao obter o tamanho do arquivo (tentativa File().info):", error);
    
    try {
       const legacyInfo = await FileSystem.getInfoAsync(uri, { size: true } as FileSystem.InfoOptions);
       return legacyInfo.exists && legacyInfo.size !== undefined ? legacyInfo.size : 0;
    } catch (e) {
       console.error("Erro no fallback getInfoAsync:", e);
       return 0;
    }
  }
};

export const compressImageToMaxSize = async (imageUri: string): Promise<CompressedImageResult> => {
  let currentUri: string = imageUri;
  let currentQuality: number = 0.9; 
  let resizeFactor: number = 1.0; 
  let currentSize: number = await getFileSizeInBytes(currentUri);
  let wasResized: boolean = false;
  
  console.log(`Tamanho inicial: ${(currentSize / 1024 / 1024).toFixed(2)} MB`);

  while (currentSize > MAX_FILE_SIZE_BYTES && currentQuality > 0.1) {
    currentQuality = Math.max(0.1, currentQuality - 0.1); 

    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri, 
      [], 
      { 
        compress: currentQuality, 
        format: ImageManipulator.SaveFormat.JPEG, 
      }
    );

    currentUri = manipResult.uri;
    currentSize = await getFileSizeInBytes(currentUri);
    
    console.log(`[COMPRESSÃO] Qualidade ${currentQuality.toFixed(1)}, Tamanho: ${(currentSize / 1024 / 1024).toFixed(2)} MB`);
  }

  if (currentSize > MAX_FILE_SIZE_BYTES) {
    wasResized = true;
    currentQuality = 0.8; 
    
    const originalMetadata = await ImageManipulator.manipulateAsync(imageUri, [], {});
    let { width: originalWidth } = originalMetadata;
    let newWidth = originalWidth;

    while (currentSize > MAX_FILE_SIZE_BYTES && resizeFactor > 0.3) {
      resizeFactor -= 0.1; 
      newWidth = Math.floor(originalWidth * resizeFactor);
      
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri, 
        [{ resize: { width: newWidth } }], 
        { 
          compress: currentQuality, 
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      currentUri = manipResult.uri;
      currentSize = await getFileSizeInBytes(currentUri);

      console.log(`[RESIZE] Fator ${resizeFactor.toFixed(1)}, Nova Largura: ${newWidth}, Tamanho: ${(currentSize / 1024 / 1024).toFixed(2)} MB`);
    }
  }

  console.log('--- Processo Finalizado ---');
  console.log(`Tamanho final: ${(currentSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Redimensionamento aplicado: ${wasResized ? 'Sim' : 'Não'}`);
  console.log(`Qualidade JPEG final: ${currentQuality.toFixed(1)}`);
  
  if (currentSize > MAX_FILE_SIZE_BYTES) {
      console.warn('ATENÇÃO: Não foi possível atingir o limite de 6MB mesmo com compressão/resize máximo.');
  }

  return { 
    uri: currentUri, 
    size: currentSize, 
    wasResized, 
    finalQuality: currentQuality 
  };
};