import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Search, Star, MapPin, DollarSign } from 'lucide-react-native';
import { useJobs } from '../hooks/useJobs';
import { useFavorites } from '../context/FavoritesContext';
import { useFiltersStore } from '../store/filtersStore';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Job } from '../types';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { jobs, loading, error, refetch } = useJobs();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { hasActiveFilters, resetFilters } = useFiltersStore();

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobDetail', { job });
  };

  const handleFavoritePress = (job: Job, event: any) => {
    event.stopPropagation();
    if (isFavorite(job.id)) {
      removeFromFavorites(job.id);
    } else {
      addToFavorites(job);
    }
  };

  const handleResetFilters = () => {
    resetFilters();
    refetch();
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity onPress={() => handleJobPress(item)} activeOpacity={0.7}>
      <View style={AppStyles.jobCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={AppStyles.jobTitle}>{item.title}</Text>
            <Text style={AppStyles.jobCompany}>{item.company}</Text>
            
            {/* Локация с иконкой */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <MapPin size={12} color={Colors.secondary} />
              <Text style={[AppStyles.jobCountry, { marginLeft: 4 }]}>
                {item.location}, {item.country}
              </Text>
            </View>
            
            {/* Зарплата с иконкой */}
            {item.salary_min && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <DollarSign size={12} color={Colors.primary} />
                <Text style={{ fontSize: 12, color: Colors.primary, marginLeft: 4 }}>
                  {item.salary_min.toLocaleString()} {item.currency}
                  {item.salary_max ? ` - ${item.salary_max.toLocaleString()} ${item.currency}` : ''}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={(e) => handleFavoritePress(item, e)}>
            <Star 
              size={24} 
              color={isFavorite(item.id) ? '#FFD700' : '#ccc'}
              fill={isFavorite(item.id) ? '#FFD700' : 'none'}
            />
          </TouchableOpacity>
        </View>
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
          onPress={() => refetch()} 
          style={{ backgroundColor: Colors.primary, padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: Colors.white, fontWeight: 'bold' }}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

 return (
    <View style={AppStyles.container}>
      {/* Строка поиска */}
      <TouchableOpacity 
        style={AppStyles.searchBar}
        onPress={() => navigation.navigate('Filter')}
      >
        <Search size={20} color={Colors.gray} />
        <Text style={{ color: Colors.gray, flex: 1, marginLeft: 8 }}>
          {hasActiveFilters() ? 'Фильтры активны...' : 'Поиск и фильтры'}
        </Text>
        {hasActiveFilters() && (
          <View style={AppStyles.activeFilterBadge}>
            <Text style={{ color: Colors.white, fontSize: 10, fontWeight: 'bold' }}>!</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Сброс фильтров */}
      {hasActiveFilters() && (
        <TouchableOpacity 
          onPress={handleResetFilters}
          style={{ alignSelf: 'flex-end', marginBottom: 8 }}
        >
          <Text style={{ color: Colors.primary, fontSize: 12 }}>Сбросить фильтры ✕</Text>
        </TouchableOpacity>
      )}
      
      {/* Счётчик с иконкой */}
      <View style={AppStyles.counterContainer}>
        <Search size={14} color={Colors.secondary} />
        <Text style={AppStyles.counterText}>
          Найдено {jobs.length} вакансий
        </Text>
      </View>
      
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        showsVerticalScrollIndicator={false}
        onRefresh={() => refetch()}
        refreshing={loading}
      />
    </View>
  );
}