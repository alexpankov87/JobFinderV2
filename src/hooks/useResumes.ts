import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserResumes, createResume, updateResume, deleteResume, setActiveResume, uploadResumeFile, Resume } from '../services/resumeService';
import { useAuth } from '../context/AuthContext';

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

  const { mutate: addResume, isPending: isAdding } = useMutation({
    mutationFn: (resume: Omit<Resume, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'file_url'>) => {
      return createResume({ ...resume, user_id: user!.id, file_url: null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });

  const { mutate: editResume, isPending: isEditing } = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Omit<Resume, 'id' | 'created_at' | 'updated_at' | 'user_id'>> }) => {
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

  const { mutate: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: ({ resumeId }: { resumeId: number }) => uploadResumeFile(user!.id, resumeId),
    onSuccess: (fileUrl, { resumeId }) => {
      if (fileUrl) {
        editResume({ id: resumeId, updates: { file_url: fileUrl } });
      }
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