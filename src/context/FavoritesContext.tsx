import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { Job } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@jobfinder_favorites';

type FavoritesContextType = {
  favorites: Job[];
  favoriteIds: Set<number>;
  loading: boolean;
  addToFavorites: (job: Job) => Promise<void>;
  removeFromFavorites: (jobId: number) => Promise<void>;
  isFavorite: (jobId: number) => boolean;
  refetch: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Job[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoriteIds(new Set(parsed));
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('job_id, jobs(*)')
          .eq('user_id', user.id);

        if (!error && data) {
          const jobs: Job[] = data
            .map((item: any) => item.jobs)
            .filter((job: any) => job !== null);
          
          setFavorites(jobs);
          setFavoriteIds(new Set(jobs.map(j => j.id)));
          
          await AsyncStorage.setItem(
            FAVORITES_KEY,
            JSON.stringify(jobs.map(j => j.id))
          );
          setLoading(false);
          return;
        }
      }
      
      if (favoriteIds.size > 0) {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .in('id', Array.from(favoriteIds));
        
        if (!error && data) {
          setFavorites(data);
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (job: Job) => {
    try {
      const newIds = new Set(favoriteIds);
      newIds.add(job.id);
      setFavoriteIds(newIds);
      
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(Array.from(newIds))
      );

      setFavorites(prev => {
        if (prev.some(j => j.id === job.id)) return prev;
        return [...prev, job];
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, job_id: job.id });
      }
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  const removeFromFavorites = async (jobId: number) => {
    try {
      const newIds = new Set(favoriteIds);
      newIds.delete(jobId);
      setFavoriteIds(newIds);
      
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(Array.from(newIds))
      );

      setFavorites(prev => prev.filter(j => j.id !== jobId));

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);
      }
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
    }
  };

  const isFavorite = (jobId: number) => favoriteIds.has(jobId);

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoriteIds,
      loading,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      refetch: loadFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}