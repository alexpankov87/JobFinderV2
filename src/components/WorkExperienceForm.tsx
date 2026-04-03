import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useState } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppStyles, Colors } from '../styles/AppStyles';
import { WorkExperience } from '../types';

interface Props {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

// Преобразует ISO дату (YYYY-MM-DD) в отображаемый формат (DD.MM.YYYY)
const formatDisplayDate = (isoDate: string | null): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
};

export default function WorkExperienceForm({ experiences, onChange }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<'startDate' | 'endDate' | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: null,
      isCurrent: false,
      description: '',
    };
    onChange([...experiences, newExperience]);
  };

  const updateExperience = (index: number, updates: Partial<WorkExperience>) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    onChange(updated);
  };

  const openPicker = (index: number, field: 'startDate' | 'endDate') => {
    setSelectedIndex(index);
    setSelectedField(field);
    const currentDate = experiences[index]?.[field];
    if (currentDate && typeof currentDate === 'string') {
      const [year, month, day] = currentDate.split('-');
      setTempDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
    } else {
      setTempDate(new Date());
    }
    setShowPicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate && selectedIndex !== null && selectedField) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      updateExperience(selectedIndex, { [selectedField]: isoDate });
    }
    
    if (Platform.OS === 'ios') {
      setShowPicker(false);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={AppStyles.label}>Опыт работы</Text>
        <TouchableOpacity onPress={addExperience} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Plus size={18} color={Colors.primary} />
          <Text style={{ color: Colors.primary, fontSize: 12 }}>Добавить место работы</Text>
        </TouchableOpacity>
      </View>

      {experiences.length === 0 && (
        <Text style={{ color: Colors.secondary, fontSize: 14, textAlign: 'center', padding: 20 }}>
          Нет добавленного опыта. Нажмите "+" чтобы добавить
        </Text>
      )}

      {experiences.map((exp, index) => (
        <View key={exp.id} style={[AppStyles.jobCard, { marginBottom: 12, padding: 12 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold', color: Colors.primary }}>Место работы #{index + 1}</Text>
            <TouchableOpacity onPress={() => removeExperience(index)}>
              <Trash2 size={18} color={Colors.gray} />
            </TouchableOpacity>
          </View>

          <Text style={AppStyles.label}>Компания</Text>
          <TextInput
            style={AppStyles.input}
            placeholder="Название компании"
            value={exp.company}
            onChangeText={(text) => updateExperience(index, { company: text })}
          />

          <Text style={AppStyles.label}>Должность</Text>
          <TextInput
            style={AppStyles.input}
            placeholder="Должность"
            value={exp.position}
            onChangeText={(text) => updateExperience(index, { position: text })}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={AppStyles.label}>Дата начала</Text>
              <TouchableOpacity
                style={[AppStyles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => openPicker(index, 'startDate')}
              >
                <Text style={{ color: exp.startDate ? Colors.darkGray : Colors.gray }}>
                  {exp.startDate ? formatDisplayDate(exp.startDate) : 'Выберите дату'}
                </Text>
                <CalendarIcon size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={AppStyles.label}>Дата окончания</Text>
              <TouchableOpacity
                style={[AppStyles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: exp.isCurrent ? Colors.lightGray : Colors.white }]}
                onPress={() => !exp.isCurrent && openPicker(index, 'endDate')}
                disabled={exp.isCurrent}
              >
                <Text style={{ color: exp.endDate ? Colors.darkGray : Colors.gray }}>
                  {exp.isCurrent ? 'По настоящее время' : (exp.endDate ? formatDisplayDate(exp.endDate) : 'Выберите дату')}
                </Text>
                {!exp.isCurrent && <CalendarIcon size={18} color={Colors.primary} />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => updateExperience(index, { isCurrent: !exp.isCurrent, endDate: !exp.isCurrent ? exp.endDate : null })}
            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: Colors.primary,
              backgroundColor: exp.isCurrent ? Colors.primary : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}>
              {exp.isCurrent && <Text style={{ color: Colors.white, fontSize: 12 }}>✓</Text>}
            </View>
            <Text style={{ color: Colors.darkGray }}>Я сейчас работаю здесь</Text>
          </TouchableOpacity>

          <Text style={AppStyles.label}>Обязанности и достижения</Text>
          <TextInput
            style={[AppStyles.input, { minHeight: 60, textAlignVertical: 'top' }]}
            placeholder="Чем занимались, какие достижения?"
            multiline
            value={exp.description}
            onChangeText={(text) => updateExperience(index, { description: text })}
          />
        </View>
      ))}

      {showPicker && (
        <DateTimePicker
          value={tempDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}