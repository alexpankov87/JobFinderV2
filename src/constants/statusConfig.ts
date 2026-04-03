import { Clock, Eye, CheckCircle, XCircle, LucideIcon } from 'lucide-react-native';

export type ResponseStatus = 'pending' | 'viewed' | 'accepted' | 'rejected';

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const STATUS_CONFIG: Record<ResponseStatus, StatusConfig> = {
  pending: {
    label: 'На рассмотрении',
    icon: Clock,
    color: '#d97706',
    bgColor: '#fef3c7',
  },
  viewed: {
    label: 'Просмотрено',
    icon: Eye,
    color: '#2563eb',
    bgColor: '#dbeafe',
  },
  accepted: {
    label: 'Приглашение',
    icon: CheckCircle,
    color: '#059669',
    bgColor: '#d1fae5',
  },
  rejected: {
    label: 'Отказ',
    icon: XCircle,
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
};

export const getStatusConfig = (status: ResponseStatus): StatusConfig => STATUS_CONFIG[status];