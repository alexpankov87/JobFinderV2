import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { ResponseWithJob } from '../types';
import { useAuth } from '../context/AuthContext';

const fetchResponses = async (userId: string): Promise<ResponseWithJob[]> => {
  console.log('🔍 Fetching responses for userId:', userId);
  
  const { data, error } = await supabase
    .from('responses')
    .select(`
      *,
      jobs:job_id (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  console.log('📦 Raw data from Supabase:', data);
  console.log('❌ Error:', error);
  
  if (error) throw new Error(error.message);
  return data || [];
};

export function useResponses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: responses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['responses', user?.id],
    queryFn: () => fetchResponses(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60, // 1 минута
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ responseId, status }: { responseId: number; status: string }) => {
      const { error } = await supabase
        .from('responses')
        .update({ status })
        .eq('id', responseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    },
  });

  return {
    responses,
    isLoading,
    error: error?.message || null,
    refetch,
    updateStatus,
  };
}