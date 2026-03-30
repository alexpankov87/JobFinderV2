import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Job } from '../data/mockJobs';
import { StackScreenProps } from '@react-navigation/stack';

// Определяем типы для параметров навигации
type RootStackParamList = {
  HomeList: undefined;
  JobDetail: { job: Job };
};

// Типизируем пропсы экрана
type JobDetailScreenProps = StackScreenProps<RootStackParamList, 'JobDetail'>;

export default function JobDetailScreen({ route, navigation }: JobDetailScreenProps) {
  // Получаем вакансию из параметров навигации
  const { job } = route.params;

  // Форматируем зарплату (если есть)
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.currency || 'USD'}`;
    }
    if (job.salary_min) {
      return `от ${job.salary_min.toLocaleString()} ${job.currency || 'USD'}`;
    }
    if (job.salary_max) {
      return `до ${job.salary_max.toLocaleString()} ${job.currency || 'USD'}`;
    }
    return 'Не указана';
  };

  // Обработка нажатия на кнопку "Откликнуться"
  const handleApply = () => {
    // Пока просто покажем уведомление, позже сделаем форму отклика
    alert(`Отклик на вакансию "${job.title}" будет отправлен`);
  };

  return (
    <ScrollView style={AppStyles.detailContainer}>
      <Text style={AppStyles.detailTitle}>{job.title}</Text>
      <Text style={AppStyles.detailCompany}>{job.company}</Text>
      <Text style={AppStyles.detailLocation}>
        📍 {job.location}, {job.country}
      </Text>
      
      <View style={AppStyles.detailSalary}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary }}>
          💰 Зарплата: {formatSalary()}
        </Text>
      </View>

      <Text style={AppStyles.sectionTitle}>Описание</Text>
      <Text style={AppStyles.detailDescription}>
        {job.description || 'Описание отсутствует. Пожалуйста, посетите оригинальную страницу вакансии для получения полной информации.'}
      </Text>

      {job.requirements && job.requirements.length > 0 && (
        <>
          <Text style={AppStyles.sectionTitle}>Требования</Text>
          {job.requirements.map((req, index) => (
            <Text key={index} style={AppStyles.detailRequirements}>
              • {req}
            </Text>
          ))}
        </>
      )}

      <TouchableOpacity style={AppStyles.applyButton} onPress={handleApply}>
        <Text style={AppStyles.applyButtonText}>📩 Откликнуться</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}