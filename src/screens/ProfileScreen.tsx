import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { AppStyles, Colors } from '../styles/AppStyles';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { profile, isLoading, refetch } = useProfile();

  const handleSignOut = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 20, color: Colors.secondary }}>Загрузка профиля...</Text>
      </View>
    );
  }

  const getContactLabel = (contact: string | null) => {
    switch (contact) {
      case 'email': return '📧 Email';
      case 'whatsapp': return '💬 WhatsApp';
      case 'telegram': return '✈️ Telegram';
      default: return 'Не выбран';
    }
  };

  return (
    <ScrollView style={AppStyles.container}>
      <View style={AppStyles.header}>
        <Text style={AppStyles.logoIcon}>👤</Text>
        <Text style={AppStyles.logoText}>Профиль</Text>
      </View>

      <View style={[AppStyles.jobCard, { marginTop: 20 }]}>
        <Text style={[AppStyles.jobTitle, { marginBottom: 16 }]}>Личная информация</Text>
        
        <Text style={{ color: Colors.secondary, marginBottom: 4 }}>Email</Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>{user?.email}</Text>

        <Text style={{ color: Colors.secondary, marginBottom: 4 }}>Имя</Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>{profile?.full_name || 'Не указано'}</Text>

        <Text style={{ color: Colors.secondary, marginBottom: 4 }}>Телефон</Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>{profile?.phone || 'Не указан'}</Text>

        <Text style={{ color: Colors.secondary, marginBottom: 4 }}>Предпочтительный способ связи</Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>{getContactLabel(profile?.preferred_contact || null)}</Text>

        <TouchableOpacity
          style={[AppStyles.applyButton, { marginTop: 8 }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={AppStyles.applyButtonText}>✏️ Редактировать профиль</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[AppStyles.applyButton, { backgroundColor: Colors.gray, marginTop: 20 }]}
        onPress={handleSignOut}
      >
        <Text style={AppStyles.applyButtonText}>🚪 Выйти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}