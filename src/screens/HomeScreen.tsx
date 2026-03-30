import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { AppStyles } from '../styles/AppStyles';
import { mockJobs, Job } from '../data/mockJobs';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeStack';

// Типизируем пропсы экрана с навигацией
type HomeScreenProps = StackScreenProps<HomeStackParamList, 'HomeList'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  const handleJobPress = (job: Job) => {
    // Переход на детальный экран с передачей данных вакансии
    navigation.navigate('JobDetail', { job });
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity onPress={() => handleJobPress(item)}>
      <View style={AppStyles.jobCard}>
        <Text style={AppStyles.jobTitle}>{item.title}</Text>
        <Text style={AppStyles.jobCompany}>{item.company}</Text>
        <Text style={AppStyles.jobCountry}>
          {item.location}, {item.country}
        </Text>
        {item.salary_min && (
          <Text style={{ fontSize: 12, color: '#0077cc', marginTop: 8 }}>
            💰 {item.salary_min.toLocaleString()} {item.currency || 'USD'} 
            {item.salary_max ? ` - ${item.salary_max.toLocaleString()} ${item.currency || 'USD'}` : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Вакансии за рубежом</Text>
      
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}