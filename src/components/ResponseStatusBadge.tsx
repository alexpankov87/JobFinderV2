import { View, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

type Status = 'pending' | 'viewed' | 'accepted' | 'rejected';

const statusConfig = {
  pending: { label: 'На рассмотрении', style: AppStyles.statusPending, textStyle: AppStyles.statusTextPending },
  viewed: { label: 'Просмотрено', style: AppStyles.statusViewed, textStyle: AppStyles.statusTextViewed },
  accepted: { label: 'Приглашение', style: AppStyles.statusAccepted, textStyle: AppStyles.statusTextAccepted },
  rejected: { label: 'Отказ', style: AppStyles.statusRejected, textStyle: AppStyles.statusTextRejected },
};

export default function ResponseStatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  
  return (
    <View style={[AppStyles.statusBadge, config.style]}>
      <Text style={[AppStyles.statusText, config.textStyle]}>{config.label}</Text>
    </View>
  );
}