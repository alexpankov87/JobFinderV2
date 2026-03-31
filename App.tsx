import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryProvider } from './src/providers/QueryProvider';
import { FavoritesProvider } from './src/context/FavoritesContext';
import MainTabs from './src/navigation/MainTabs';
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </QueryProvider>
  );
}