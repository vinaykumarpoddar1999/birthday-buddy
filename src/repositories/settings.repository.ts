import type { AppSettings } from '@/types/entities';
import { DEFAULT_SETTINGS } from '@/types/entities';

import { BaseRepository } from './base-repository';

export class SettingsRepository extends BaseRepository {
  async get(key: string): Promise<string | null> {
    const row = await this.getFirst<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      [key],
    );
    return row?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    const now = this.now();
    await this.run(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      [key, value, now],
    );
  }

  async getAllSettings(): Promise<AppSettings> {
    const keys = Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[];
    const settings = { ...DEFAULT_SETTINGS };

    for (const key of keys) {
      const val = await this.get(key);
      if (val === null) continue;
      if (key === 'notificationsEnabled' || key === 'backupAuto') {
        settings[key] = val === 'true';
      } else if (key === 'theme') {
        if (val === 'light' || val === 'dark' || val === 'system') {
          settings.theme = val;
        }
      } else {
        (settings as unknown as Record<string, string>)[key] = val;
      }
    }

    return settings;
  }

  async saveAll(settings: Partial<AppSettings>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      if (value === undefined) continue;
      await this.set(key, typeof value === 'boolean' ? String(value) : String(value));
    }
  }

  async hasLegacyImportDone(): Promise<boolean> {
    const val = await this.get('legacy_import_done');
    return val === 'true';
  }

  async markLegacyImportDone(): Promise<void> {
    await this.set('legacy_import_done', 'true');
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }
}

export const settingsRepository = new SettingsRepository();
