import type { CardTemplate } from '../../types';

export const cutePinkTemplate: CardTemplate = {
  id: 'cute-pink',
  name: 'Cute Pink Birthday',
  category: 'cute',
  tags: ['birthday', 'cute', 'pink', 'pastel', 'sweet'],
  isPremium: false,
  isTrending: true,
  background: {
    type: 'gradient',
    value: ['#FFF0F5', '#FFE4F0', '#FFF0F5'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#EC4899', secondary: '#F472B6', text: '#831843', accent: '#FB7185' },
  fonts: { heading: 'System', body: 'System' },
  placeholders: { recipientName: 'Riya', message: 'May your day be as special as you are!', senderName: 'With Love' },
  decorations: ['🎀', '💖', '🧁'],
  layout: 'portrait',
  elements: [
    { id: 'cp-1', type: 'sticker', content: '🎀', x: 22, y: 20, width: 28, height: 28, rotation: -10, opacity: 0.7, zIndex: 1, visible: true, fontSize: 20 },
    { id: 'cp-2', type: 'sticker', content: '💖', x: 288, y: 22, width: 28, height: 28, rotation: 8, opacity: 0.7, zIndex: 1, visible: true, fontSize: 20 },
    { id: 'cp-3', type: 'text', content: 'Happy\nBirthday', x: 30, y: 65, width: 280, height: 90, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 34, fontWeight: '700', color: '#EC4899', textAlign: 'center', lineHeight: 44 },
    { id: 'cp-4', type: 'text', content: '{{recipientName}}', x: 30, y: 170, width: 280, height: 50, rotation: 0, opacity: 1, zIndex: 3, visible: true, fontSize: 40, fontWeight: '800', color: '#BE185D', textAlign: 'center', isPlaceholder: true, placeholderKey: 'recipientName' },
    { id: 'cp-5', type: 'sticker', content: '🧁', x: 142, y: 240, width: 56, height: 56, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 48 },
    { id: 'cp-6', type: 'text', content: '{{message}}', x: 35, y: 320, width: 270, height: 55, rotation: 0, opacity: 0.9, zIndex: 2, visible: true, fontSize: 14, fontWeight: '400', color: '#9D174D', textAlign: 'center', lineHeight: 20, isPlaceholder: true, placeholderKey: 'message' },
    { id: 'cp-7', type: 'text', content: '{{senderName}}', x: 35, y: 405, width: 270, height: 25, rotation: 0, opacity: 0.7, zIndex: 2, visible: true, fontSize: 13, fontWeight: '600', color: '#DB2777', textAlign: 'center', isPlaceholder: true, placeholderKey: 'senderName' },
    { id: 'cp-8', type: 'sticker', content: '🌸', x: 155, y: 445, width: 25, height: 25, rotation: 0, opacity: 0.5, zIndex: 1, visible: true, fontSize: 18 },
  ],
};
