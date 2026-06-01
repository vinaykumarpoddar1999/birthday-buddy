import { feedbackRepository } from '@/repositories/feedback.repository';
import { activityLogRepository } from '@/repositories/activity-log.repository';
import type { FeedbackEntry } from '@features/profile/types';

export class FeedbackService {
  async submit(
    subject: string,
    category: FeedbackEntry['category'],
    message: string,
  ): Promise<FeedbackEntry> {
    const id = await feedbackRepository.insert(subject, category, message);
    await activityLogRepository.log('feedback_submitted', 'feedback', id, { category, subject });
    return {
      id,
      subject,
      category,
      message,
      createdAt: new Date().toISOString(),
    };
  }

  async list(limit = 50): Promise<FeedbackEntry[]> {
    const rows = await feedbackRepository.findAll(limit);
    return rows.map((r) => ({
      id: r.id,
      subject: r.subject,
      category: r.category as FeedbackEntry['category'],
      message: r.message,
      createdAt: r.createdAt,
    }));
  }
}

export const feedbackService = new FeedbackService();
