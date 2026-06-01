import type {
  CardElement,
  CardTemplate as StudioCardTemplate,
  PersonalizationData,
} from '@features/card-studio/types';

import { refreshActivityFeed } from '@/services/activity/activity-sync.service';
import { DatabaseManager } from '@/database/database-manager';
import { syncCardTemplatesFromRegistry } from '@/database/sync-card-templates';
import { cardRepository } from '@/repositories/card.repository';
import { peopleRepository } from '@/repositories/people.repository';
import { activityLogRepository } from '@/repositories/activity-log.repository';
import type { CardRecord, CardTemplate } from '@/types/entities';

export class CardService {
  async syncTemplatesFromRegistry(getTemplates: () => StudioCardTemplate[]): Promise<void> {
    await syncCardTemplatesFromRegistry(getTemplates);
  }

  async listStudioTemplates(): Promise<StudioCardTemplate[]> {
    const fromDb = await cardRepository.findStudioTemplates(200);
    if (fromDb.length > 0) return fromDb;
    return [];
  }

  async listTemplates(): Promise<CardTemplate[]> {
    return cardRepository.findTemplates();
  }

  async getTemplate(uuid: string): Promise<CardTemplate | null> {
    return cardRepository.findTemplateByUuid(uuid);
  }

  async saveCard(
    personUuid: string | undefined,
    templateUuid: string | undefined,
    cardJson: string,
    thumbnailUri?: string,
    exportUri?: string,
  ): Promise<string> {
    const uuid = await DatabaseManager.withTransaction(async () => {
      let personId: number | null = null;
      if (personUuid) {
        personId = await peopleRepository.getInternalId(personUuid);
      }
      let templateId: number | null = null;
      if (templateUuid) {
        templateId = await cardRepository.getTemplateInternalId(templateUuid);
      }

      const newUuid = await cardRepository.insert(
        personId,
        templateId,
        cardJson,
        thumbnailUri,
        exportUri,
      );
      await activityLogRepository.log('created_card', 'card', newUuid, { personUuid });
      return newUuid;
    });
    await refreshActivityFeed();
    return uuid;
  }

  async listByPerson(personUuid: string): Promise<CardRecord[]> {
    return cardRepository.findByPersonUuid(personUuid);
  }

  async countSaved(): Promise<number> {
    return cardRepository.countSaved();
  }

  async listSaved(limit = 100): Promise<CardRecord[]> {
    return cardRepository.findAll(limit);
  }

  async logShared(cardUuid: string, sharedTo: string): Promise<void> {
    await activityLogRepository.log('shared_card', 'card', cardUuid, { sharedTo });
    await refreshActivityFeed();
  }

  async saveStudioCard(input: {
    personUuid?: string | null;
    templateId?: string | null;
    personalization: PersonalizationData;
    elements: CardElement[];
    thumbnailUri?: string;
    exportUri?: string;
  }): Promise<string> {
    const cardJson = JSON.stringify({
      personalization: input.personalization,
      elements: input.elements,
      templateId: input.templateId,
    });
    return this.saveCard(
      input.personUuid ?? undefined,
      input.templateId ?? undefined,
      cardJson,
      input.thumbnailUri,
      input.exportUri,
    );
  }
}

export const cardService = new CardService();
