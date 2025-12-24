// services/imageStorage.ts
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

const DOCUMENT_DIR = (FileSystem as any).documentDirectory as string;

export const ensureImageDir = async () => {
  const IMAGE_DIR = `${DOCUMENT_DIR}images/`;
  const dirInfo = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
  }
};

export const saveImageToDevice = async (uri: string): Promise<string> => {
  await ensureImageDir();
  const filename = `${uuidv4()}.jpg`;
  const newPath = `${DOCUMENT_DIR}images/${filename}`;
  
  await FileSystem.copyAsync({
    from: uri,
    to: newPath,
  });
  
  return newPath;
};