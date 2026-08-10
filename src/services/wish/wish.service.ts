import { DatabaseManager } from '@/database/database-manager';
import {
  formatGeneratedWishText,
  generateWish,
  type GenerateWishParams,
} from '@features/ai-wishes/engine/wish-generator';
import { birthdayWishService } from '@/services/wish/birthday-wish.service';
import type {
  GeneratedWish,
  WishLanguage,
  WishLength,
  WishRelationship,
  WishTone,
} from '@features/ai-wishes/types';
import { peopleRepository } from '@/repositories/people.repository';
import { wishRepository } from '@/repositories/wish.repository';
import { activityLogRepository } from '@/repositories/activity-log.repository';
import { refreshActivityFeed } from '@/services/activity/activity-sync.service';
import type { AiWish } from '@/types/entities';

function mapRelationship(rel: string): WishRelationship {
  const map: Record<string, WishRelationship> = {
    friend: 'friend',
    family: 'family',
    partner: 'partner',
    colleague: 'colleague',
    relative: 'relative',
  };
  return map[rel] ?? 'general';
}

export class WishService {
  buildGeneratedWish(
    personUuid: string,
    personName: string,
    relationship: string,
    params: Omit<GenerateWishParams, 'personId' | 'personName' | 'relationship'>,
  ): GeneratedWish {
    const generated = generateWish({
      ...params,
      personId: personUuid,
      personName,
      relationship,
    });
    const catalogFallback = birthdayWishService.getWishByRelationship(
      relationship,
      personName,
    );
    const text = generated.text?.trim()
      ? generated.text
      : formatGeneratedWishText(catalogFallback, {
        personName,
        personalContext: params.personalContext,
        language: params.language ?? 'english',
      });
    return { ...generated, text, originalText: text };
  }

  private toGeneratedWish(
    wish: AiWish,
    meta: {
      personName: string;
      tone: WishTone;
      length: WishLength;
      language: WishLanguage;
      relationship: string;
      personalContext: string;
      isEdited?: boolean;
    },
  ): GeneratedWish {
    return {
      id: wish.id,
      text: wish.wishText,
      tone: meta.tone,
      length: meta.length,
      language: meta.language,
      personId: wish.personId,
      personName: meta.personName,
      relationship: mapRelationship(meta.relationship),
      personalContext: meta.personalContext,
      createdAt: wish.createdAt,
      isFavorite: wish.favorite,
      isEdited: meta.isEdited ?? false,
      originalText: wish.wishText,
    };
  }

  async generateAndSave(
    personUuid: string,
    params: Omit<GenerateWishParams, 'personId' | 'personName'>,
  ): Promise<GeneratedWish> {
    const person = await peopleRepository.findByUuid(personUuid);
    if (!person) throw new Error('Person not found');

    const generated = this.buildGeneratedWish(
      personUuid,
      person.fullName,
      person.relationship,
      params,
    );

    const wishUuid = await DatabaseManager.withTransaction(async () => {
      const personId = await peopleRepository.getInternalId(personUuid);
      if (!personId) throw new Error('Person not found');

      const uuid = await wishRepository.insert(
        personId,
        generated.text,
        params.tone,
        params.language,
        'local',
      );
      const wishId = await wishRepository.getWishInternalId(uuid);
      await wishRepository.insertHistory(personId, wishId, 'generated');
      await activityLogRepository.log('generated_wish', 'person', personUuid, {
        tone: params.tone,
      });
      return uuid;
    });

    await refreshActivityFeed();

    const saved = await wishRepository.findByPersonUuid(personUuid, 1);
    const wish = saved.find((w) => w.id === wishUuid) ?? saved[0];
    if (wish) {
      const mapped = this.toGeneratedWish(wish, {
        personName: person.fullName,
        tone: params.tone,
        length: params.length,
        language: params.language,
        relationship: person.relationship,
        personalContext: params.personalContext ?? '',
      });
      return { ...mapped, originalText: generated.originalText };
    }

    return { ...generated, id: wishUuid };
  }

  async listByPerson(personUuid: string): Promise<AiWish[]> {
    return wishRepository.findByPersonUuid(personUuid);
  }

  async getHistory(personUuid?: string) {
    return wishRepository.findHistory(personUuid);
  }

  async listAllRecent(limit = 100) {
    return wishRepository.findAllRecent(limit);
  }

  async toggleFavorite(uuid: string, favorite: boolean): Promise<void> {
    await wishRepository.setFavorite(uuid, favorite);
  }

  async updateText(uuid: string, text: string): Promise<void> {
    await wishRepository.updateWishText(uuid, text);
  }

  async logShare(uuid: string, sharedTo: string): Promise<void> {
    const personId = await wishRepository.getPersonIdForWish(uuid);
    if (!personId) return;
    const wishId = await wishRepository.getWishInternalId(uuid);
    await wishRepository.insertHistory(personId, wishId, 'shared', sharedTo);
    await activityLogRepository.log('shared_wish', 'wish', uuid, { sharedTo });
    await refreshActivityFeed();
  }

  async delete(uuid: string): Promise<void> {
    await wishRepository.softDelete(uuid);
  }
}

export const wishService = new WishService();
