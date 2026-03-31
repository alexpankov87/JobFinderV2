import { View, Text, TouchableOpacity } from 'react-native';
import { AppStyles, Colors } from '../styles/AppStyles';

export default function ProfileScreen() {
  return (
    <View style={AppStyles.container}>
      <View style={AppStyles.header}>
        <Text style={AppStyles.logoIcon}>👤</Text>
        <Text style={AppStyles.logoText}>Профиль</Text>
      </View>
      
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>👤</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.darkGray }}>
          Гость
        </Text>
        <Text style={{ color: Colors.secondary, marginTop: 8 }}>
          Войдите, чтобы сохранять отклики и избранное
        </Text>
        
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 25,
            marginTop: 32,
          }}
          onPress={() => alert('Авторизация будет добавлена позже')}
        >
          <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>
            Войти / Зарегистрироваться
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}