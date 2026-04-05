import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, File, Eye } from 'lucide-react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Resume } from '../types';

interface ResumeListItemProps {
  resume: Resume;
  onPress: () => void;
}

export default function ResumeListItem({ resume, onPress }: ResumeListItemProps) {
  return (
    <TouchableOpacity
      style={[
        AppStyles.responseCard,
        { marginBottom: 6, padding: 10, backgroundColor: resume.is_active ? '#e6f0fa' : Colors.white }
      ]}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <FileText size={18} color={Colors.primary} />
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{resume.title}</Text>
            {resume.is_active && (
              <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 6 }}>
                <Text style={{ color: Colors.white, fontSize: 12 }}>Активно</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 11, color: Colors.secondary }}>{resume.position}</Text>
          {resume.file_url && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <File size={12} color={Colors.secondary} />
              <Text style={{ fontSize: 12, color: Colors.secondary }}>PDF</Text>
            </View>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Eye size={12} color={Colors.secondary} />
            <Text style={{ fontSize: 12, color: Colors.secondary }}>{resume.views || 0}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}