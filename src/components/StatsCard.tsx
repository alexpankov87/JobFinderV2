import { View, Text } from 'react-native';
import { AppStyles, Colors } from '../styles/AppStyles';

interface StatsCardProps {
  totalResponses: number;
  acceptedResponses: number;
  totalViews: number;
}

export default function StatsCard({ totalResponses, acceptedResponses, totalViews }: StatsCardProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
      <View style={[AppStyles.jobCard, { flex: 1, alignItems: 'center', padding: 8 }]}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary }}>{totalResponses}</Text>
        <Text style={{ fontSize: 10, color: Colors.secondary }}>Откликов</Text>
      </View>
      <View style={[AppStyles.jobCard, { flex: 1, alignItems: 'center', padding: 8 }]}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary }}>{acceptedResponses}</Text>
        <Text style={{ fontSize: 10, color: Colors.secondary }}>Приглашений</Text>
      </View>
      <View style={[AppStyles.jobCard, { flex: 1, alignItems: 'center', padding: 8 }]}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary }}>{totalViews}</Text>
        <Text style={{ fontSize: 10, color: Colors.secondary }}>Просмотров</Text>
      </View>
    </View>
  );
}