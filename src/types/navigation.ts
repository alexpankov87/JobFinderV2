import { NavigatorScreenParams } from '@react-navigation/native';
import { Job } from './index';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  MyResumes: undefined;
  ResumeForm: { resumeId?: number } | undefined;
};

// Main Tabs
export type MainTabsParamList = {
  Home: undefined;
  Favorites: undefined;
  MyResponses: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  JobDetail: { job: Job };
  Filter: undefined;
};