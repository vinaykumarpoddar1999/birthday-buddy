import { searchRepository } from '@/repositories/search.repository';
import { settingsRepository } from '@/repositories/settings.repository';
import type { SearchResult } from '@/types/entities';

const SETTINGS_SEARCH: { key: string; title: string; routeKey: string }[] = [
  { key: 'reminder-settings', title: 'Reminder Settings', routeKey: 'reminder-settings' },
  { key: 'backup', title: 'Backup & Restore', routeKey: 'backup-restore' },
  { key: 'import', title: 'Import Data', routeKey: 'import-data' },
  { key: 'help', title: 'FAQ', routeKey: 'help-faq' },
  { key: 'personal-info', title: 'Personal Information', routeKey: 'personal-info' },
];

export class SearchService {
  async search(query: string): Promise<SearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const [ftsResults, settingsMatch] = await Promise.all([
      searchRepository.searchFts(trimmed),
      this.searchSettings(trimmed),
    ]);

    const seen = new Set<string>();
    const merged: SearchResult[] = [];
    for (const r of [...ftsResults, ...settingsMatch]) {
      const key = `${r.entityType}:${r.entityUuid}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(r);
    }
    return merged;
  }

  private async searchSettings(query: string): Promise<SearchResult[]> {
    const q = query.toLowerCase();
    const settings = await settingsRepository.getAllSettings();
    const matches: SearchResult[] = [];

    for (const item of SETTINGS_SEARCH) {
      if (item.title.toLowerCase().includes(q) || item.key.includes(q)) {
        matches.push({
          entityType: 'settings',
          entityUuid: item.key,
          title: item.title,
          body: item.routeKey,
        });
      }
    }

    if (settings.reminderTime && 'reminder'.includes(q)) {
      matches.push({
        entityType: 'settings',
        entityUuid: 'reminder-settings',
        title: 'Reminder Settings',
        body: 'reminder-settings',
      });
    }

    return matches;
  }
}

export const searchService = new SearchService();
