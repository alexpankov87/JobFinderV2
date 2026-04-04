import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, LogOut } from 'lucide-react-native';
import { AppStyles, Colors } from '../styles/AppStyles';

interface ProfileHeaderProps {
  onSignOut: () => void;
}

export default function ProfileHeader({ onSignOut }: ProfileHeaderProps) {
  return (
    <View style={AppStyles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <FileText size={24} color={Colors.primary} />
        <Text style={[AppStyles.logoText, { fontSize: 20 }]}>Профиль</Text>
      </View>
      <TouchableOpacity onPress={onSignOut} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <LogOut size={16} color={Colors.gray} />
        <Text style={{ color: Colors.gray, fontSize: 12 }}>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}