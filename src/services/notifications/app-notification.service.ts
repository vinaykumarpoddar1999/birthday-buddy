import { notificationRepository } from '@/repositories/notification.repository';
import type { AppNotification } from '@features/profile/types';

export class AppNotificationService {
  async list(limit = 50): Promise<AppNotification[]> {
    const rows = await notificationRepository.findAll(limit);
    return rows.map((r) => ({
      id: r.id,
      type: r.type as AppNotification['type'],
      title: r.title,
      message: r.message,
      timestamp: r.createdAt,
      isRead: r.isRead,
    }));
  }

  async add(
    notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>,
  ): Promise<string> {
    return notificationRepository.insert(
      notification.title,
      notification.message,
      notification.type,
    );
  }

  async markRead(id: string): Promise<void> {
    await notificationRepository.markRead(id);
  }

  async markAllRead(): Promise<void> {
    await notificationRepository.markAllRead();
  }

  async delete(id: string): Promise<void> {
    await notificationRepository.delete(id);
  }

  async clearAll(): Promise<void> {
    await notificationRepository.clearAll();
  }

  async unreadCount(): Promise<number> {
    return notificationRepository.countUnread();
  }

  async seedWelcomeIfEmpty(): Promise<void> {
    const rows = await notificationRepository.findAll(1);
    if (rows.length > 0) return;
    await notificationRepository.insert(
      'Welcome to BirthdayBuddy!',
      'Start by adding friends and family. All data stays on your device.',
      'system',
    );
  }
}

export const appNotificationService = new AppNotificationService();
