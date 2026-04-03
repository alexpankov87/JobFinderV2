import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FileText, Plus, Trash2, Star } from 'lucide-react-native';
import { useResumes } from '../hooks/useResumes';
import { AppStyles, Colors } from '../styles/AppStyles';
import { ProfileStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<ProfileStackParamList>;

export default function MyResumesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { resumes, isLoading, removeResume, activateResume, refetch } = useResumes();

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      'Удаление резюме',
      `Вы уверены, что хотите удалить "${title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => removeResume(id),
        },
      ]
    );
  };

  const handleSetActive = (id: number) => {
    activateResume(id);
  };

  const renderResumeCard = ({ item }: { item: any }) => (
    <View style={AppStyles.jobCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FileText size={20} color={Colors.primary} />
            <Text style={AppStyles.jobTitle}>{item.title}</Text>
            {item.is_active && (
              <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                <Text style={{ color: Colors.white, fontSize: 10 }}>Активно</Text>
              </View>
            )}
          </View>
          <Text style={AppStyles.jobCompany}>{item.position}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {!item.is_active && (
            <TouchableOpacity onPress={() => handleSetActive(item.id)}>
              <Star size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('ResumeForm', { resumeId: item.id })}>
            <Text style={{ color: Colors.primary }}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.title)}>
            <Trash2 size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={AppStyles.title}>Мои резюме</Text>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          onPress={() => navigation.navigate('ResumeForm')}
        >
          <Plus size={20} color={Colors.primary} />
          <Text style={{ color: Colors.primary }}>Создать</Text>
        </TouchableOpacity>
      </View>

      {resumes.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <FileText size={48} color={Colors.secondary} />
          <Text style={{ textAlign: 'center', color: Colors.secondary, marginTop: 16 }}>
            У вас пока нет резюме
          </Text>
          <TouchableOpacity 
            style={[AppStyles.applyButton, { marginTop: 20 }]}
            onPress={() => navigation.navigate('ResumeForm')}
          >
            <Text style={AppStyles.applyButtonText}>Создать резюме</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResumeCard}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}