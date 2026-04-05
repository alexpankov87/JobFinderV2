import { View, Text } from 'react-native';
import { Clock, Eye, CheckCircle, XCircle } from 'lucide-react-native';
import { Colors } from '../styles/AppStyles';

interface ResponseStatusListProps {
  pending: number;
  viewed: number;
  accepted: number;
  rejected: number;
}

export default function ResponseStatusList({ pending, viewed, accepted, rejected }: ResponseStatusListProps) {
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Clock size={16} color="#d97706" />
          <Text style={{ fontSize: 16 }}>На рассмотрении</Text>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{pending}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Eye size={16} color="#2563eb" />
          <Text style={{ fontSize: 16 }}>Просмотрено</Text>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 12}}>{viewed}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <CheckCircle size={16} color="#059669" />
          <Text style={{ fontSize: 16 }}>Приглашения</Text>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{accepted}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <XCircle size={16} color="#dc2626" />
          <Text style={{ fontSize: 16 }}>Отказы</Text>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{rejected}</Text>
      </View>
    </View>
  );
}