import type { CardTemplate } from '../../types';

export const neonPartyTemplate: CardTemplate = {
  id: 'neon-party',
  name: 'Neon Birthday Party',
  category: 'neon',
  tags: ['birthday', 'neon', 'party', 'dark', 'glow', 'modern'],
  isPremium: false,
  isTrending: true,
  background: {
    type: 'gradient',
    value: ['#0d0d1a', '#1a0d2e', '#0d0d1a'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#00FFFF', secondary: '#A855F7', text: '#E0E7FF', accent: '#FF6EFF' },
  fonts: { heading: 'System', body: 'System' },
  placeholders: { recipientName: 'Riya', message: 'Let the party begin! Time to celebrate YOU!', senderName: 'Your Squad' },
  decorations: ['🎉', '🪩', '⚡'],
  layout: 'portrait',
  elements: [
    { id: 'np-1', type: 'sticker', content: '🎉', x: 20, y: 18, width: 28, height: 28, rotation: -15, opacity: 0.8, zIndex: 1, visible: true, fontSize: 22 },
    { id: 'np-2', type: 'sticker', content: '🪩', x: 288, y: 18, width: 28, height: 28, rotation: 12, opacity: 0.8, zIndex: 1, visible: true, fontSize: 22 },
    { id: 'np-3', type: 'text', content: 'HAPPY', x: 30, y: 70, width: 280, height: 42, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 34, fontWeight: '800', color: '#00FFFF', textAlign: 'center', letterSpacing: 8 },
    { id: 'np-4', type: 'text', content: 'BIRTHDAY', x: 30, y: 115, width: 280, height: 42, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 34, fontWeight: '800', color: '#FF6EFF', textAlign: 'center', letterSpacing: 5 },
    { id: 'np-5', type: 'text', content: '{{recipientName}}', x: 30, y: 175, width: 280, height: 50, rotation: 0, opacity: 1, zIndex: 3, visible: true, fontSize: 42, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', isPlaceholder: true, placeholderKey: 'recipientName' },
    { id: 'np-6', type: 'sticker', content: '⚡', x: 148, y: 245, width: 44, height: 44, rotation: 0, opacity: 0.9, zIndex: 2, visible: true, fontSize: 36 },
    { id: 'np-7', type: 'text', content: '{{message}}', x: 35, y: 310, width: 270, height: 55, rotation: 0, opacity: 0.85, zIndex: 2, visible: true, fontSize: 14, fontWeight: '400', color: '#C4B5FD', textAlign: 'center', lineHeight: 20, isPlaceholder: true, placeholderKey: 'message' },
    { id: 'np-8', type: 'text', content: '{{senderName}}', x: 35, y: 400, width: 270, height: 25, rotation: 0, opacity: 0.6, zIndex: 2, visible: true, fontSize: 13, fontWeight: '600', color: '#A855F7', textAlign: 'center', isPlaceholder: true, placeholderKey: 'senderName' },
  ],
};
