import { supabase } from './supabase';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


export interface Resume {
  id: number;
  user_id: string;
  title: string;
  position: string;
  experience: string | null;
  education: string | null;
  skills: string[];
  languages: string[];
  file_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Загрузка всех резюме пользователя
export async function getUserResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Создание резюме (без файла)
export async function createResume(resume: Omit<Resume, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('resumes')
    .insert(resume)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Обновление резюме
export async function updateResume(id: number, updates: Partial<Resume>) {
  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Удаление резюме
export async function deleteResume(id: number) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Выбор активного резюме (снимает активность с остальных)
export async function setActiveResume(userId: string, resumeId: number) {
  // Сначала снимаем активность со всех резюме пользователя
  await supabase
    .from('resumes')
    .update({ is_active: false })
    .eq('user_id', userId);

  // Затем активируем выбранное
  const { data, error } = await supabase
    .from('resumes')
    .update({ is_active: true })
    .eq('id', resumeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Загрузка PDF файла
export async function uploadResumeFile(userId: string, resumeId: number): Promise<string | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    const file = result.assets[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${resumeId}.${fileExt}`;
    const fileUri = file.uri;

    // Читаем файл как Base64 (исправлено)
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',  // ← строка, не EncodingType.Base64
    });

    // Конвертируем Base64 в Uint8Array
    const binaryString = atob(fileContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Загружаем в Storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, bytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) throw error;

    const { data: signedUrlData } = await supabase.storage
      .from('resumes')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365);

    return signedUrlData?.signedUrl || null;
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return null;
  }
}

// Вспомогательная функция для декодирования Base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}