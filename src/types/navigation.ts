import { NavigatorScreenParams } from '@react-navigation/native';
import { Job } from './index';

// Типы для стека внутри вкладки "Главная"
export type HomeStackParamList = {
  HomeList: undefined;
  JobDetail: { job: Job };
};

// Типы для стека внутри вкладки "Избранное"
export type FavoritesStackParamList = {
  FavoritesList: undefined;
  JobDetail: { job: Job };
};

// Типы для вкладок (Tab Navigator)
export type MainTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Favorites: NavigatorScreenParams<FavoritesStackParamList>;
  Profile: undefined;
};

// Корневой стек (Root Stack)
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};