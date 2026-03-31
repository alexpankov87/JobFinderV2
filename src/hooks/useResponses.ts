import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { Response } from '../types';

const fetchResponses = async (userId: string): Promise<Response[]> => {
  const { data, error } = await supabase
    .from('responses')
    .select('*, jobs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export function useResponses(userId?: string) {
  const queryClient = useQueryClient();

  const { data: responses = [], isLoading } = useQuery({
    queryKey: ['responses', userId],
    queryFn: () => fetchResponses(userId!),
    enabled: !!userId,
  });

  const { mutate: createResponse } = useMutation({
    mutationFn: async (newResponse: any) => {
      const { data, error } = await supabase
        .from('responses')
        .insert(newResponse)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responses'] });
    },
  });

  return { responses, isLoading, createResponse };
}