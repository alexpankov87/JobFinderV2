import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Job } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@jobfinder_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Job[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Загрузка избранного
  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      // Сначала пробуем загрузить из локального хранилища
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoriteIds(new Set(parsed));
      }

      // Если есть авторизация — загружаем из Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('job_id, jobs(*)')
          .eq('user_id', user.id);

        if (!error && data) {
          // Извлекаем вакансии из ответа
          const jobs: Job[] = data
            .map((item: any) => item.jobs)
            .filter((job: any) => job !== null);
          
          setFavorites(jobs);
          setFavoriteIds(new Set(jobs.map(j => j.id)));
          
          // Синхронизируем с локальным хранилищем
          await AsyncStorage.setItem(
            FAVORITES_KEY,
            JSON.stringify(jobs.map(j => j.id))
          );
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  // Добавить в избранное
  const addToFavorites = async (job: Job) => {
    try {
      const newIds = new Set(favoriteIds);
      newIds.add(job.id);
      setFavoriteIds(newIds);
      
      // Сохраняем локально
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(Array.from(newIds))
      );

      // Если есть пользователь — сохраняем в Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, job_id: job.id });
      }

      // Обновляем список избранных вакансий
      setFavorites(prev => [...prev, job]);
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  // Удалить из избранного
  const removeFromFavorites = async (jobId: number) => {
    try {
      const newIds = new Set(favoriteIds);
      newIds.delete(jobId);
      setFavoriteIds(newIds);
      
      // Сохраняем локально
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(Array.from(newIds))
      );

      // Если есть пользователь — удаляем из Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);
      }

      // Обновляем список избранных вакансий
      setFavorites(prev => prev.filter(j => j.id !== jobId));
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
    }
  };

  // Проверить, в избранном ли вакансия
  const isFavorite = (jobId: number) => favoriteIds.has(jobId);

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: loadFavorites,
  };
}