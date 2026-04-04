import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useResumes } from '../hooks/useResumes';
import { useResponses } from '../hooks/useResponses';
import { AppStyles, Colors } from '../styles/AppStyles';
import { ProfileStackParamList } from '../types/navigation';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import ActiveResumeCard from '../components/ActiveResumeCard';
import StatsCard from '../components/StatsCard';
import ResumesSection from '../components/ResumesSection';
import ResponseStatusList from '../components/ResponseStatusList';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { resumes, isLoading: resumesLoading, refetch: refetchResumes } = useResumes();
  const { responses, refetch: refetchResponses } = useResponses();

  useFocusEffect(
    useCallback(() => {
      refetchResumes();
      refetchResponses();
    }, [refetchResumes, refetchResponses])
  );

  const activeResume = resumes.find(r => r.is_active);
  const totalResponses = responses.length;
  const acceptedResponses = responses.filter(r => r.status === 'accepted').length;
  const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);
  const pendingResponses = responses.filter(r => r.status === 'pending').length;
  const viewedResponses = responses.filter(r => r.status === 'viewed').length;
  const rejectedResponses = responses.filter(r => r.status === 'rejected').length;

  const handleSignOut = async () => {
    await signOut();
  };

  if (profileLoading || resumesLoading) {
    return (
      <View style={[AppStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={AppStyles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={true}
    >
      <ProfileHeader onSignOut={handleSignOut} />

      <ProfileInfo profile={profile ?? null} email={user?.email} onEdit={() => navigation.navigate('EditProfile')} />

      {activeResume && <ActiveResumeCard resume={activeResume} />}

      <StatsCard totalResponses={totalResponses} acceptedResponses={acceptedResponses} totalViews={totalViews} />

      <ResumesSection
        resumes={resumes}
        onAdd={() => navigation.navigate('MyResumes')}
        onManage={() => navigation.navigate('MyResumes')}
        onEdit={(id) => navigation.navigate('ResumeForm', { resumeId: id })}
      />

      <View style={[AppStyles.jobCard, { marginTop: 8, padding: 8, marginBottom: 20 }]}>
        <Text style={[AppStyles.jobTitle, { fontSize: 12, marginBottom: 8 }]}>Статусы откликов</Text>
        <ResponseStatusList 
          pending={pendingResponses} 
          viewed={viewedResponses} 
          accepted={acceptedResponses} 
          rejected={rejectedResponses} 
        />
      </View>
    </ScrollView>
  );
}