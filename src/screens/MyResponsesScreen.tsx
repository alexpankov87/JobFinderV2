import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FileText, MapPin, Calendar, Mail, MessageSquare } from 'lucide-react-native';
import { useResponses } from '../hooks/useResponses';
import { AppStyles, Colors } from '../styles/AppStyles';
import { RootStackParamList } from '../types/navigation';
import { ResponseWithJob } from '../types';
import { getStatusConfig, ResponseStatus } from '../constants/statusConfig';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MyResponsesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { responses, isLoading, error, refetch } = useResponses();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleResponsePress = (response: ResponseWithJob) => {
    navigation.navigate('JobDetail', { job: response.jobs });
  };

  const renderResponseCard = ({ item }: { item: ResponseWithJob }) => {
    const statusConfig = getStatusConfig(item.status as ResponseStatus);
    const StatusIcon = statusConfig.icon;
    
    return (
      <TouchableOpacity onPress={() => handleResponsePress(item)} activeOpacity={0.7}>
        <View style={AppStyles.responseCard}>
          <Text style={AppStyles.responseTitle}>{item.jobs.title}</Text>
          <Text style={AppStyles.responseCompany}>{item.jobs.company}</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
            <MapPin size={12} color={Colors.secondary} />
            <Text style={AppStyles.responseMeta}>{item.jobs.location}, {item.jobs.country}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
            <Calendar size={12} color={Colors.secondary} />
            <Text style={AppStyles.responseMeta}>{formatDate(item.created_at)}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
            <Mail size={12} color={Colors.secondary} />
            <Text style={AppStyles.responseMeta}>{item.email}</Text>
          </View>
          
          {item.cover_letter && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
              <MessageSquare size={12} color={Colors.secondary} />
              <Text style={[AppStyles.responseMeta, { fontStyle: 'italic' }]}>
                "{item.cover_letter.substring(0, 80)}..."
              </Text>
            </View>
          )}
          
          <View style={[AppStyles.statusBadge, { backgroundColor: statusConfig.bgColor, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
            <StatusIcon size={12} color={statusConfig.color} />
            <Text style={[AppStyles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 20, color: Colors.secondary }}>Загрузка откликов...</Text>
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

  if (responses.length === 0) {
    return (
      <View style={AppStyles.emptyContainer}>
        <FileText size={48} color={Colors.secondary} />
        <Text style={AppStyles.emptyText}>У вас пока нет откликов</Text>
        <Text style={[AppStyles.emptyText, { fontSize: 14, marginTop: 8 }]}>
          Откликайтесь на вакансии, чтобы они появились здесь
        </Text>
      </View>
    );
  }

  return (
    <View style={AppStyles.container}>
      <View style={AppStyles.header}>
        <FileText size={32} color={Colors.primary} />
        <Text style={AppStyles.logoText}>Мои отклики</Text>
      </View>
      
      <Text style={AppStyles.counter}>
        Всего откликов: {responses.length}
      </Text>
      
      <FlatList
        data={responses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderResponseCard}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
}