import { supabase } from './supabase';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { Resume, WorkExperience } from '../types';

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
  resume: Omit<Resume, 'id' | 'created_at' | 'updated_at' | 'file_url' | 'file_name' | 'views' | 'last_response_status'>
) {
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      ...resume,
      file_url: null,
      file_name: null,
      views: 0,
      last_response_status: null,
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

export async function uploadResumeFile(userId: string, resumeId: number): Promise<{ url: string | null; fileName: string | null }> {
  try {
    console.log('--- START UPLOAD ---');

    // 🔐 Проверка юзера
    const { data: userData } = await supabase.auth.getUser();
    console.log('Auth user:', userData?.user?.id);

    if (!userData?.user) {
      throw new Error('User not authenticated');
    }

    // 📂 Выбор файла
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      console.log('File picking canceled');
      return { url: null, fileName: null };
    }

    const file = result.assets[0];
    const originalFileName = file.name;
    const fileExt = originalFileName.split('.').pop();
    const storageFileName = `${resumeId}.${fileExt}`;
    const storagePath = `${userId}/${storageFileName}`;
    const fileUri = file.uri;

    console.log('Original file name:', originalFileName);
    console.log('Storage path:', storagePath);
    console.log('File uri:', fileUri);

    // 📦 Чтение файла
    const selectedFile = new File(fileUri);
    const fileBytes = await selectedFile.bytes();

    console.log('File bytes length:', fileBytes.length);

    // 🚀 Upload в Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(storagePath, fileBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      throw uploadError;
    }

    console.log('✅ Upload success:', uploadData);

    // 🔍 Проверка что файл реально есть
    const { data: listData, error: listError } = await supabase.storage
      .from('resumes')
      .list(userId);

    if (listError) {
      console.error('❌ List error:', listError);
      throw listError;
    }

    console.log('📂 Files in bucket:', listData);

    const fileExists = listData?.some(f => f.name === storageFileName);
    console.log('📌 File exists after upload:', fileExists);

    // 🔗 Получаем подписанный URL
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

    if (signedUrlError) {
      console.error('❌ Signed URL error:', signedUrlError);
      throw signedUrlError;
    }

    console.log('🔗 Signed URL:', signedUrlData?.signedUrl);

    // 💾 Обновляем запись в БД (file_url и file_name)
    const { error: updateError } = await supabase
      .from('resumes')
      .update({
        file_url: signedUrlData?.signedUrl,
        file_name: originalFileName,
      })
      .eq('id', resumeId);

    if (updateError) {
      console.error('❌ Database update error:', updateError);
      throw updateError;
    }

    console.log('✅ Database updated with file_url and file_name');
    console.log('--- END UPLOAD ---');

    return {
      url: signedUrlData?.signedUrl || null,
      fileName: originalFileName,
    };
  } catch (error) {
    console.error('💥 FULL ERROR:', error);
    throw error;
  }
}