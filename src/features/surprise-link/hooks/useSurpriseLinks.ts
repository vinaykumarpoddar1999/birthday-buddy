import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { surpriseLinkService } from '@services/surprise-link/surprise-link.service';
import type { ReactionType, ReplyType, SurpriseExperience } from '../types';

export const surpriseQueryKeys = {
  all: ['surprise-experiences'] as const,
  list: () => [...surpriseQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...surpriseQueryKeys.all, 'detail', id] as const,
  bySlug: (slug: string) => [...surpriseQueryKeys.all, 'slug', slug] as const,
  analytics: (id: string) => [...surpriseQueryKeys.all, 'analytics', id] as const,
  byPerson: (personId: string) => [...surpriseQueryKeys.all, 'person', personId] as const,
};

export function useSurpriseExperiences() {
  return useQuery({
    queryKey: surpriseQueryKeys.list(),
    queryFn: () => surpriseLinkService.listExperiences(),
  });
}

export function useSurpriseBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: surpriseQueryKeys.bySlug(slug ?? ''),
    queryFn: async () => {
      if (!slug) return null;
      return surpriseLinkService.getBySlug(slug);
    },
    enabled: !!slug,
  });
}

export function useSurpriseAnalytics(experienceId: string | undefined) {
  return useQuery({
    queryKey: surpriseQueryKeys.analytics(experienceId ?? ''),
    queryFn: () => surpriseLinkService.getAnalytics(experienceId!),
    enabled: !!experienceId,
  });
}

export function usePublishSurprise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (experience: SurpriseExperience) => surpriseLinkService.publishExperience(experience),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: surpriseQueryKeys.all });
    },
  });
}

export function useSaveSurprise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (experience: SurpriseExperience) => surpriseLinkService.saveExperience(experience),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: surpriseQueryKeys.all });
    },
  });
}

export function useRecordView() {
  return useMutation({
    mutationFn: ({ id, sectionId }: { id: string; sectionId?: string }) =>
      surpriseLinkService.recordView(id, sectionId),
  });
}

export function useAddReaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: ReactionType }) =>
      surpriseLinkService.addReaction(id, type),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: surpriseQueryKeys.analytics(id) });
    },
  });
}

export function useAddReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      type,
      content,
      mediaUri,
    }: {
      id: string;
      type: ReplyType;
      content: string;
      mediaUri?: string;
    }) => surpriseLinkService.addReply(id, type, content, mediaUri),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: surpriseQueryKeys.analytics(id) });
    },
  });
}
