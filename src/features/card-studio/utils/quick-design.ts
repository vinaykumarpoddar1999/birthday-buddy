import type { CardElement, CardTemplate, PersonalizationData } from '../types';

const THEME_BACKGROUNDS: Record<string, CardTemplate['background']> = {
  luxury: { type: 'gradient', value: ['#F59E0B', '#92400E'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 1 } },
  cute: { type: 'gradient', value: ['#FCE7F3', '#F472B6'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 1 } },
  modern: { type: 'gradient', value: ['#1F2937', '#6366F1'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 0 } },
  romantic: { type: 'gradient', value: ['#FDA4AF', '#BE185D'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 1 } },
  party: { type: 'gradient', value: ['#8B5CF6', '#EC4899', '#F97316'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 1 } },
};

export function applyQuickDesign(
  template: CardTemplate,
  personalization: PersonalizationData,
  theme: string,
): { elements: CardElement[]; background: CardTemplate['background'] } {
  const elements = template.elements.map((el) => ({ ...el }));
  const bg = THEME_BACKGROUNDS[theme] ?? template.background;

  const name = personalization.recipientName || 'Friend';
  const age = personalization.age ? `Turning ${personalization.age}!` : '';
  const message = personalization.message || `Wishing you the happiest birthday, ${name}!`;
  const signature = personalization.signature || personalization.senderName || '';

  elements.forEach((el) => {
    if (el.type !== 'text') return;
    if (el.placeholderKey === 'recipientName' || el.content?.includes('{{recipientName}}')) {
      el.content = name;
    }
    if (el.placeholderKey === 'message' || el.content?.includes('{{message}}')) {
      el.content = message;
    }
    if (el.placeholderKey === 'age' || el.content?.includes('{{age}}')) {
      el.content = age;
    }
    if (el.placeholderKey === 'signature' || el.content?.includes('{{signature}}')) {
      el.content = signature;
    }
  });

  if (personalization.photoUri) {
    const photoEl = elements.find((e) => e.type === 'image' && e.placeholderKey === 'photo');
    if (photoEl) {
      photoEl.uri = personalization.photoUri;
    }
  }

  return { elements, background: bg };
}
