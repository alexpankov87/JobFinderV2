import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Upload, Save } from 'lucide-react-native';
import { useResumes } from '../hooks/useResumes';
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
  
  const { resumes, addResume, editResume, uploadFile, isAdding, isEditing, isUploading } = useResumes();
  const resume = resumeId ? resumes.find(r => r.id === resumeId) : null;

  const [title, setTitle] = useState('');
  const [position, setPosition] = useState('');
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [isActive, setIsActive] = useState(false);

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

  // Преобразует язык из строки "Английский (B2)" в объект LanguageItem
  const parseLanguageString = (langStr: string, index: number): LanguageItem => {
    const match = langStr.match(/^(.*?)\s*\((.+)\)$/);
    if (match) {
      return { id: Date.now().toString() + index, name: match[1], level: match[2] };
    }
    // Если нет уровня в скобках, оставляем level пустым
    return { id: Date.now().toString() + index, name: langStr, level: '' };
  };

  useEffect(() => {
    if (resume) {
      setTitle(resume.title || '');
      setPosition(resume.position || '');
      setWorkExperiences(resume.work_experiences || []);
      setEducation(resume.education || '');
      setSkills(resume.skills?.join(', ') || '');
      
      if (resume.languages && Array.isArray(resume.languages) && resume.languages.length > 0) {
        // Фильтруем некорректные записи (например, "B1" без названия языка)
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

    // Преобразуем языки в формат для БД: "Английский (B2)"
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
    };

    if (resumeId) {
      await editResume({ id: resumeId, updates: resumeData });
      Alert.alert('Успешно', 'Резюме обновлено');
    } else {
      await addResume(resumeData);
      Alert.alert('Успешно', 'Резюме создано');
    }
    navigation.goBack();
  };

  const handleUploadFile = async () => {
    if (!resumeId) {
      Alert.alert('Ошибка', 'Сначала сохраните резюме');
      return;
    }
    await uploadFile({ resumeId });
    Alert.alert('Успешно', 'Файл загружен');
  };

  const isLoading = isAdding || isEditing || isUploading;

  return (
    <ScrollView style={AppStyles.container}>
      <Text style={AppStyles.title}>{resumeId ? 'Редактирование резюме' : 'Новое резюме'}</Text>

      <Text style={AppStyles.label}>Название резюме *</Text>
      <TextInput 
        style={AppStyles.input} 
        placeholder="Например: React Developer" 
        value={title} 
        onChangeText={setTitle} 
      />

      <Text style={AppStyles.label}>Желаемая должность *</Text>
      <TextInput 
        style={AppStyles.input} 
        placeholder="Frontend Developer" 
        value={position} 
        onChangeText={setPosition} 
      />

      <WorkExperienceForm experiences={workExperiences} onChange={setWorkExperiences} />

      <Text style={AppStyles.label}>Образование</Text>
      <TextInput 
        style={[AppStyles.input, { minHeight: 80, textAlignVertical: 'top' }]} 
        placeholder="Вуз, специальность, год окончания..." 
        multiline 
        value={education} 
        onChangeText={setEducation} 
      />

      <Text style={AppStyles.label}>Навыки (через запятую)</Text>
      <TextInput 
        style={AppStyles.input} 
        placeholder="React, TypeScript, Node.js" 
        value={skills} 
        onChangeText={setSkills} 
      />

      <LanguageSelector selectedLanguages={languages} onChange={setLanguages} />

      <TouchableOpacity 
        onPress={() => setIsActive(!isActive)} 
        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}
      >
        <View style={{ 
          width: 22, 
          height: 22, 
          borderRadius: 4, 
          borderWidth: 2, 
          borderColor: Colors.primary, 
          backgroundColor: isActive ? Colors.primary : 'transparent', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginRight: 10 
        }}>
          {isActive && <Text style={{ color: Colors.white, fontSize: 14 }}>✓</Text>}
        </View>
        <Text style={{ color: Colors.darkGray, fontSize: 16 }}>Сделать активным</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 40 }}>
        <TouchableOpacity 
          style={[AppStyles.applyButton, { flex: 1, backgroundColor: Colors.secondary, flexDirection: 'row', gap: 8, justifyContent: 'center' }]} 
          onPress={handleUploadFile} 
          disabled={isLoading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Upload size={18} color={Colors.white} />
              <Text style={AppStyles.applyButtonText}>Загрузить PDF</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[AppStyles.applyButton, { flex: 1, flexDirection: 'row', gap: 8, justifyContent: 'center' }]} 
          onPress={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading && !isUploading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Save size={18} color={Colors.white} />
              <Text style={AppStyles.applyButtonText}>Сохранить</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}