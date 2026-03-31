import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';
import { QueryProvider } from './src/providers/QueryProvider';
import HomeStack from './src/navigation/HomeStack';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AppStyles, Colors } from './src/styles/AppStyles';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <QueryProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

              if (route.name === 'Главная') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Избранное') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Профиль') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.gray,
            tabBarStyle: AppStyles.tabBar,
            tabBarLabelStyle: AppStyles.tabBarLabel,
          })}
        >
          <Tab.Screen 
            name="Главная" 
            component={HomeStack} 
            options={{ title: 'Главная' }}
          />
          <Tab.Screen 
            name="Избранное" 
            component={FavoritesScreen} 
            options={{ title: 'Избранное' }}
          />
          <Tab.Screen 
            name="Профиль" 
            component={ProfileScreen} 
            options={{ title: 'Профиль' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryProvider>
  );
}