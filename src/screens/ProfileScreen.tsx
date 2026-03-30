import { View, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

export default function ProfileScreen() {
  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.title}>Профиль</Text>
      <Text style={{ textAlign: 'center', marginTop: 50 }}>
        Здесь будет личный кабинет
      </Text>
    </View>
  );
}