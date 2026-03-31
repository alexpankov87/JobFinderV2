import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Job } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeStack';
import { useState } from 'react';
import ApplyModal from '../components/ApplyModal';

type JobDetailScreenProps = StackScreenProps<HomeStackParamList, 'JobDetail'>;

export default function JobDetailScreen({ route }: JobDetailScreenProps) {
  const { job } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.currency}`;
    }
    if (job.salary_min) {
      return `от ${job.salary_min.toLocaleString()} ${job.currency}`;
    }
    if (job.salary_max) {
      return `до ${job.salary_max.toLocaleString()} ${job.currency}`;
    }
    return 'Не указана';
  };

  const handleApply = () => {
    setModalVisible(true);
  };

  return (
    <>
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
          {job.description || 'Описание отсутствует.'}
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

      <ApplyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        job={job}
        onSuccess={() => setModalVisible(false)}
      />
    </>
  );
}