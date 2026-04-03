import { StyleSheet } from 'react-native';

// 🎨 Цветовая схема (константы)
export const Colors = {
  primary: '#2092e4',
  secondary: '#666',
  background: '#f0f0f0',
  white: '#ffffff',
  gray: 'gray',
  lightGray: '#e0e0e0',
  darkGray: '#333',
  transParent: 'transparent',
};

// 🌑 Тени (переиспользуемые)
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

// 📐 Стили (layout, отступы, шрифты)
export const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.darkGray,
  },
  counter: {
    textAlign: 'center',
    color: Colors.secondary,
    marginBottom: 16,
    fontSize: 14,
  },
  jobCard: {
    backgroundColor: Colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    ...Shadows.small,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  jobCompany: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 5,
  },
  jobCountry: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Стили для детального экрана вакансии
  detailContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  detailTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginBottom: 12,
  },
  detailCompany: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 8,
  },
  detailLocation: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 16,
  },
  detailSalary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    backgroundColor: '#e6f0fa',
    padding: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 16,
    color: Colors.darkGray,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailRequirements: {
    fontSize: 16,
    color: Colors.darkGray,
    lineHeight: 24,
    marginBottom: 24,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Стили для модального окна отклика
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: Colors.white,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Контейнер для списка способов связи
  contactMethodContainer: {
    marginBottom: 20,
  },
  contactMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  contactMethodItemSelected: {
    backgroundColor: '#e6f0fa',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  contactMethodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactMethodRadioSelected: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  contactMethodIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 32,
  },
  contactMethodText: {
    fontSize: 16,
    color: Colors.darkGray,
    flex: 1,
  },
  contactMethodTextSelected: {
    color: Colors.primary,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: Colors.lightGray,
  },
  modalButtonSubmit: {
    backgroundColor: Colors.primary,
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  modalButtonTextCancel: {
    color: Colors.darkGray,
  },
   // Стили для логотипа и названия (добавляем)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  logoIcon: {
    fontSize: 32,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
    // Стили для карточки отклика
  responseCard: {
    backgroundColor: Colors.white,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    ...Shadows.small,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginBottom: 4,
  },
  responseCompany: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 8,
  },
  responseMeta: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusViewed: {
    backgroundColor: '#dbeafe',
  },
  statusAccepted: {
    backgroundColor: '#d1fae5',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextPending: {
    color: '#d97706',
  },
  statusTextViewed: {
    color: '#2563eb',
  },
  statusTextAccepted: {
    color: '#059669',
  },
  statusTextRejected: {
    color: '#dc2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
    // Стили для кнопок выбора способа связи (добавь, если отсутствуют)
  contactMethodButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  contactMethodButtonActive: {
    backgroundColor: Colors.primary,
  },
  contactMethodTextActive: {
    color: Colors.white,
  },
  searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.white,
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 30,
  marginBottom: 16,
  ...Shadows.small,
},
  activeFilterBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  counterText: {
    color: Colors.secondary,
    fontSize: 14,
  },
  currencyButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: Colors.primary,
  backgroundColor: Colors.white,
  },
  currencyButtonActive: {
    backgroundColor: Colors.primary,
  },
  currencyIcon: {
    marginRight: 4,
  },
  currencyText: {
    fontSize: 12,
    color: Colors.primary,
  },
  currencyTextActive: {
    color: Colors.white,
  },
  countryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  countryButtonActive: {
    backgroundColor: Colors.primary,
  },
  countryText: {
    fontSize: 12,
    color: Colors.primary,
  },
  countryTextActive: {
    color: Colors.white,
  },
  contactMethodButtonSmall: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: Colors.primary,
  backgroundColor: Colors.white,
  gap: 6,
},
  contactMethodButtonSmallActive: {
    backgroundColor: Colors.primary,
  },
  contactMethodTextSmall: {
    fontSize: 12,
    color: Colors.primary,
  },
  contactMethodTextSmallActive: {
    color: Colors.white,
  },
  label: {
    marginBottom: 4,
    color: Colors.darkGray,
    fontSize: 14,
    fontWeight: '500',
  },
}); 