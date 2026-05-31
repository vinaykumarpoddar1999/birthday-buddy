import { suggestGift } from '@services/ai';
import type { SuggestGiftsParams } from '../types';

export async function fetchGiftSuggestions(params: SuggestGiftsParams) {
  const result = await suggestGift(params);
  return {
    id: `${params.contactId}-${Date.now()}`,
    contactId: params.contactId,
    suggestions: result.suggestions,
    createdAt: new Date().toISOString(),
  };
}
