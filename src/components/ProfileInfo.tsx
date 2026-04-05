import { View, Text, TouchableOpacity } from 'react-native';
import { Edit } from 'lucide-react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Profile } from '../types';

interface ProfileInfoProps {
  profile: Profile | null;
  email: string | undefined;
  onEdit: () => void;
}

export default function ProfileInfo({ profile, email, onEdit }: ProfileInfoProps) {
  return (
    <View style={[AppStyles.jobCard, { marginTop: 16, padding: 12 }]}>
      <Text style={[AppStyles.jobTitle, { fontSize: 14, marginBottom: 12 }]}>Личная информация</Text>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Text style={{ color: Colors.secondary, width: 70, fontSize: 12 }}>Email:</Text>
        <Text style={{ fontSize: 12 }}>{email}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Text style={{ color: Colors.secondary, width: 70, fontSize: 12 }}>Имя:</Text>
        <Text style={{ fontSize: 12 }}>{profile?.full_name || 'Не указано'}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Text style={{ color: Colors.secondary, width: 70, fontSize: 12 }}>Телефон:</Text>
        <Text style={{ fontSize: 12 }}>{profile?.phone || 'Не указан'}</Text>
      </View>
      <TouchableOpacity style={[AppStyles.applyButton, { marginTop: 8, paddingVertical: 8, width: 130 }]} onPress={onEdit}>
        <Edit size={14} color={Colors.white} />
        <Text style={[AppStyles.applyButtonText, { fontSize: 12 }]}>Редактировать</Text>
      </TouchableOpacity>
    </View>
  );
}