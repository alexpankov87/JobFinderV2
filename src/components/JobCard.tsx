import { View, Text, TouchableOpacity } from 'react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Job } from '../types';

type JobCardProps = {
  job: Job;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
};

export default function JobCard({ job, onPress, onFavoritePress, isFavorite }: JobCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={AppStyles.jobCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={AppStyles.jobTitle}>{job.title}</Text>
            <Text style={AppStyles.jobCompany}>{job.company}</Text>
            <Text style={AppStyles.jobCountry}>
              📍 {job.location}, {job.country}
            </Text>
            {job.salary_min && (
              <Text style={{ fontSize: 12, color: Colors.primary, marginTop: 8 }}>
                💰 {job.salary_min.toLocaleString()} {job.currency}
                {job.salary_max ? ` - ${job.salary_max.toLocaleString()} ${job.currency}` : ''}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onFavoritePress}>
            <Text style={{ fontSize: 24, color: isFavorite ? '#FFD700' : '#ccc' }}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}