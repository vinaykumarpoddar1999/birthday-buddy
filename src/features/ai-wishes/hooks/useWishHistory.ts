import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { wishService } from '@/services/wish/wish.service';
import type { WishHistoryEntry, WishLanguage, WishLength, WishTone } from '../types';

export const wishHistoryQueryKey = ['wish-history'] as const;

function mapToHistoryEntry(row: {
  uuid: string;
  wishText: string;
  tone: string | null;
  language: string | null;
  favorite: number;
  createdAt: string;
  personUuid: string;
  personName: string;
}): WishHistoryEntry {
  return {
    id: row.uuid,
    text: row.wishText,
    tone: (row.tone ?? 'heartfelt') as WishTone,
    length: 'medium' as WishLength,
    language: (row.language ?? 'english') as WishLanguage,
    personId: row.personUuid,
    personName: row.personName,
    relationship: 'general',
    personalContext: '',
    createdAt: row.createdAt,
    isFavorite: row.favorite === 1,
    isEdited: false,
    originalText: row.wishText,
    sharedVia: [],
    usedInCard: false,
  };
}

export function useWishHistory() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: wishHistoryQueryKey,
    queryFn: async () => {
      const rows = await wishService.listAllRecent(100);
      return rows.map(mapToHistoryEntry);
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, favorite }: { id: string; favorite: boolean }) => {
      await wishService.toggleFavorite(id, favorite);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishHistoryQueryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => wishService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishHistoryQueryKey }),
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    toggleFavorite: (id: string, favorite: boolean) =>
      toggleFavoriteMutation.mutate({ id, favorite }),
    deleteFromHistory: (id: string) => deleteMutation.mutate(id),
    refresh: () => queryClient.invalidateQueries({ queryKey: wishHistoryQueryKey }),
  };
}
