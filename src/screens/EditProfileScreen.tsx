import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, User, MessageCircle, Send } from 'lucide-react-native';
import { useProfile } from '../hooks/useProfile';
import { profileSchema, ProfileFormData } from '../schemas/profileSchema';
import { AppStyles, Colors } from '../styles/AppStyles';

export default function EditProfileScreen({ navigation }: any) {
  const { profile, update, isUpdating } = useProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      preferred_contact: profile?.preferred_contact || null,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    update(data, {
      onSuccess: () => {
        Alert.alert('Успешно', 'Профиль обновлён');
        navigation.goBack();
      },
      onError: (error) => {
        Alert.alert('Ошибка', error.message);
      },
    });
  };

  return (
    <ScrollView style={AppStyles.container}>
      <Text style={[AppStyles.title, { marginBottom: 20 }]}>Редактирование профиля</Text>

      {/* Имя */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <User size={18} color={Colors.darkGray} />
        <Text style={{ color: Colors.darkGray }}>Имя</Text>
      </View>
      <Controller
        control={control}
        name="full_name"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[AppStyles.input, errors.full_name && { borderColor: 'red' }]}
              placeholder="Ваше имя"
              value={value || ''}
              onChangeText={onChange}
            />
            {errors.full_name && (
              <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{errors.full_name.message}</Text>
            )}
          </>
        )}
      />

      {/* Телефон */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <Phone size={18} color={Colors.darkGray} />
        <Text style={{ color: Colors.darkGray }}>Телефон</Text>
      </View>
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[AppStyles.input, errors.phone && { borderColor: 'red' }]}
              placeholder="+7 700 123 4567"
              value={value || ''}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{errors.phone.message}</Text>
            )}
          </>
        )}
      />

    {/* Способ связи */}
    <Text style={{ marginBottom: 12, color: Colors.darkGray, fontWeight: '500' }}>
      Предпочтительный способ связи
    </Text>
    <Controller
      control={control}
      name="preferred_contact"
      render={({ field: { onChange, value } }) => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(['email', 'whatsapp', 'telegram'] as const).map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                AppStyles.contactMethodButtonSmall,
                value === method && AppStyles.contactMethodButtonSmallActive,
              ]}
              onPress={() => onChange(method)}
            >
              {method === 'email' && <Mail size={14} color={value === method ? Colors.white : Colors.primary} />}
              {method === 'whatsapp' && <MessageCircle size={14} color={value === method ? Colors.white : Colors.primary} />}
              {method === 'telegram' && <Send size={14} color={value === method ? Colors.white : Colors.primary} />}
              <Text
                style={[
                  AppStyles.contactMethodTextSmall,
                  value === method && AppStyles.contactMethodTextSmallActive,
                ]}
              >
                {method === 'email' && 'Email'}
                {method === 'whatsapp' && 'WhatsApp'}
                {method === 'telegram' && 'Telegram'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    />

      <TouchableOpacity
        style={[AppStyles.applyButton, { marginTop: 20 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={AppStyles.applyButtonText}>Сохранить</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}