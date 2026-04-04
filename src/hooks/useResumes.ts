import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserResumes, createResume, updateResume, deleteResume, setActiveResume, uploadResumeFile } from '../services/resumeService';
import { Resume } from '../types';
import { useAuth } from '../context/AuthContext';

type CreateResumeData = Omit<Resume, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'file_url' | 'file_name' | 'views' | 'last_response_status'>;

export function useResumes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: resumes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['resumes', user?.id],
    queryFn: () => getUserResumes(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60,
  });

  const { mutateAsync: addResume, isPending: isAdding } = useMutation({
    mutationFn: async (resumeData: CreateResumeData): Promise<Resume> => {
      const newResume = await createResume({
        ...resumeData,
        user_id: user!.id,
      });
      return newResume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const { mutateAsync: editResume, isPending: isEditing } = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Resume> }) => {
      return updateResume(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const { mutate: removeResume, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const { mutate: activateResume, isPending: isActivating } = useMutation({
    mutationFn: (resumeId: number) => setActiveResume(user!.id, resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const { mutateAsync: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: ({ resumeId }: { resumeId: number }) => uploadResumeFile(user!.id, resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  return {
    resumes,
    isLoading,
    error: error?.message || null,
    refetch,
    addResume,
    editResume,
    removeResume,
    activateResume,
    uploadFile,
    isAdding,
    isEditing,
    isDeleting,
    isActivating,
    isUploading,
  };
}