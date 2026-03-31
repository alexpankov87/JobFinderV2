import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { registerSchema, RegisterFormData } from '../../schemas/authSchema';
import { AppStyles, Colors } from '../../styles/AppStyles';

export default function RegisterScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    const { error } = await signUp(data.email, data.password);
    setLoading(false);

    if (error) {
        Alert.alert('Ошибка', error.message);
    } else {
        Alert.alert(
        'Подтвердите email',
        'На вашу почту отправлена ссылка для подтверждения. Перейдите по ней, чтобы войти в приложение.'
        );
      navigation.navigate('Login');
    }
  };

  return (
    <View style={[AppStyles.container, { justifyContent: 'center' }]}>
      <Text style={[AppStyles.title, { fontSize: 32, marginBottom: 40 }]}>
        Регистрация
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[AppStyles.input, errors.email && { borderColor: 'red' }]}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                {errors.email.message}
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[AppStyles.input, errors.password && { borderColor: 'red' }]}
              placeholder="Пароль"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
            {errors.password && (
              <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                {errors.password.message}
              </Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[AppStyles.input, errors.confirmPassword && { borderColor: 'red' }]}
              placeholder="Подтвердите пароль"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        style={[AppStyles.applyButton, { marginTop: 20 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={AppStyles.applyButtonText}>Зарегистрироваться</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 20, alignItems: 'center' }}
      >
        <Text style={{ color: Colors.primary }}>
          Уже есть аккаунт? Войти
        </Text>
      </TouchableOpacity>
    </View>
  );
}