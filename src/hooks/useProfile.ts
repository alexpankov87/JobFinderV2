import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, Profile } from '../services/profile';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60, // 1 минута
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (updates: Partial<Profile>) => updateProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile,
    isLoading,
    error: error?.message || null,
    refetch,
    update,
    isUpdating,
  };
}