import type { CardTemplate } from '../../types';

export const photoCardTemplate: CardTemplate = {
  id: 'photo-card',
  name: 'Photo Memory Card',
  category: 'photo',
  tags: ['birthday', 'photo', 'personal', 'custom', 'modern'],
  isPremium: true,
  isTrending: true,
  background: {
    type: 'gradient',
    value: ['#7C3AED', '#5B21B6', '#4C1D95'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#FFFFFF', secondary: '#C4B5FD', text: '#FFFFFF', accent: '#A78BFA' },
  fonts: { heading: 'System', body: 'System' },
  placeholders: { recipientName: 'Riya', message: 'Another year of beautiful memories together!', senderName: 'With Love' },
  decorations: ['📸', '💜', '✨'],
  layout: 'portrait',
  elements: [
    { id: 'pc-1', type: 'sticker', content: '✨', x: 20, y: 18, width: 24, height: 24, rotation: 0, opacity: 0.5, zIndex: 1, visible: true, fontSize: 18 },
    { id: 'pc-2', type: 'text', content: 'Happy Birthday', x: 30, y: 30, width: 280, height: 35, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 26, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
    { id: 'pc-3', type: 'image', x: 80, y: 85, width: 180, height: 180, rotation: 0, opacity: 1, zIndex: 2, visible: true, isPlaceholder: true, placeholderKey: 'photo', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 90, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', content: '📸', fontSize: 44 },
    { id: 'pc-4', type: 'text', content: '{{recipientName}}', x: 30, y: 285, width: 280, height: 45, rotation: 0, opacity: 1, zIndex: 3, visible: true, fontSize: 36, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', isPlaceholder: true, placeholderKey: 'recipientName' },
    { id: 'pc-5', type: 'text', content: '{{message}}', x: 35, y: 345, width: 270, height: 50, rotation: 0, opacity: 0.85, zIndex: 2, visible: true, fontSize: 13, fontWeight: '400', color: '#E0E7FF', textAlign: 'center', lineHeight: 19, isPlaceholder: true, placeholderKey: 'message' },
    { id: 'pc-6', type: 'text', content: '{{senderName}}', x: 35, y: 415, width: 270, height: 22, rotation: 0, opacity: 0.6, zIndex: 2, visible: true, fontSize: 12, fontWeight: '600', color: '#C4B5FD', textAlign: 'center', isPlaceholder: true, placeholderKey: 'senderName' },
    { id: 'pc-7', type: 'sticker', content: '💜', x: 158, y: 448, width: 24, height: 24, rotation: 0, opacity: 0.4, zIndex: 1, visible: true, fontSize: 18 },
  ],
};
