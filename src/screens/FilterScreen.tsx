import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  X, Search, Globe, DollarSign, Euro, PoundSterling, CircleDollarSign, 
  SlidersHorizontal, Filter, Calendar, Clock, TrendingUp 
} from 'lucide-react-native';
import { useFiltersStore } from '../store/filtersStore';
import { AppStyles, Colors } from '../styles/AppStyles';

const COUNTRIES = ['Germany', 'Poland', 'USA', 'Netherlands', 'UK', 'Canada', 'Australia', 'Russia'];
const CURRENCIES = ['EUR', 'USD', 'GBP', 'CAD', 'AUD', 'RUB'];
const SALARY_PERIODS = [
  { id: 'year', label: 'В год', icon: Calendar },
  { id: 'month', label: 'В месяц', icon: Clock },
  { id: 'day', label: 'В день', icon: TrendingUp },
  { id: 'hour', label: 'В час', icon: Clock },
];

const getCurrencyIcon = (currency: string, isActive: boolean = false) => {
  const color = isActive ? Colors.white : Colors.primary;
  switch (currency) {
    case 'EUR': return <Euro size={14} color={color} />;
    case 'USD': return <CircleDollarSign size={14} color={color} />;
    case 'GBP': return <PoundSterling size={14} color={color} />;
    case 'RUB': return <DollarSign size={14} color={color} />;
    default: return <DollarSign size={14} color={color} />;
  }
};

export default function FilterScreen() {
  const navigation = useNavigation();
  const {
    filters,
    setSearchQuery,
    setCountry,
    setMinSalary,
    setMaxSalary,
    setCurrency,
    setSalaryPeriod,
    resetFilters,
    hasActiveFilters,
  } = useFiltersStore();

  const handleApply = () => {
    navigation.goBack();
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <ScrollView style={AppStyles.container}>
      {/* Заголовок */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Filter size={24} color={Colors.primary} />
          <Text style={[AppStyles.title, { marginBottom: 0 }]}>Фильтры</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color={Colors.darkGray} />
        </TouchableOpacity>
      </View>

      {/* Поисковая строка */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
          <Search size={18} color={Colors.darkGray} />
          <Text style={{ color: Colors.darkGray, fontWeight: '500' }}>Ключевые слова</Text>
        </View>
        <TextInput
          style={AppStyles.input}
          placeholder="Название или компания"
          value={filters.searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Страна */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
          <Globe size={18} color={Colors.darkGray} />
          <Text style={{ color: Colors.darkGray, fontWeight: '500' }}>Страна</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {COUNTRIES.map((country) => (
            <TouchableOpacity
              key={country}
              style={[
                AppStyles.countryButton,
                filters.country === country && AppStyles.countryButtonActive,
              ]}
              onPress={() => setCountry(filters.country === country ? null : country)}
            >
              <Text
                style={[
                  AppStyles.countryText,
                  filters.country === country && AppStyles.countryTextActive,
                ]}
              >
                {country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Тип ставки */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
          <Clock size={18} color={Colors.darkGray} />
          <Text style={{ color: Colors.darkGray, fontWeight: '500' }}>Период зарплаты</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SALARY_PERIODS.map((period) => {
            const IconComponent = period.icon;
            const isActive = filters.salaryPeriod === period.id;
            return (
              <TouchableOpacity
                key={period.id}
                style={[
                  AppStyles.countryButton,
                  isActive && AppStyles.countryButtonActive,
                ]}
                onPress={() => setSalaryPeriod(isActive ? null : period.id)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <IconComponent size={12} color={isActive ? Colors.white : Colors.primary} />
                  <Text
                    style={[
                      AppStyles.countryText,
                      isActive && AppStyles.countryTextActive,
                    ]}
                  >
                    {period.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Зарплата */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
          <DollarSign size={18} color={Colors.darkGray} />
          <Text style={{ color: Colors.darkGray, fontWeight: '500' }}>Зарплата</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TextInput
            style={[AppStyles.input, { flex: 1 }]}
            placeholder="От"
            keyboardType="numeric"
            value={filters.minSalary?.toString() || ''}
            onChangeText={(text) => setMinSalary(text ? Number(text) : null)}
          />
          <TextInput
            style={[AppStyles.input, { flex: 1 }]}
            placeholder="До"
            keyboardType="numeric"
            value={filters.maxSalary?.toString() || ''}
            onChangeText={(text) => setMaxSalary(text ? Number(text) : null)}
          />
        </View>
      </View>

      {/* Валюта */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
          <SlidersHorizontal size={18} color={Colors.darkGray} />
          <Text style={{ color: Colors.darkGray, fontWeight: '500' }}>Валюта</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CURRENCIES.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                AppStyles.currencyButton,
                filters.currency === currency && AppStyles.currencyButtonActive,
              ]}
              onPress={() => setCurrency(filters.currency === currency ? null : currency)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {getCurrencyIcon(currency, filters.currency === currency)}
                <Text
                  style={[
                    AppStyles.currencyText,
                    filters.currency === currency && AppStyles.currencyTextActive,
                  ]}
                >
                  {currency}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Кнопки */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <TouchableOpacity
          style={[AppStyles.modalButton, AppStyles.modalButtonCancel, { flex: 1 }]}
          onPress={handleReset}
        >
          <Text style={AppStyles.modalButtonTextCancel}>Сбросить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[AppStyles.modalButton, AppStyles.modalButtonSubmit, { flex: 1 }]}
          onPress={handleApply}
        >
          <Text style={AppStyles.modalButtonText}>Применить</Text>
        </TouchableOpacity>
      </View>

      {hasActiveFilters() && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <Filter size={14} color={Colors.primary} />
          <Text style={{ color: Colors.primary, fontSize: 12 }}>Активные фильтры применены</Text>
        </View>
      )}
    </ScrollView>
  );
}