import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { Job } from '../types';
import { useFiltersStore } from '../store/filtersStore';

interface Filters {
  searchQuery: string;
  country: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string | null;
  salaryPeriod: string | null;
}

const fetchJobs = async (filters: Filters): Promise<Job[]> => {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('posted_at', { ascending: false });

  // Поиск по названию и компании
  if (filters.searchQuery) {
    query = query.or(
      `title.ilike.%${filters.searchQuery}%,company.ilike.%${filters.searchQuery}%`
    );
  }

  // Фильтр по стране
  if (filters.country) {
    query = query.eq('country', filters.country);
  }

  // Фильтр по минимальной зарплате
  if (filters.minSalary) {
    query = query.gte('salary_min', filters.minSalary);
  }

  // Фильтр по максимальной зарплате
  if (filters.maxSalary) {
    query = query.lte('salary_max', filters.maxSalary);
  }

  // Фильтр по валюте
  if (filters.currency) {
    query = query.eq('currency', filters.currency);
  }

  // TODO: Фильтр по периоду зарплаты (salaryPeriod)
  // Пока просто логируем, позже добавим логику преобразования
  if (filters.salaryPeriod && filters.salaryPeriod !== 'year') {
    console.log('Salary period filter active:', filters.salaryPeriod);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data || []).map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location || '',
    country: job.country,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    currency: job.currency || 'USD',
    description: job.description || '',
    requirements: job.requirements || [],
    posted_at: job.posted_at,
    url: job.url,
  }));
};

export function useJobs() {
  const { filters } = useFiltersStore();
  
  const {
    data: jobs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  return {
    jobs,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}