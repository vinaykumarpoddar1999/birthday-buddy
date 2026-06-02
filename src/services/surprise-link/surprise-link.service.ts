import type { ReactionType, ReplyType, SurpriseExperience } from '@features/surprise-link/types';
import { generateExperienceId, generateSlug, buildShareLink, buildShortUrl } from '@features/surprise-link/utils/link-generator';
import { getCompletionRate } from '@features/surprise-link/utils/validation';

import { refreshActivityFeed } from '@/services/activity/activity-sync.service';
import { DatabaseManager } from '@/database/database-manager';
import { surpriseLinkRepository } from '@/repositories/surprise-link.repository';
import { peopleRepository } from '@/repositories/people.repository';
import { activityLogRepository } from '@/repositories/activity-log.repository';

export class SurpriseLinkService {
  async saveExperience(experience: SurpriseExperience): Promise<string> {
    const uuid = await DatabaseManager.withTransaction(async () => {
      let personId: number | null = null;
      if (experience.personId) {
        personId = await peopleRepository.getInternalId(experience.personId);
      }

      const existing = experience.id
        ? await surpriseLinkRepository.findByUuid(experience.id)
        : null;

      if (existing) {
        await surpriseLinkRepository.update(experience.id, experience);
        await activityLogRepository.log('updated_surprise_link', 'surprise', experience.id, {
          slug: experience.slug,
        });
        return experience.id;
      }

      const id = experience.id || (await generateExperienceId());
      const full: SurpriseExperience = { ...experience, id };
      const newUuid = await surpriseLinkRepository.insert(full, personId);
      await activityLogRepository.log('created_surprise_link', 'surprise', newUuid, {
        slug: experience.slug,
        personId: experience.personId,
      });
      return newUuid;
    });
    await refreshActivityFeed();
    return uuid;
  }

  async publishExperience(experience: SurpriseExperience): Promise<SurpriseExperience> {
    const slug = experience.slug || (await generateSlug());
    const id = experience.id || (await generateExperienceId());
    const now = new Date().toISOString();
    const published: SurpriseExperience = {
      ...experience,
      id,
      slug,
      shareLink: buildShareLink(slug),
      shortUrl: buildShortUrl(slug),
      status: 'published',
      publishedAt: now,
      updatedAt: now,
    };
    await this.saveExperience(published);
    await activityLogRepository.log('published_surprise_link', 'surprise', id, { slug });
    await refreshActivityFeed();
    return published;
  }

  async getBySlug(slug: string): Promise<SurpriseExperience | null> {
    return surpriseLinkRepository.findBySlug(slug);
  }

  async getById(uuid: string): Promise<SurpriseExperience | null> {
    return surpriseLinkRepository.findByUuid(uuid);
  }

  async listExperiences(limit = 50): Promise<SurpriseExperience[]> {
    return surpriseLinkRepository.findAll(limit);
  }

  async listByPerson(personUuid: string): Promise<SurpriseExperience[]> {
    const personId = await peopleRepository.getInternalId(personUuid);
    if (!personId) return [];
    return surpriseLinkRepository.findByPersonId(personId);
  }

  async recordView(experienceId: string, sectionId?: string): Promise<void> {
    await surpriseLinkRepository.recordView(experienceId, sectionId);
  }

  async addReaction(experienceId: string, type: ReactionType) {
    return surpriseLinkRepository.addReaction(experienceId, type);
  }

  async addReply(experienceId: string, type: ReplyType, content: string, mediaUri?: string) {
    return surpriseLinkRepository.addReply(experienceId, type, content, mediaUri);
  }

  async getAnalytics(experienceId: string) {
    return surpriseLinkRepository.getAnalytics(experienceId);
  }

  async updateCompletion(experience: SurpriseExperience, viewedSections: string[]): Promise<void> {
    const rate = getCompletionRate(experience, viewedSections);
    await surpriseLinkRepository.updateCompletionRate(experience.id, rate);
  }

  async countPublished(): Promise<number> {
    return surpriseLinkRepository.countPublished();
  }
}

export const surpriseLinkService = new SurpriseLinkService();
