import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { AppStyles, Colors } from '../styles/AppStyles';
import { RootStackParamList } from '../types/navigation';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';

type JobDetailScreenProps = StackScreenProps<RootStackParamList, 'JobDetail'>;

export default function JobDetailScreen({ route }: JobDetailScreenProps) {
  const { job } = route.params;
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Проверяем, откликался ли пользователь на эту вакансию
  useEffect(() => {
    const checkIfApplied = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('responses')
        .select('id')
        .eq('job_id', job.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setHasApplied(true);
      }
      setLoading(false);
    };

    checkIfApplied();
  }, [job.id, user]);

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
            {job.requirements.map((req: string, index: number) => (
              <Text key={index} style={AppStyles.detailRequirements}>
                • {req}
              </Text>
            ))}
          </>
        )}

        <TouchableOpacity
          style={[AppStyles.applyButton, hasApplied && { backgroundColor: Colors.gray }]}
          onPress={handleApply}
          disabled={hasApplied || loading}
        >
          <Text style={AppStyles.applyButtonText}>
            {loading ? 'Проверка...' : hasApplied ? '✓ Вы уже откликнулись' : '📩 Откликнуться'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ApplyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        job={job}
        onSuccess={() => {
          setModalVisible(false);
          setHasApplied(true);
        }}
      />
    </>
  );
}