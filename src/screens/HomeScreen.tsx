import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useJobs } from '../hooks/useJobs';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Job } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeStack';

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'HomeList'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { jobs, loading, error, refetch } = useJobs();

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobDetail', { job });
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity onPress={() => handleJobPress(item)} activeOpacity={0.7}>
      <View style={AppStyles.jobCard}>
        <Text style={AppStyles.jobTitle}>{item.title}</Text>
        <Text style={AppStyles.jobCompany}>{item.company}</Text>
        <Text style={AppStyles.jobCountry}>
          📍 {item.location}, {item.country}
        </Text>
        {item.salary_min && (
          <Text style={{ fontSize: 12, color: Colors.primary, marginTop: 8 }}>
            💰 {item.salary_min.toLocaleString()} {item.currency}
            {item.salary_max ? ` - ${item.salary_max.toLocaleString()} ${item.currency}` : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && jobs.length === 0) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 20, color: Colors.secondary }}>Загрузка вакансий...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity 
          onPress={refetch} 
          style={{ backgroundColor: Colors.primary, padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: Colors.white, fontWeight: 'bold' }}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Вакансии за рубежом</Text>
      
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={loading}
      />
    </View>
  );
}