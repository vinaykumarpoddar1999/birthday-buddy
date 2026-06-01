import type { CardTemplate } from '../../types';

export const modernGeometricTemplate: CardTemplate = {
  id: 'modern-geometric',
  name: 'Modern Geometric',
  category: 'minimal',
  tags: ['birthday', 'minimal', 'modern', 'geometric', 'clean', 'professional', 'gradient'],
  isPremium: false,
  isTrending: true,
  background: {
    type: 'gradient',
    value: ['#0F172A', '#1E293B', '#334155'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#38BDF8', secondary: '#22D3EE', text: '#F1F5F9', accent: '#7DD3FC' },
  fonts: { heading: 'System', body: 'System' },
  placeholders: {
    recipientName: 'Riya',
    message: 'Here\'s to another year of chasing dreams and making memories',
    senderName: 'Cheers',
  },
  decorations: ['icon:circle', 'icon:circle-dot', 'icon:sparkles'],
  layout: 'portrait',
  elements: [
    { id: 'geo-1', type: 'sticker', content: 'icon:circle-dot', x: 20, y: 20, width: 30, height: 30, rotation: 45, opacity: 0.15, zIndex: 1, visible: true, fontSize: 28, color: '#38BDF8' },
    { id: 'geo-2', type: 'sticker', content: 'icon:circle-dot', x: 290, y: 22, width: 30, height: 30, rotation: 45, opacity: 0.15, zIndex: 1, visible: true, fontSize: 28, color: '#22D3EE' },
    { id: 'geo-3', type: 'sticker', content: 'icon:circle-dot', x: 150, y: 30, width: 20, height: 20, rotation: 45, opacity: 0.08, zIndex: 1, visible: true, fontSize: 16, color: '#7DD3FC' },
    { id: 'geo-4', type: 'text', content: 'H A P P Y', x: 30, y: 80, width: 280, height: 30, rotation: 0, opacity: 0.5, zIndex: 2, visible: true, fontSize: 16, fontWeight: '500', color: '#38BDF8', textAlign: 'center', letterSpacing: 10 },
    { id: 'geo-5', type: 'text', content: 'Birthday', x: 20, y: 112, width: 300, height: 55, rotation: 0, opacity: 1, zIndex: 2, visible: true, fontSize: 46, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
    { id: 'geo-6', type: 'text', content: '{{recipientName}}', x: 20, y: 180, width: 300, height: 48, rotation: 0, opacity: 1, zIndex: 3, visible: true, fontSize: 40, fontWeight: '800', color: '#38BDF8', textAlign: 'center', isPlaceholder: true, placeholderKey: 'recipientName' },
    { id: 'geo-7', type: 'text', content: '—— · ——', x: 100, y: 245, width: 140, height: 20, rotation: 0, opacity: 0.3, zIndex: 2, visible: true, fontSize: 14, fontWeight: '400', color: '#7DD3FC', textAlign: 'center' },
    { id: 'geo-8', type: 'sticker', content: 'icon:cake', x: 145, y: 275, width: 50, height: 50, rotation: 0, opacity: 0.9, zIndex: 2, visible: true, fontSize: 42 },
    { id: 'geo-9', type: 'text', content: '{{message}}', x: 38, y: 345, width: 264, height: 55, rotation: 0, opacity: 0.75, zIndex: 2, visible: true, fontSize: 14, fontWeight: '400', color: '#94A3B8', textAlign: 'center', lineHeight: 21, isPlaceholder: true, placeholderKey: 'message' },
    { id: 'geo-10', type: 'text', content: '{{senderName}}', x: 35, y: 420, width: 270, height: 25, rotation: 0, opacity: 0.5, zIndex: 2, visible: true, fontSize: 13, fontWeight: '600', color: '#38BDF8', textAlign: 'center', letterSpacing: 3, isPlaceholder: true, placeholderKey: 'senderName' },
    { id: 'geo-11', type: 'sticker', content: 'icon:circle-dot', x: 60, y: 445, width: 20, height: 20, rotation: 45, opacity: 0.1, zIndex: 1, visible: true, fontSize: 16, color: '#38BDF8' },
    { id: 'geo-12', type: 'sticker', content: 'icon:circle-dot', x: 260, y: 445, width: 20, height: 20, rotation: 45, opacity: 0.1, zIndex: 1, visible: true, fontSize: 16, color: '#22D3EE' },
  ],
};
