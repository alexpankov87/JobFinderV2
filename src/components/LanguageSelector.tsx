import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react-native';
import { AppStyles, Colors } from '../styles/AppStyles';
import { LanguageItem } from '../types';

interface LanguageSelectorProps {
  selectedLanguages: LanguageItem[];
  onChange: (languages: LanguageItem[]) => void;
}

const AVAILABLE_LANGUAGES = [
  'Русский', 'Английский', 'Немецкий', 'Французский', 'Испанский', 
  'Итальянский', 'Китайский', 'Японский', 'Корейский', 'Казахский',
  'Турецкий', 'Арабский', 'Польский', 'Чешский'
];

const LANGUAGE_LEVELS = [
  { value: 'native', label: 'Родной' },
  { value: 'fluent', label: 'Свободно' },
  { value: 'advanced', label: 'Продвинутый (C1)' },
  { value: 'upper_intermediate', label: 'Выше среднего (B2)' },
  { value: 'intermediate', label: 'Средний (B1)' },
  { value: 'elementary', label: 'Начальный (A2)' },
  { value: 'beginner', label: 'Базовый (A1)' },
];

export default function LanguageSelector({ selectedLanguages, onChange }: LanguageSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const isFormValid = selectedLanguage && selectedLevel;

  const addLanguage = () => {
    if (isFormValid) {
      const newLanguage: LanguageItem = {
        id: Date.now().toString(),
        name: selectedLanguage,
        level: selectedLevel,
      };
      onChange([...selectedLanguages, newLanguage]);
      setSelectedLanguage(null);
      setSelectedLevel(null);
      setModalVisible(false);
    }
  };

  const removeLanguage = (id: string) => {
    onChange(selectedLanguages.filter(lang => lang.id !== id));
  };

  const getLevelLabel = (level: string) => {
    const found = LANGUAGE_LEVELS.find(l => l.value === level);
    return found ? found.label : '';
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={AppStyles.label}>Знание языков</Text>
      
      {selectedLanguages.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          {selectedLanguages.map((lang) => (
            <View key={lang.id} style={[AppStyles.jobCard, { padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
              <View>
                <Text style={{ fontWeight: 'bold', color: Colors.darkGray }}>{lang.name}</Text>
                {lang.level && (
                  <Text style={{ fontSize: 12, color: Colors.secondary }}>{getLevelLabel(lang.level)}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => removeLanguage(lang.id)}>
                <X size={20} color={Colors.gray} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[AppStyles.applyButton, { backgroundColor: Colors.lightGray, marginTop: 0 }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: Colors.primary }}>+ Добавить язык</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: Colors.white, borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' }}>
            <Text style={[AppStyles.title, { fontSize: 18, marginBottom: 16 }]}>Добавить язык</Text>

            <Text style={[AppStyles.label, { marginBottom: 8 }]}>Язык *</Text>
            <View style={{ maxHeight: 150, marginBottom: 16 }}>
              <FlatList
                data={AVAILABLE_LANGUAGES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.lightGray,
                    }}
                    onPress={() => setSelectedLanguage(item)}
                  >
                    <Text style={{ fontSize: 16, color: Colors.darkGray }}>{item}</Text>
                    {selectedLanguage === item && <Check size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                )}
              />
            </View>

            <Text style={[AppStyles.label, { marginBottom: 8 }]}>Уровень владения *</Text>
            <View style={{ maxHeight: 250, marginBottom: 20 }}>
              <FlatList
                data={LANGUAGE_LEVELS}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.lightGray,
                    }}
                    onPress={() => setSelectedLevel(item.value)}
                  >
                    <Text style={{ fontSize: 16, color: Colors.darkGray }}>{item.label}</Text>
                    {selectedLevel === item.value && <Check size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[AppStyles.modalButton, AppStyles.modalButtonCancel, { flex: 1 }]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedLanguage(null);
                  setSelectedLevel(null);
                }}
              >
                <Text style={AppStyles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  AppStyles.modalButton, 
                  AppStyles.modalButtonSubmit, 
                  { flex: 1, opacity: isFormValid ? 1 : 0.5 }
                ]}
                onPress={addLanguage}
                disabled={!isFormValid}
              >
                <Text style={AppStyles.modalButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}