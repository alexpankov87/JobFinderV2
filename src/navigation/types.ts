import { NavigatorScreenParams } from '@react-navigation/native';
import { Job } from '../types';

// Типы для стека внутри вкладки "Главная"
export type HomeStackParamList = {
  HomeList: undefined;
  JobDetail: { job: Job };
};

// Типы для стека внутри вкладки "Избранное" (если нужен будет детальный экран)
export type FavoritesStackParamList = {
  FavoritesList: undefined;
  JobDetail: { job: Job };
};

// Корневой тип навигации
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<{
    Home: NavigatorScreenParams<HomeStackParamList>;
    Favorites: NavigatorScreenParams<FavoritesStackParamList>;
    Profile: undefined;
  }>;
  // Можно добавить модальные окна, которые будут поверх табов
  // Modal: undefined;
};