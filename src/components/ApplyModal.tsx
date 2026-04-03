import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppStyles, Colors } from '../styles/AppStyles';
import { supabase } from '../services/supabase';
import { Job } from '../types';
import { ResponseFormData, responseSchema } from '../schemas/responseSchema';
import { useAuth } from '../context/AuthContext';

type ApplyModalProps = {
  visible: boolean;
  onClose: () => void;
  job: Job;
  onSuccess: () => void;
};

export default function ApplyModal({ visible, onClose, job, onSuccess }: ApplyModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      preferredContact: 'email',
      contactValue: '',
      coverLetter: '',
    },
  });

  const preferredContact = watch('preferredContact');

  const getContactPlaceholder = () => {
    switch (preferredContact) {
      case 'email':
        return 'example@mail.com';
      case 'whatsapp':
        return '+7 700 123 4567';
      case 'telegram':
        return '@username';
      default:
        return 'Введите контактные данные';
    }
  };

  const onSubmit = async (data: ResponseFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.from('responses').insert({
        job_id: job.id,
        user_id: user?.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        preferred_contact: data.preferredContact,
        contact_value: data.contactValue,
        cover_letter: data.coverLetter || null,
        status: 'pending',
      });

      if (error) throw error;

      Alert.alert('Успешно!', 'Ваш отклик отправлен работодателю');
      onSuccess();
      onClose();
      reset(); // Очищаем форму
    } catch (error) {
      console.error('Ошибка при отправке отклика:', error);
      Alert.alert('Ошибка', 'Не удалось отправить отклик. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={AppStyles.modalOverlay}>
        <View style={AppStyles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={AppStyles.modalTitle}>
              Отклик на вакансию
            </Text>
            <Text style={{ fontSize: 14, color: Colors.primary, marginBottom: 16 }}>
              {job.title} в {job.company}
            </Text>

            {/* Полное имя */}
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[AppStyles.input, errors.fullName && { borderColor: 'red' }]}
                    placeholder="Ваше полное имя *"
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.fullName && (
                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                      {errors.fullName.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[AppStyles.input, errors.email && { borderColor: 'red' }]}
                    placeholder="Email *"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                      {errors.email.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Телефон */}
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={AppStyles.input}
                  placeholder="Телефон (опционально)"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                />
              )}
            />

            {/* Способ связи */}
            <Text style={{ marginBottom: 12, color: Colors.darkGray, fontWeight: '500' }}>
              Предпочтительный способ связи *
            </Text>
            <View style={AppStyles.contactMethodContainer}>
              {(['email', 'whatsapp', 'telegram'] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    AppStyles.contactMethodItem,
                    preferredContact === method && AppStyles.contactMethodItemSelected,
                  ]}
                  onPress={() => setValue('preferredContact', method)}
                  activeOpacity={0.7}
                >
                  <View style={AppStyles.contactMethodRadio}>
                    {preferredContact === method && <View style={AppStyles.contactMethodRadioSelected} />}
                  </View>
                  <Text style={AppStyles.contactMethodIcon}>
                    {method === 'email' && '📧'}
                    {method === 'whatsapp' && '💬'}
                    {method === 'telegram' && '✈️'}
                  </Text>
                  <Text style={[
                    AppStyles.contactMethodText,
                    preferredContact === method && AppStyles.contactMethodTextSelected,
                  ]}>
                    {method === 'email' && 'Email'}
                    {method === 'whatsapp' && 'WhatsApp'}
                    {method === 'telegram' && 'Telegram'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.preferredContact && (
              <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                {errors.preferredContact.message}
              </Text>
            )}

            {/* Контактные данные */}
            <Controller
              control={control}
              name="contactValue"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[AppStyles.input, errors.contactValue && { borderColor: 'red' }]}
                    placeholder={`Контактные данные (${getContactPlaceholder()}) *`}
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.contactValue && (
                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                      {errors.contactValue.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Сопроводительное письмо */}
            <Controller
              control={control}
              name="coverLetter"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[AppStyles.textArea, errors.coverLetter && { borderColor: 'red' }]}
                    placeholder="Сопроводительное письмо (опционально)"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                  />
                  {errors.coverLetter && (
                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>
                      {errors.coverLetter.message}
                    </Text>
                  )}
                </>
              )}
            />

            <View style={AppStyles.modalButtons}>
              <TouchableOpacity
                style={[AppStyles.modalButton, AppStyles.modalButtonCancel]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={AppStyles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[AppStyles.modalButton, AppStyles.modalButtonSubmit]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={AppStyles.modalButtonText}>Отправить</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}