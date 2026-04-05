import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#2092e4',        // синий для светлой темы
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#1a1a2e',
  textSecondary: '#666666',
  border: '#e0e0e0',
  inputBackground: '#ffffff',
  inputBorder: '#e0e0e0',
  tabBar: '#ffffff',
};

const darkColors = {
  primary: '#ffbb28',        // жёлтый для тёмной темы
  background: '#2a2a3e',     // светлый тёмный (не чёрный)
  card: '#3a3a4e',
  text: '#ffffff',
  textSecondary: '#cccccc',
  border: '#4a4a5e',
  inputBackground: '#3a3a4e',
  inputBorder: '#4a4a5e',
  tabBar: '#3a3a4e',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('app-theme').then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setTheme(saved);
      }
      setIsReady(true);
    });
  }, []);

  const saveTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    AsyncStorage.setItem('app-theme', newTheme);
  };

  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (theme === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
    return theme;
  };

  const isDark = getEffectiveTheme() === 'dark';
  const colors = isDark ? darkColors : lightColors;

  if (!isReady) {
    return null; 
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme: saveTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}