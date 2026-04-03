import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MapPin, DollarSign, FileText, CheckCircle } from 'lucide-react-native';
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
        
        {/* Локация — выровнено по центру с иконкой */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <MapPin size={16} color={Colors.secondary} style={{ marginRight: 6 }} />
          <Text style={AppStyles.detailLocation}>{job.location}, {job.country}</Text>
        </View>
        
        {/* Зарплата — выровнено по центру с иконкой */}
        <View style={AppStyles.detailSalary}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DollarSign size={18} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary }}>
              Зарплата: {formatSalary()}
            </Text>
          </View>
        </View>

        {/* Описание */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
          <FileText size={20} color={Colors.darkGray} style={{ marginRight: 8 }} />
          <Text style={AppStyles.sectionTitle}>Описание</Text>
        </View>
        <Text style={AppStyles.detailDescription}>
          {job.description || 'Описание отсутствует.'}
        </Text>

        {/* Требования — без иконок, просто текст */}
        {job.requirements && job.requirements.length > 0 && (
          <>
            <Text style={[AppStyles.sectionTitle, { marginTop: 16, marginBottom: 12 }]}>
              Требования
            </Text>
            {job.requirements.map((req: string, index: number) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text style={{ color: Colors.primary, marginRight: 8 }}>•</Text>
                <Text style={AppStyles.detailRequirements}>{req}</Text>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity
          style={[AppStyles.applyButton, hasApplied && { backgroundColor: Colors.gray }]}
          onPress={handleApply}
          disabled={hasApplied || loading}
        >
          {hasApplied ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} color={Colors.white} style={{ marginRight: 8 }} />
              <Text style={AppStyles.applyButtonText}>Вы уже откликнулись</Text>
            </View>
          ) : (
            <Text style={AppStyles.applyButtonText}>📩 Откликнуться</Text>
          )}
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