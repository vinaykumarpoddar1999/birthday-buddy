import { activityLogRepository } from '@/repositories/activity-log.repository';
import { settingsRepository } from '@/repositories/settings.repository';
import type { AppSettings } from '@/types/entities';

export class SettingsService {
  async getAll(): Promise<AppSettings> {
    return settingsRepository.getAllSettings();
  }

  async update(partial: Partial<AppSettings>): Promise<void> {
    await settingsRepository.saveAll(partial);
    await activityLogRepository.log('settings_changed', 'settings', undefined, partial);
  }
}

export const settingsService = new SettingsService();
