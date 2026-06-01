import type { Draft } from '@features/card-studio/types';
import type { SavedWishTemplate } from '@features/ai-wishes/types';

import { settingsRepository } from '@/repositories/settings.repository';

const KEYS = {
  favoriteTemplateIds: 'card_studio_favorite_template_ids',
  recentTemplateIds: 'card_studio_recent_template_ids',
  drafts: 'card_studio_drafts',
  aiSavedTemplates: 'ai_wish_saved_templates',
} as const;

export type CardStudioPrefs = {
  favoriteTemplateIds: string[];
  recentTemplateIds: string[];
  drafts: Draft[];
};

export class CardStudioPrefsService {
  async load(): Promise<CardStudioPrefs> {
    const [favoriteTemplateIds, recentTemplateIds, drafts] = await Promise.all([
      settingsRepository.getJson<string[]>(KEYS.favoriteTemplateIds),
      settingsRepository.getJson<string[]>(KEYS.recentTemplateIds),
      settingsRepository.getJson<Draft[]>(KEYS.drafts),
    ]);
    return {
      favoriteTemplateIds: favoriteTemplateIds ?? [],
      recentTemplateIds: recentTemplateIds ?? [],
      drafts: drafts ?? [],
    };
  }

  async saveFavorites(ids: string[]): Promise<void> {
    await settingsRepository.setJson(KEYS.favoriteTemplateIds, ids);
  }

  async saveRecents(ids: string[]): Promise<void> {
    await settingsRepository.setJson(KEYS.recentTemplateIds, ids);
  }

  async saveDrafts(drafts: Draft[]): Promise<void> {
    await settingsRepository.setJson(KEYS.drafts, drafts.slice(0, 50));
  }

  async loadAiTemplates(): Promise<SavedWishTemplate[]> {
    return (await settingsRepository.getJson<SavedWishTemplate[]>(KEYS.aiSavedTemplates)) ?? [];
  }

  async saveAiTemplates(templates: SavedWishTemplate[]): Promise<void> {
    await settingsRepository.setJson(KEYS.aiSavedTemplates, templates.slice(0, 50));
  }
}

export const cardStudioPrefsService = new CardStudioPrefsService();
