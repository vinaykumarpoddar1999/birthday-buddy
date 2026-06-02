import { searchRepository } from '@/repositories/search.repository';
import { settingsRepository } from '@/repositories/settings.repository';
import type { SearchResult } from '@/types/entities';

const SETTINGS_SEARCH: { key: string; title: string; routeKey: string }[] = [
  { key: 'notification', title: 'Notification Preferences', routeKey: 'notification-prefs' },
  { key: 'reminder', title: 'Reminder Settings', routeKey: 'reminder-settings' },
  { key: 'reminder-time', title: 'Reminder Time', routeKey: 'reminder-time' },
  { key: 'backup', title: 'Backup & Restore', routeKey: 'backup-restore' },
  { key: 'import', title: 'Import Data', routeKey: 'import-data' },
  { key: 'calendar', title: 'Calendar Sync', routeKey: 'calendar-sync' },
  { key: 'help', title: 'Help & FAQ', routeKey: 'help-faq' },
  { key: 'privacy', title: 'Privacy & Security', routeKey: 'privacy-security' },
  { key: 'export', title: 'Export Data', routeKey: 'export-data' },
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
      if (
        q.includes(item.key) ||
        item.title.toLowerCase().includes(q) ||
        String(settings[item.key as keyof typeof settings] ?? '')
          .toLowerCase()
          .includes(q)
      ) {
        matches.push({
          entityType: 'settings',
          entityUuid: item.routeKey,
          title: item.title,
          body: item.routeKey,
        });
      }
    }

    return matches;
  }
}

export const searchService = new SearchService();
