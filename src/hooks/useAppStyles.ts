import { useTheme } from '../context/ThemeContext';
import { AppStyles as StaticStyles, Shadows } from '../styles/AppStyles';

export function useAppStyles() {
  const { colors } = useTheme();

  return {
    ...StaticStyles,
    colors,
    Shadows,
  };
}