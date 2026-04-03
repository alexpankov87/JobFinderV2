import { supabase } from './supabase';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Resume, WorkExperience } from '../types';

// НИКАКИХ ЛОКАЛЬНЫХ ОБЪЯВЛЕНИЙ ТИПОВ!

export async function getUserResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createResume(
  resume: Omit<Resume, 'id' | 'created_at' | 'updated_at' | 'file_url'>
) {
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      ...resume,
      file_url: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
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

export async function deleteResume(id: number) {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function setActiveResume(userId: string, resumeId: number) {
  await supabase
    .from('resumes')
    .update({ is_active: false })
    .eq('user_id', userId);

  const { data, error } = await supabase
    .from('resumes')
    .update({ is_active: true })
    .eq('id', resumeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

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

    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',
    });

    const binaryString = atob(fileContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { error } = await supabase.storage
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