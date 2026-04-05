import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, LoginFormData } from '../../schemas/authSchema';
import { AppStyles, Colors } from '../../styles/AppStyles';

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    const { error } = await signIn(data.email, data.password);
    setLoading(false);

    if (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View style={[AppStyles.container, { justifyContent: 'center' }]}>
      <Image
        source={require('../../../assets/logo.png')}
        style={{ width: 250, height: 250, marginBottom: 40, alignItems: 'center', alignSelf: 'center' }}
      />

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

      <TouchableOpacity
        style={[AppStyles.applyButton, { marginTop: 20 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={AppStyles.applyButtonText}>Войти</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={{ marginTop: 20, alignItems: 'center' }}
      >
        <Text style={{ color: Colors.primary }}>
          Нет аккаунта? Зарегистрироваться
        </Text>
      </TouchableOpacity>
    </View>
    
  );
}