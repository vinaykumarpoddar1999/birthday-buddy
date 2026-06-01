import type { CardTemplate as StudioCardTemplate } from '@features/card-studio/types';

import type { CardTemplate } from '@/types/entities';

import { cardRepository } from './card.repository';

/** Template data access — delegates to CardRepository template methods. */
export class TemplateRepository {
  async upsertStudioTemplate(template: StudioCardTemplate): Promise<void> {
    return cardRepository.upsertStudioTemplate(template);
  }

  async findStudioTemplates(limit = 100): Promise<StudioCardTemplate[]> {
    return cardRepository.findStudioTemplates(limit);
  }

  async findTemplates(limit = 50): Promise<CardTemplate[]> {
    return cardRepository.findTemplates(limit);
  }

  async findTemplateByUuid(uuid: string): Promise<CardTemplate | null> {
    return cardRepository.findTemplateByUuid(uuid);
  }

  async getTemplateInternalId(uuid: string): Promise<number | null> {
    return cardRepository.getTemplateInternalId(uuid);
  }
}

export const templateRepository = new TemplateRepository();
