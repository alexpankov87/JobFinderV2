import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { File } from 'lucide-react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Resume } from '../types';

interface ActiveResumeCardProps {
  resume: Resume;
}

export default function ActiveResumeCard({ resume }: ActiveResumeCardProps) {
  return (
    <View style={[AppStyles.jobCard, { marginTop: 12, backgroundColor: '#e6f0fa', padding: 12 }]}>
      <Text style={[AppStyles.jobTitle, { fontSize: 14, marginBottom: 6 }]}>✅ Активное резюме</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{resume.title}</Text>
      <Text style={{ color: Colors.secondary, fontSize: 12, marginBottom: 6 }}>{resume.position}</Text>
      {resume.file_url && (
        <TouchableOpacity onPress={() => Linking.openURL(resume.file_url!)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <File size={12} color={Colors.primary} />
          <Text style={{ color: Colors.primary, fontSize: 10 }}>{resume.file_name ? resume.file_name.substring(0, 30) : 'PDF загружен'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}