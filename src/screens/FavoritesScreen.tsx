import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Star, MapPin, DollarSign, Heart, Trash2 } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Job } from '../types';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, loading, removeFromFavorites, refetch } = useFavorites();

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobDetail', { job });
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity onPress={() => handleJobPress(item)} activeOpacity={0.7}>
      <View style={AppStyles.jobCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={AppStyles.jobTitle}>{item.title}</Text>
            <Text style={AppStyles.jobCompany}>{item.company}</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <MapPin size={12} color={Colors.secondary} />
              <Text style={[AppStyles.jobCountry, { marginLeft: 4 }]}>
                {item.location}, {item.country}
              </Text>
            </View>
            
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
          
          <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
            <Trash2 size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 20, color: Colors.secondary }}>Загрузка избранного...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={AppStyles.emptyContainer}>
        <Heart size={48} color={Colors.secondary} />
        <Text style={AppStyles.emptyText}>Нет избранных вакансий</Text>
        <Text style={[AppStyles.emptyText, { fontSize: 14, marginTop: 8 }]}>
          Добавляйте вакансии в избранное, чтобы не потерять
        </Text>
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <View style={AppStyles.header}>
        <Star size={28} color={Colors.primary} />
        <Text style={AppStyles.logoText}>Избранное</Text>
      </View>
      
      <Text style={AppStyles.counter}>
        Сохранено {favorites.length} вакансий
      </Text>
      
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={loading}
      />
    </View>
  );
}