import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Upload, Save, File, Trash2, Check, X } from 'lucide-react-native';
import { useResumes } from '../hooks/useResumes';
import { useAuth } from '../context/AuthContext';
import { AppStyles, Colors } from '../styles/AppStyles';
import WorkExperienceForm from '../components/WorkExperienceForm';
import LanguageSelector from '../components/LanguageSelector';
import { WorkExperience, LanguageItem } from '../types';

type RouteParams = {
  resumeId?: number;
};

export default function ResumeFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const resumeId = params?.resumeId;
  
  const { user } = useAuth();
  const { resumes, addResume, editResume, uploadFile, isAdding, isEditing, isUploading } = useResumes();
  const resume = resumeId ? resumes.find(r => r.id === resumeId) : null;

  const [title, setTitle] = useState('');
  const [position, setPosition] = useState('');
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [existingFileName, setExistingFileName] = useState<string | null>(null);

  const getLevelLabel = (level: string): string => {
    const levels: Record<string, string> = {
      native: 'Родной',
      fluent: 'Свободно',
      advanced: 'C1',
      upper_intermediate: 'B2',
      intermediate: 'B1',
      elementary: 'A2',
      beginner: 'A1',
    };
    return levels[level] || level;
  };

  const parseLanguageString = (langStr: string, index: number): LanguageItem => {
    const match = langStr.match(/^(.*?)\s*\((.+)\)$/);
    if (match) {
      return { id: Date.now().toString() + index, name: match[1], level: match[2] };
    }
    return { id: Date.now().toString() + index, name: langStr, level: '' };
  };

  useEffect(() => {
    if (resume) {
      setTitle(resume.title || '');
      setPosition(resume.position || '');
      setWorkExperiences(resume.work_experiences || []);
      setEducation(resume.education || '');
      setSkills(resume.skills?.join(', ') || '');
      setExistingFileUrl(resume.file_url || null);
      setExistingFileName(resume.file_name || null);
      
      if (resume.languages && Array.isArray(resume.languages) && resume.languages.length > 0) {
        const validLanguages = resume.languages.filter((lang: string) => {
          const isLevelOnly = /^[A-C][1-2]$/i.test(lang.trim());
          return !isLevelOnly && lang.trim().length > 0;
        });
        const parsedLanguages = validLanguages.map((lang: string, idx: number) => parseLanguageString(lang, idx));
        setLanguages(parsedLanguages);
      } else {
        setLanguages([]);
      }
      
      setIsActive(resume.is_active || false);
    }
  }, [resume]);

  const handleSubmit = async () => {
    if (!title.trim() || !position.trim()) {
      Alert.alert('Ошибка', 'Заполните название и должность');
      return;
    }

    const languagesForDB = languages.map(lang => {
      if (lang.level) {
        return `${lang.name} (${getLevelLabel(lang.level)})`;
      }
      return lang.name;
    });

    const resumeData = {
      title: title.trim(),
      position: position.trim(),
      work_experiences: workExperiences,
      education: education.trim() || null,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      languages: languagesForDB,
      is_active: isActive,
      experience: null,
      // views и last_response_status не передаём — они имеют DEFAULT в БД
    };
    try {
      if (resumeId) {
        await editResume({ id: resumeId, updates: resumeData });
        Alert.alert('Успешно', 'Резюме обновлено');
        navigation.goBack();
      } else {
        const newResume = await addResume(resumeData);
        if (newResume?.id) {
          Alert.alert('Успешно', 'Резюме создано');
          navigation.goBack();
        }
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить резюме');
    }
  };

  const handleUploadFile = async () => {
    if (!user) {
      Alert.alert('Ошибка', 'Вы не авторизованы');
      return;
    }
    
    if (!resumeId) {
      Alert.alert('Ошибка', 'Сначала сохраните резюме');
      return;
    }
    
    try {
      const result = await uploadFile({ resumeId });
      if (result?.url) {
        setExistingFileUrl(result.url);
        setExistingFileName(result.fileName);
        Alert.alert('Успешно', 'Файл загружен');
      } else {
        Alert.alert('Ошибка', 'Файл не был выбран или произошла ошибка');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Ошибка', error?.message || 'Не удалось загрузить файл');
    }
  };

  const handleDeleteFile = async () => {
    Alert.alert('Удалить файл', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await editResume({ id: resumeId!, updates: { file_url: null, file_name: null } });
          setExistingFileUrl(null);
          setExistingFileName(null);
          Alert.alert('Успешно', 'Файл удалён');
        }
      }
    ]);
  };

  const isLoading = isAdding || isEditing || isUploading;

  return (
    <ScrollView style={AppStyles.container}>
      <Text style={AppStyles.title}>{resumeId ? 'Редактирование резюме' : 'Новое резюме'}</Text>

      <Text style={AppStyles.label}>Название резюме *</Text>
      <TextInput style={AppStyles.input} placeholder="Например: React Developer" value={title} onChangeText={setTitle} />

      <Text style={AppStyles.label}>Желаемая должность *</Text>
      <TextInput style={AppStyles.input} placeholder="Frontend Developer" value={position} onChangeText={setPosition} />

      <WorkExperienceForm experiences={workExperiences} onChange={setWorkExperiences} />

      <Text style={AppStyles.label}>Образование</Text>
      <TextInput style={[AppStyles.input, { minHeight: 80, textAlignVertical: 'top' }]} placeholder="Вуз, специальность, год окончания..." multiline value={education} onChangeText={setEducation} />

      <Text style={AppStyles.label}>Навыки (через запятую)</Text>
      <TextInput style={AppStyles.input} placeholder="React, TypeScript, Node.js" value={skills} onChangeText={setSkills} />

      <LanguageSelector selectedLanguages={languages} onChange={setLanguages} />

      {existingFileUrl && (
        <View style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <File size={16} color={Colors.primary} />
            <Text style={{ color: Colors.primary }}>PDF загружен</Text>
            <Text style={{ fontSize: 12, color: Colors.secondary }}>{existingFileName || 'document.pdf'}</Text>
          </View>
          <TouchableOpacity onPress={handleDeleteFile} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Trash2 size={16} color={Colors.gray} />
            <Text style={{ color: Colors.gray }}>Удалить PDF</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={() => setIsActive(!isActive)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
        <View style={{ width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: Colors.primary, backgroundColor: isActive ? Colors.primary : 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
          {isActive && <Check size={14} color={Colors.white} />}
        </View>
        <Text style={{ color: Colors.darkGray, fontSize: 16 }}>Сделать активным</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 40 }}>
        <TouchableOpacity style={[AppStyles.applyButton, { flex: 1, backgroundColor: Colors.secondary, flexDirection: 'row', gap: 8, justifyContent: 'center' }]} onPress={handleUploadFile} disabled={isLoading}>
          {isUploading ? <ActivityIndicator size="small" color={Colors.white} /> : <><Upload size={18} color={Colors.white} /><Text style={AppStyles.applyButtonText}>Загрузить PDF</Text></>}
        </TouchableOpacity>

        <TouchableOpacity style={[AppStyles.applyButton, { flex: 1, flexDirection: 'row', gap: 8, justifyContent: 'center' }]} onPress={handleSubmit} disabled={isLoading}>
          {isLoading && !isUploading ? <ActivityIndicator color={Colors.white} /> : <><Save size={18} color={Colors.white} /><Text style={AppStyles.applyButtonText}>Сохранить</Text></>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}