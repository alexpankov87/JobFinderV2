import { View, Text } from 'react-native';
import { getStatusConfig, ResponseStatus } from '../constants/statusConfig';
import { AppStyles } from '../styles/AppStyles';

interface Props {
  status: ResponseStatus;
}

export default function ResponseStatusBadge({ status }: Props) {
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <View style={[AppStyles.statusBadge, { backgroundColor: config.bgColor, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
      <StatusIcon size={12} color={config.color} />
      <Text style={[AppStyles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}