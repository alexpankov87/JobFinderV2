import { StyleSheet } from 'react-native';

// 🎨 Цветовая схема (константы)
export const Colors = {
  primary: '#0077cc',
  secondary: '#666',
  background: '#f0f0f0',
  white: '#ffffff',
  gray: 'gray',
  lightGray: '#e0e0e0',
  darkGray: '#333',
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
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 18,
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
});