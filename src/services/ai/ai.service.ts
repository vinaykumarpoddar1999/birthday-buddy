import { generateWish as localGenerateWish } from '@features/ai-wishes/engine/wish-generator';
import type { GenerateWishParams } from '@features/ai-wishes/engine/wish-generator';

export type GenerateWishInput = {
  contactId: string;
  contactName: string;
  tone?: string;
  language?: string;
};

export async function generateWish(input: GenerateWishInput): Promise<{ text: string }> {
  const wish = localGenerateWish({
    tone: (input.tone as GenerateWishParams['tone']) ?? 'heartfelt',
    length: 'medium',
    language: (input.language as GenerateWishParams['language']) ?? 'english',
    personId: input.contactId,
    personName: input.contactName,
    relationship: 'friend',
    personalContext: '',
    age: 25,
  });
  return { text: wish.text };
}

export async function createCard(): Promise<{ imageUrl: string }> {
  return { imageUrl: '' };
}
