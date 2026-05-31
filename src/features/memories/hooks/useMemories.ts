import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { createMemory, deleteMemory, fetchMemories } from '../api/memories.api';

export function useMemories(contactId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: contactId ? [...queryKeys.memories, contactId] : queryKeys.memories,
    queryFn: () => fetchMemories(contactId),
  });

  const createMutation = useMutation({
    mutationFn: createMemory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.memories }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMemory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.memories }),
  });

  return {
    memories: query.data ?? [],
    isLoading: query.isLoading,
    createMemory: createMutation.mutateAsync,
    deleteMemory: deleteMutation.mutateAsync,
  };
}
