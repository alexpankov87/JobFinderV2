import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useResumes } from '../hooks/useResumes';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Upload, Save } from 'lucide-react-native';

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
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (resume) {
      setTitle(resume.title);
      setPosition(resume.position);
      setExperience(resume.experience || '');
      setEducation(resume.education || '');
      setSkills(resume.skills?.join(', ') || '');
      setLanguages(resume.languages?.join(', ') || '');
      setIsActive(resume.is_active);
    }
  }, [resume]);

  const handleSubmit = async () => {
    if (!title.trim() || !position.trim()) {
      Alert.alert('Ошибка', 'Заполните название и должность');
      return;
    }

    const resumeData = {
      title: title.trim(),
      position: position.trim(),
      experience: experience.trim() || null,
      education: education.trim() || null,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      languages: languages.split(',').map(l => l.trim()).filter(Boolean),
      is_active: isActive,
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

      <Text style={AppStyles.label}>Должность *</Text>
      <TextInput 
        style={AppStyles.input} 
        placeholder="Ваша текущая или желаемая должность" 
        value={position} 
        onChangeText={setPosition} 
      />

      <Text style={AppStyles.label}>Опыт работы</Text>
      <TextInput 
        style={[AppStyles.input, { minHeight: 80, textAlignVertical: 'top' }]} 
        placeholder="Компания, период, достижения..." 
        multiline 
        value={experience} 
        onChangeText={setExperience} 
      />

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
        placeholder="Технические и мягкие навыки" 
        value={skills} 
        onChangeText={setSkills} 
      />

      <Text style={AppStyles.label}>Языки (через запятую)</Text>
      <TextInput 
        style={AppStyles.input} 
        placeholder="Английский B2, Немецкий A1" 
        value={languages} 
        onChangeText={setLanguages} 
      />

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