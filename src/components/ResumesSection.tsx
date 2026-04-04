import { View, Text, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { Resume } from '../types';
import ResumeListItem from './ResumeListItem';

interface ResumesSectionProps {
  resumes: Resume[];
  onAdd: () => void;
  onManage: () => void;
  onEdit: (resumeId: number) => void;
}

export default function ResumesSection({ resumes, onAdd, onManage, onEdit }: ResumesSectionProps) {
  return (
    <View style={[AppStyles.jobCard, { marginTop: 12, padding: 12 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={[AppStyles.jobTitle, { fontSize: 14 }]}>Мои резюме</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={onAdd}>
          <Plus size={14} color={Colors.primary} />
          <Text style={{ color: Colors.primary, fontSize: 10 }}>Добавить</Text>
        </TouchableOpacity>
      </View>

      {resumes.length === 0 ? (
        <TouchableOpacity style={[AppStyles.applyButton, { backgroundColor: Colors.lightGray, paddingVertical: 8 }]} onPress={onAdd}>
          <Text style={{ color: Colors.primary, fontSize: 12 }}>+ Создать резюме</Text>
        </TouchableOpacity>
      ) : (
        <>
          {resumes.map((resume) => (
            <ResumeListItem key={resume.id} resume={resume} onPress={() => onEdit(resume.id)} />
          ))}
          <TouchableOpacity style={[AppStyles.applyButton, { backgroundColor: Colors.lightGray, marginTop: 8, paddingVertical: 8 }]} onPress={onManage}>
            <Text style={{ color: Colors.primary, fontSize: 12 }}>Управление резюме →</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}