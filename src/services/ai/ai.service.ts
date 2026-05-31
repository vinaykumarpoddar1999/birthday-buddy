import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';

export type GenerateWishInput = {
  contactId: string;
  contactName: string;
  tone?: string;
  language?: string;
};

export type SuggestGiftInput = {
  contactId: string;
  contactName: string;
  age?: number;
  interests?: string;
};

export type CreateCardInput = {
  contactId: string;
  templateId?: string;
  message?: string;
};

async function invokeEdgeFunction<TResponse>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<TResponse> {
  const { data, error } = await supabase.functions.invoke(functionName, { body });

  if (error) {
    throw handleApiError(error);
  }

  return data as TResponse;
}

export async function generateWish(input: GenerateWishInput): Promise<{ text: string }> {
  return invokeEdgeFunction('generate-wish', input);
}

export async function suggestGift(input: SuggestGiftInput): Promise<{ suggestions: string[] }> {
  return invokeEdgeFunction('suggest-gift', input);
}

export async function createCardContent(
  input: CreateCardInput,
): Promise<{ content: string; imagePrompt?: string }> {
  return invokeEdgeFunction('create-card', input);
}
