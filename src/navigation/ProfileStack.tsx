import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MyResumesScreen from '../screens/MyResumesScreen';
import ResumeFormScreen from '../screens/ResumeFormScreen';
import { ProfileStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0077cc' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Профиль', headerShown: false }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Редактирование' }}
      />
      <Stack.Screen 
        name="MyResumes" 
        component={MyResumesScreen} 
        options={{ title: 'Мои резюме' }}
      />
      <Stack.Screen 
        name="ResumeForm" 
        component={ResumeFormScreen} 
        options={{ title: 'Резюме' }}
      />
    </Stack.Navigator>
  );
}