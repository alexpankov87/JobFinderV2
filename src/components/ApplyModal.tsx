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
import { AppStyles, Colors } from '../styles/AppStyles';
import { supabase } from '../services/supabase';
import { Job } from '../types';

type ApplyModalProps = {
  visible: boolean;
  onClose: () => void;
  job: Job;
  onSuccess: () => void;
};

export default function ApplyModal({ visible, onClose, job, onSuccess }: ApplyModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'whatsapp' | 'telegram'>('email');
  const [contactValue, setContactValue] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Валидация
    if (!fullName.trim()) {
      Alert.alert('Ошибка', 'Введите ваше имя');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Ошибка', 'Введите email');
      return;
    }
    if (!contactValue.trim()) {
      Alert.alert('Ошибка', 'Введите контактные данные');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('responses').insert({
        job_id: job.id,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        preferred_contact: preferredContact,
        contact_value: contactValue.trim(),
        cover_letter: coverLetter.trim() || null,
        status: 'pending',
      });

      if (error) throw error;

      Alert.alert('Успешно!', 'Ваш отклик отправлен работодателю');
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Ошибка при отправке отклика:', error);
      Alert.alert('Ошибка', 'Не удалось отправить отклик. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPreferredContact('email');
    setContactValue('');
    setCoverLetter('');
  };

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
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

            <TextInput
              style={AppStyles.input}
              placeholder="Ваше полное имя *"
              value={fullName}
              onChangeText={setFullName}
            />

            <TextInput
              style={AppStyles.input}
              placeholder="Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={AppStyles.input}
              placeholder="Телефон (опционально)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={{ marginBottom: 12, color: Colors.darkGray, fontWeight: '500' }}>
            Предпочтительный способ связи *
            </Text>
            <View style={AppStyles.contactMethodContainer}>
            {([
                { id: 'email', icon: '📧', label: 'Email', placeholder: 'example@mail.com' },
                { id: 'whatsapp', icon: '💬', label: 'WhatsApp', placeholder: '+7 700 123 4567' },
                { id: 'telegram', icon: '✈️', label: 'Telegram', placeholder: '@username' }
            ] as const).map((method) => (
                <TouchableOpacity
                key={method.id}
                style={[
                    AppStyles.contactMethodItem,
                    preferredContact === method.id && AppStyles.contactMethodItemSelected,
                ]}
                onPress={() => {
                    setPreferredContact(method.id);
                    setContactValue('');
                }}
                activeOpacity={0.7}
                >
                <View style={AppStyles.contactMethodRadio}>
                    {preferredContact === method.id && <View style={AppStyles.contactMethodRadioSelected} />}
                </View>
                <Text style={AppStyles.contactMethodIcon}>{method.icon}</Text>
                <Text style={[
                    AppStyles.contactMethodText,
                    preferredContact === method.id && AppStyles.contactMethodTextSelected,
                ]}>
                    {method.label}
                </Text>
                </TouchableOpacity>
            ))}
            </View>

            <TextInput
              style={AppStyles.input}
              placeholder={`Контактные данные (${getContactPlaceholder()}) *`}
              value={contactValue}
              onChangeText={setContactValue}
            />

            <TextInput
              style={AppStyles.textArea}
              placeholder="Сопроводительное письмо (опционально)"
              value={coverLetter}
              onChangeText={setCoverLetter}
              multiline
              numberOfLines={4}
            />

            <View style={AppStyles.modalButtons}>
              <TouchableOpacity
                style={[AppStyles.modalButton, AppStyles.modalButtonCancel]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={AppStyles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[AppStyles.modalButton, AppStyles.modalButtonSubmit]}
                onPress={handleSubmit}
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