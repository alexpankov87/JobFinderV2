import { View, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

export default function FavoritesScreen() {
  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Избранное</Text>
      <Text style={{ textAlign: 'center', marginTop: 50 }}>
        Здесь будут сохранённые вакансии
      </Text>
    </View>
  );
}