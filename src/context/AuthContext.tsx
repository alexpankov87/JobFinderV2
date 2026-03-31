import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase } from '../services/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Обработка deep link для подтверждения email
  const handleDeepLink = async (url: string | null): Promise<void> => {
    if (!url) return;
    
    console.log('🔗 Deep link received:', url);
    
    // Supabase возвращает токен в формате:
    // exp://localhost:19000/--#access_token=xxx&refresh_token=xxx&...
    // или jobfinder://auth/callback#access_token=xxx&...
    
    if (url.includes('#access_token')) {
      const hashParams = new URLSearchParams(url.split('#')[1]);
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      if ((type === 'recovery' || type === 'signup') && accessToken && refreshToken) {
        console.log('🔐 Setting session from deep link');
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (error) {
          console.error('❌ Error setting session:', error);
        } else {
          console.log('✅ Session set successfully');
        }
      }
    }
  };

  // Инициализация авторизации и deep links
  useEffect(() => {
    // 1. Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Слушаем изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // 3. Настраиваем deep link обработку
    const subscriptionLinking = Linking.addEventListener('url', ({ url }: { url: string }) => {
      handleDeepLink(url);
    });

    // 4. Проверяем, не открыто ли приложение через ссылку
    Linking.getInitialURL().then((url: string | null) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.unsubscribe();
      subscriptionLinking.remove();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    // Получаем URL для редиректа после подтверждения
    const redirectTo = Linking.createURL('auth/callback');
    console.log('📧 Sign up with redirect to:', redirectTo);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}