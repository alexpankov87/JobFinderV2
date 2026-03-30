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
    marginBottom: 20,
    color: Colors.darkGray,
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

});