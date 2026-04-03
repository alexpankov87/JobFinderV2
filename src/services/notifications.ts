import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from './supabase';
import { Platform } from 'react-native';

// Настройка обработчика уведомлений 
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,   
    shouldShowList: true,      
  }),
});

export type MainTabsParamList = {
  Home: undefined;
  Favorites: undefined;
  MyResponses: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

// Запрос разрешения и получение токена
export async function registerForPushNotificationsAsync(userId: string) {
  if (!Device.isDevice) {
    console.log('Push-уведомления доступны только на реальном устройстве');
    return;
  }

  // Запрашиваем разрешение
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Разрешение на уведомления не получено');
    return;
  }

  // Получаем push-токен
  const projectId = 'YOUR_EXPO_PROJECT_ID'; // замени на свой из app.json
  const token = await Notifications.getExpoPushTokenAsync({ projectId });

  // Сохраняем токен в Supabase
  const { error } = await supabase
    .from('push_tokens')
    .upsert({
      user_id: userId,
      token: token.data,
      device_type: Platform.OS,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,token',
    });

  if (error) {
    console.error('Ошибка сохранения токена:', error);
  } else {
    console.log('Push-токен сохранён:', token.data);
  }

  return token.data;
}

// Удаление токена при выходе
export async function unregisterPushToken(userId: string, token: string) {
  await supabase
    .from('push_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('token', token);
}