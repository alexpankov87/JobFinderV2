import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { AppStyles, Colors } from '../styles/AppStyles';
import { User, Edit, LogOut, Mail, Phone, MessageCircle, Send } from 'lucide-react-native';

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

  const getContactIcon = (contact: string | null) => {
    switch (contact) {
      case 'email': return <Mail size={16} color={Colors.primary} />;
      case 'whatsapp': return <MessageCircle size={16} color={Colors.primary} />;
      case 'telegram': return <Send size={16} color={Colors.primary} />;
      default: return null;
    }
  };

  const getContactLabel = (contact: string | null) => {
    switch (contact) {
      case 'email': return 'Email';
      case 'whatsapp': return 'WhatsApp';
      case 'telegram': return 'Telegram';
      default: return 'Не выбран';
    }
  };

  if (isLoading) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 20, color: Colors.secondary }}>Загрузка профиля...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={AppStyles.container}>
      <View style={AppStyles.header}>
        <User size={32} color={Colors.primary} />
        <Text style={AppStyles.logoText}>Профиль</Text>
      </View>

      <View style={[AppStyles.jobCard, { marginTop: 20 }]}>
        <Text style={[AppStyles.jobTitle, { marginBottom: 16 }]}>Личная информация</Text>
        
        {/* Email */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 }}>
          <Mail size={18} color={Colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.secondary, marginBottom: 2 }}>Email</Text>
            <Text style={{ fontSize: 16 }}>{user?.email}</Text>
          </View>
        </View>

        {/* Имя */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 }}>
          <User size={18} color={Colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.secondary, marginBottom: 2 }}>Имя</Text>
            <Text style={{ fontSize: 16 }}>{profile?.full_name || 'Не указано'}</Text>
          </View>
        </View>

        {/* Телефон */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 }}>
          <Phone size={18} color={Colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.secondary, marginBottom: 2 }}>Телефон</Text>
            <Text style={{ fontSize: 16 }}>{profile?.phone || 'Не указан'}</Text>
          </View>
        </View>

        {/* Способ связи */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 }}>
          {getContactIcon(profile?.preferred_contact || null)}
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.secondary, marginBottom: 2 }}>Предпочтительный способ связи</Text>
            <Text style={{ fontSize: 16 }}>{getContactLabel(profile?.preferred_contact || null)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[AppStyles.applyButton, { marginTop: 8, flexDirection: 'row', gap: 8, justifyContent: 'center' }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Edit size={16} color={Colors.white} />
          <Text style={AppStyles.applyButtonText}>Редактировать профиль</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[AppStyles.applyButton, { backgroundColor: Colors.gray, marginTop: 20, flexDirection: 'row', gap: 8, justifyContent: 'center' }]}
        onPress={handleSignOut}
      >
        <LogOut size={20} color={Colors.white} />
        <Text style={AppStyles.applyButtonText}>Выйти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}