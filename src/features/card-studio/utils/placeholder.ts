import type { CardElement, PersonalizationData } from '../types';

const PLACEHOLDER_MAP: Record<string, keyof PersonalizationData> = {
  recipientName: 'recipientName',
  senderName: 'senderName',
  age: 'age',
  relationship: 'relationship',
  message: 'message',
  quote: 'quote',
  emoji: 'emoji',
  eventType: 'eventType',
  date: 'date',
  location: 'location',
  signature: 'signature',
  additionalNote: 'additionalNote',
  photo: 'photoUri',
};

export function resolveText(
  text: string,
  data: PersonalizationData,
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const field = PLACEHOLDER_MAP[key];
    if (field) {
      const val = data[field];
      return (val as string) || match;
    }
    return match;
  });
}

export function resolveElements(
  elements: CardElement[],
  data: PersonalizationData,
): CardElement[] {
  return elements.map((el) => {
    if (el.type === 'text' && el.content) {
      return { ...el, content: resolveText(el.content, data) };
    }
    if (el.type === 'image' && el.placeholderKey === 'photo' && data.photoUri) {
      return { ...el, uri: data.photoUri };
    }
    return el;
  });
}
