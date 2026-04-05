import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { loginSchema, LoginFormData } from '../../schemas/authSchema';
import { AppStyles } from '../../styles/AppStyles';
import { Sun, Moon, Monitor, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const { theme, setTheme, colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const autoSubmitTriggered = useRef(false); 

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    if (loading) return;
    setLoading(true);
    const { error } = await signIn(data.email, data.password);
    setLoading(false);
    if (error) Alert.alert('Ошибка', error.message);
  };

  // Автоматический вход после заполнения полей (один раз)
  useEffect(() => {
    if (email && password && !loading && !autoSubmitTriggered.current) {
      autoSubmitTriggered.current = true;
      handleSubmit(onSubmit)();
    }
  }, [email, password, loading]);

  if (!colors) return null;

  return (
    <View style={[AppStyles.container, { justifyContent: 'center', backgroundColor: colors.background }]}>
      {/* Переключатель темы */}
      <View style={{ position: 'absolute', top: 60, right: 20, flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={() => setTheme('light')}>
          <Sun size={24} color={theme === 'light' ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTheme('dark')}>
          <Moon size={24} color={theme === 'dark' ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTheme('system')}>
          <Monitor size={24} color={theme === 'system' ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Логотип */}
      <Image
        source={require('../../../assets/logo.png')}
        style={{ width: 250, height: 250, marginBottom: 40, alignSelf: 'center' }}
        resizeMode="contain"
      />

      {/* Email */}
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
            {errors.email && <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{errors.email.message}</Text>}
          </>
        )}
      />
      
      {/* Пароль */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[AppStyles.input, errors.password && { borderColor: 'red' }, { paddingRight: 45 }]}
                placeholder="Пароль"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: 12 }}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{errors.password.message}</Text>}
          </>
        )}
      />

      <TouchableOpacity
        style={[AppStyles.applyButton, { marginTop: 20, backgroundColor: colors.primary }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={AppStyles.applyButtonText}>Войти</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: colors.primary }}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}