import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryProvider } from './src/providers/QueryProvider';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import MainTabs from './src/navigation/MainTabs';
import JobDetailScreen from './src/screens/JobDetailScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="JobDetail" 
            component={JobDetailScreen} 
            options={{ 
              headerShown: true,
              title: 'Детали вакансии',
              headerStyle: { backgroundColor: '#0077cc' },
              headerTintColor: '#fff',
              headerBackTitle: 'Назад',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </FavoritesProvider>
      </AuthProvider>
    </QueryProvider>
  );
}