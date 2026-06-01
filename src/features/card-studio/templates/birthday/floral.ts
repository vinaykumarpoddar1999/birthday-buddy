import type { CardTemplate } from '../../types';

export const floralTemplate: CardTemplate = {
  id: 'floral',
  name: 'Elegant Floral',
  category: 'floral',
  tags: ['birthday', 'floral', 'elegant', 'flowers', 'feminine'],
  isPremium: false,
  isTrending: true,
  background: {
    type: 'gradient',
    value: ['#FFFBF0', '#FEF3C7', '#FFFBF0'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 0, y: 1 },
  },
  colors: { primary: '#F43F5E', secondary: '#FB7185', text: '#4C1D95', accent: '#E11D48' },
  fonts: { heading: 'System', body: 'System' },
  placeholders: { recipientName: 'Riya', message: 'Wishing you endless happiness on your special day', senderName: 'With Love' },
  decorations: ['icon:flower', 'icon:flower2', 'icon:flower2'],
  layout: 'portrait',
  elements: [
    { id: 'fl-1', type: 'sticker', content: 'icon:flower', x: 18, y: 18, width: 30, height: 30, rotation: -12, opacity: 0.7, zIndex: 1, visible: true, fontSize: 22 },
    { id: 'fl-2', type: 'sticker', content: 'icon:flower2', x: 288, y: 20, width: 30, height: 30, rotation: 10, opacity: 0.7, zIndex: 1, visible: true, fontSize: 22 },
    { id: 'fl-3', type: 'text', content: 'Happy\nBirthday', x: 30, y: 70, width: 280, height: 90, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 34, fontWeight: '700', color: '#F43F5E', textAlign: 'center', lineHeight: 44 },
    { id: 'fl-4', type: 'text', content: '{{recipientName}}', x: 30, y: 175, width: 280, height: 50, rotation: 0, opacity: 1, zIndex: 3, visible: true, fontSize: 42, fontWeight: '800', color: '#9F1239', textAlign: 'center', isPlaceholder: true, placeholderKey: 'recipientName' },
    { id: 'fl-5', type: 'sticker', content: 'icon:flower2', x: 142, y: 245, width: 56, height: 56, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 48 },
    { id: 'fl-6', type: 'text', content: '{{message}}', x: 35, y: 325, width: 270, height: 55, rotation: 0, opacity: 0.85, zIndex: 2, visible: true, fontSize: 14, fontWeight: '400', color: '#6B2150', textAlign: 'center', lineHeight: 20, isPlaceholder: true, placeholderKey: 'message' },
    { id: 'fl-7', type: 'text', content: '{{senderName}}', x: 35, y: 410, width: 270, height: 25, rotation: 0, opacity: 0.7, zIndex: 2, visible: true, fontSize: 13, fontWeight: '600', color: '#E11D48', textAlign: 'center', isPlaceholder: true, placeholderKey: 'senderName' },
    { id: 'fl-8', type: 'sticker', content: 'icon:flower2', x: 155, y: 445, width: 25, height: 25, rotation: 0, opacity: 0.5, zIndex: 1, visible: true, fontSize: 18 },
  ],
};
