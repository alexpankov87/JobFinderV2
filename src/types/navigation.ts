import { NavigatorScreenParams } from '@react-navigation/native';
import { Job } from './index';

// Типы для стека авторизации
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Типы для главных вкладок (без вложенных стеков)
export type MainTabsParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Корневой стек — только Auth, MainTabs и JobDetail (доступен отовсюду)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  JobDetail: { job: Job };
};