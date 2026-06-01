import type { CardTemplate } from '../../types';

export const luxuryGoldTemplate: CardTemplate = {
  id: 'luxury-gold',
  name: 'Luxury Birthday Gold',
  category: 'luxury',
  tags: ['birthday', 'luxury', 'gold', 'premium', 'elegant', 'dark'],
  isPremium: true,
  isTrending: true,
  background: {
    type: 'gradient',
    value: ['#1a0a00', '#2d1700', '#1a0a00'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#F59E0B', secondary: '#D97706', text: '#FEF3C7', accent: '#FBBF24' },
  fonts: { heading: 'System', body: 'System' },
  placeholders: { recipientName: 'Riya', message: 'Wishing you endless happiness & success', senderName: 'With Love' },
  decorations: ['icon:sparkles', 'icon:crown', 'icon:cake'],
  layout: 'portrait',
  elements: [
    { id: 'lg-1', type: 'sticker', content: 'icon:sparkles', x: 20, y: 20, width: 30, height: 30, rotation: 0, opacity: 0.5, zIndex: 1, visible: true, fontSize: 20 },
    { id: 'lg-2', type: 'sticker', content: 'icon:crown', x: 285, y: 22, width: 30, height: 30, rotation: 0, opacity: 0.6, zIndex: 1, visible: true, fontSize: 22 },
    { id: 'lg-3', type: 'text', content: 'Happy\nBirthday', x: 30, y: 70, width: 280, height: 90, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 34, fontWeight: '700', color: '#F59E0B', textAlign: 'center', lineHeight: 44 },
    { id: 'lg-4', type: 'text', content: '{{recipientName}}', x: 30, y: 175, width: 280, height: 50, rotation: 0, opacity: 1, zIndex: 3, visible: true, fontSize: 42, fontWeight: '800', color: '#FBBF24', textAlign: 'center', isPlaceholder: true, placeholderKey: 'recipientName' },
    { id: 'lg-5', type: 'sticker', content: 'icon:cake', x: 142, y: 245, width: 56, height: 56, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 48 },
    { id: 'lg-6', type: 'text', content: '{{message}}', x: 35, y: 325, width: 270, height: 55, rotation: 0, opacity: 0.85, zIndex: 2, visible: true, fontSize: 14, fontWeight: '400', color: '#FEF3C7', textAlign: 'center', lineHeight: 20, isPlaceholder: true, placeholderKey: 'message' },
    { id: 'lg-7', type: 'text', content: '{{senderName}}', x: 35, y: 410, width: 270, height: 25, rotation: 0, opacity: 0.7, zIndex: 2, visible: true, fontSize: 13, fontWeight: '600', color: '#D97706', textAlign: 'center', isPlaceholder: true, placeholderKey: 'senderName' },
    { id: 'lg-8', type: 'sticker', content: 'icon:star', x: 155, y: 445, width: 25, height: 25, rotation: 0, opacity: 0.4, zIndex: 1, visible: true, fontSize: 18 },
  ],
};
