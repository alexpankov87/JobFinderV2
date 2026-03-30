import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Job } from '../types';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) throw error;

      const formattedJobs: Job[] = (data || []).map(job => ({
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

      setJobs(formattedJobs);
    } catch (err) {
      console.error('Ошибка загрузки вакансий:', err);
      setError('Не удалось загрузить вакансии');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, refetch: fetchJobs };
}