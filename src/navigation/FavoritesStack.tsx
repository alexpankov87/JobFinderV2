import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from '../screens/FavoritesScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import { FavoritesStackParamList } from './types';

const Stack = createStackNavigator<FavoritesStackParamList>();

export default function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0077cc' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="FavoritesList" component={FavoritesScreen} options={{ title: 'Избранное' }} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Детали вакансии' }} />
    </Stack.Navigator>
  );
}