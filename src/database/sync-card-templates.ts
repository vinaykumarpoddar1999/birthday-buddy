import type { CardTemplate } from '@features/card-studio/types';

import { cardRepository } from '@/repositories/card.repository';

/** Ensures in-app template registry is mirrored in SQLite (source of truth for sync). */
export async function syncCardTemplatesFromRegistry(
  getTemplates: () => CardTemplate[],
): Promise<void> {
  const templates = getTemplates();
  for (const template of templates) {
    await cardRepository.upsertStudioTemplate(template);
  }
}
