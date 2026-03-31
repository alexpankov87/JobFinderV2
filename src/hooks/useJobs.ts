import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { Job } from '../types';

const fetchJobs = async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posted_at', { ascending: false });

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
  const {
    data: jobs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  return {
    jobs,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}