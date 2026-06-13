import type { CardBackground, CardElement, CardTemplate, TemplateCategory } from '../../types';

const CARD_W = 340;
const MARGIN = 16;
const CONTENT_W = CARD_W - MARGIN * 2;

type LayoutPreset = 'classic' | 'centered' | 'ribbon' | 'minimal' | 'festive';

type TemplateMeta = {
  id: string;
  name: string;
  category: TemplateCategory;
  tags: string[];
  background: CardBackground;
  colors: CardTemplate['colors'];
  decorations?: string[];
  headline: string;
  subline?: string;
  headlineColor: string;
  nameColor: string;
  messageColor: string;
  accentIcons?: string[];
  layoutPreset?: LayoutPreset;
};

export function textLayer(
  id: string,
  content: string,
  opts: Partial<CardElement> & { x: number; y: number; width: number; height: number },
): CardElement {
  return {
    id,
    type: 'text',
    rotation: 0,
    opacity: 1,
    zIndex: opts.zIndex ?? 2,
    visible: true,
    fontSize: 16,
    fontWeight: '400',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 22,
    content,
    ...opts,
  };
}

export function stickerLayer(
  id: string,
  icon: string,
  opts: Partial<CardElement> & { x: number; y: number; width: number; height: number },
): CardElement {
  return {
    id,
    type: 'sticker',
    content: icon,
    rotation: 0,
    opacity: opts.opacity ?? 0.85,
    zIndex: opts.zIndex ?? 1,
    visible: true,
    fontSize: opts.fontSize ?? 24,
    ...opts,
  };
}

export function shapeLayer(
  id: string,
  opts: Partial<CardElement> & { x: number; y: number; width: number; height: number },
): CardElement {
  return {
    id,
    type: 'shape',
    shapeType: 'rounded',
    rotation: 0,
    opacity: opts.opacity ?? 0.15,
    zIndex: opts.zIndex ?? 0,
    visible: true,
    backgroundColor: opts.backgroundColor ?? '#FFFFFF',
    borderRadius: opts.borderRadius ?? 24,
    ...opts,
  };
}

function confettiDots(id: string, accentColor: string, seed: number): CardElement[] {
  const positions = [
    { x: 24, y: 28, size: 6 },
    { x: 58, y: 18, size: 5 },
    { x: 290, y: 32, size: 7 },
    { x: 312, y: 58, size: 5 },
    { x: 18, y: 440, size: 6 },
    { x: 310, y: 430, size: 5 },
    { x: 168, y: 456, size: 4 },
  ];
  return positions.map((pos, i) =>
    shapeLayer(`${id}-dot-${i}`, {
      x: pos.x + (seed % 3) * 2,
      y: pos.y,
      width: pos.size,
      height: pos.size,
      shapeType: 'circle',
      backgroundColor: accentColor,
      opacity: 0.35 + (i % 3) * 0.15,
      borderRadius: pos.size / 2,
      zIndex: 1,
    }),
  );
}

function ribbonBadge(id: string, label: string, color: string, y: number): CardElement[] {
  return [
    shapeLayer(`${id}-ribbon`, {
      x: CARD_W / 2 - 72,
      y,
      width: 144,
      height: 28,
      backgroundColor: color,
      opacity: 0.9,
      borderRadius: 14,
      zIndex: 5,
    }),
    textLayer(`${id}-ribbon-text`, label, {
      x: CARD_W / 2 - 72,
      y: y + 2,
      width: 144,
      height: 24,
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
      lineHeight: 14,
      letterSpacing: 1.2,
      textPreset: 'subheading',
      zIndex: 6,
    }),
  ];
}

function resolveLayoutPreset(meta: TemplateMeta): LayoutPreset {
  if (meta.layoutPreset) return meta.layoutPreset;
  switch (meta.category) {
    case 'birthday':
    case 'festival':
      return 'festive';
    case 'minimal':
      return 'minimal';
    case 'professional':
      return 'ribbon';
    default:
      return 'classic';
  }
}

function buildAccentStickers(meta: TemplateMeta, preset: LayoutPreset): CardElement[] {
  const icons = meta.accentIcons ?? [];
  if (icons.length === 0) return [];

  const positions =
    preset === 'festive'
      ? [
          { x: 20, y: 52, rot: -18, size: 28 },
          { x: 288, y: 48, rot: 14, size: 26 },
          { x: 30, y: 400, rot: 8, size: 22 },
          { x: 280, y: 396, rot: -10, size: 24 },
        ]
      : preset === 'minimal'
        ? [
            { x: 28, y: 56, rot: 0, size: 20 },
            { x: 286, y: 56, rot: 0, size: 20 },
          ]
        : [
            { x: 24, y: 56, rot: -12, size: 26 },
            { x: 286, y: 52, rot: 12, size: 26 },
          ];

  return icons.slice(0, positions.length).map((icon, i) => {
    const pos = positions[i]!;
    return stickerLayer(`${meta.id}-icon-${i}`, icon, {
      x: pos.x,
      y: pos.y,
      width: pos.size + 8,
      height: pos.size + 8,
      rotation: pos.rot,
      opacity: preset === 'minimal' ? 0.45 : 0.7,
      zIndex: 2,
      fontSize: pos.size,
      color: meta.colors.accent,
    });
  });
}

export function buildTemplate(meta: TemplateMeta): CardTemplate {
  const preset = resolveLayoutPreset(meta);
  const hasSubline = Boolean(meta.subline);

  const panelY = preset === 'ribbon' ? 72 : 56;
  const panelH = preset === 'minimal' ? 360 : 372;
  const contentX = MARGIN + 4;
  const contentW = CONTENT_W - 8;

  let headlineY = panelY + 24;
  let nameY = panelY + (hasSubline ? 148 : 128);
  let messageY = panelY + (hasSubline ? 218 : 198);
  const headlineH = hasSubline ? 88 : 96;
  const nameH = 64;
  const messageH = preset === 'minimal' ? 108 : 120;

  if (preset === 'centered') {
    headlineY = panelY + 36;
    nameY = panelY + (hasSubline ? 160 : 140);
    messageY = panelY + (hasSubline ? 230 : 210);
  }

  const elements: CardElement[] = [
    shapeLayer(`${meta.id}-outer-glow`, {
      x: MARGIN - 4,
      y: panelY - 8,
      width: CONTENT_W + 8,
      height: panelH + 16,
      backgroundColor: meta.colors.primary,
      opacity: 0.08,
      borderRadius: 32,
      zIndex: 0,
    }),
    shapeLayer(`${meta.id}-bg-shape`, {
      x: MARGIN,
      y: panelY,
      width: CONTENT_W,
      height: panelH,
      backgroundColor: meta.colors.accent,
      opacity: preset === 'minimal' ? 0.08 : 0.14,
      borderRadius: 28,
      zIndex: 0,
    }),
    shapeLayer(`${meta.id}-inner-panel`, {
      x: MARGIN + 8,
      y: panelY + 12,
      width: CONTENT_W - 16,
      height: panelH - 24,
      backgroundColor: '#FFFFFF',
      opacity: preset === 'minimal' ? 0.06 : 0.1,
      borderRadius: 22,
      zIndex: 0,
    }),
    ...confettiDots(meta.id, meta.colors.secondary, meta.id.length),
    ...buildAccentStickers(meta, preset),
    ...(preset === 'ribbon'
      ? ribbonBadge(meta.id, meta.category.toUpperCase(), meta.colors.primary, panelY - 6)
      : []),
    textLayer(`${meta.id}-headline`, meta.headline, {
      x: contentX,
      y: headlineY,
      width: contentW,
      height: headlineH,
      fontSize: preset === 'minimal' ? 26 : 30,
      fontWeight: '800',
      color: meta.headlineColor,
      lineHeight: preset === 'minimal' ? 32 : 36,
      textPreset: 'headline',
      textShadowColor: 'rgba(0,0,0,0.18)',
      textShadowRadius: 8,
      zIndex: 4,
    }),
    ...(hasSubline
      ? [
          textLayer(`${meta.id}-subline`, meta.subline!, {
            x: contentX,
            y: headlineY + headlineH - 4,
            width: contentW,
            height: 36,
            fontSize: 13,
            fontWeight: '600',
            color: meta.messageColor,
            lineHeight: 18,
            textPreset: 'subheading',
            opacity: 0.92,
            zIndex: 4,
          }),
        ]
      : []),
    textLayer(`${meta.id}-name`, '{{recipientName}}', {
      x: contentX,
      y: nameY,
      width: contentW,
      height: nameH,
      fontSize: 28,
      fontWeight: '800',
      color: meta.nameColor,
      lineHeight: 34,
      textPreset: 'headline',
      textShadowColor: 'rgba(0,0,0,0.12)',
      textShadowRadius: 5,
      isPlaceholder: true,
      placeholderKey: 'recipientName',
      zIndex: 5,
    }),
    shapeLayer(`${meta.id}-divider`, {
      x: CARD_W / 2 - 40,
      y: messageY - 14,
      width: 80,
      height: 3,
      backgroundColor: meta.colors.primary,
      opacity: 0.35,
      borderRadius: 2,
      zIndex: 3,
    }),
    textLayer(`${meta.id}-message`, '{{message}}', {
      x: contentX + 4,
      y: messageY,
      width: contentW - 8,
      height: messageH,
      fontSize: 14,
      fontWeight: '500',
      color: meta.messageColor,
      lineHeight: 20,
      textPreset: 'body',
      isPlaceholder: true,
      placeholderKey: 'message',
      zIndex: 4,
    }),
    stickerLayer(`${meta.id}-footer-icon`, 'icon:sparkles', {
      x: CARD_W / 2 - 14,
      y: panelY + panelH - 36,
      width: 28,
      height: 28,
      opacity: 0.55,
      zIndex: 3,
      fontSize: 18,
      color: meta.colors.accent,
    }),
  ];

  return {
    id: meta.id,
    name: meta.name,
    category: meta.category,
    tags: meta.tags,
    isPremium: false,
    isTrending: true,
    background: meta.background,
    colors: meta.colors,
    fonts: { heading: 'System', body: 'System' },
    placeholders: {
      recipientName: 'Someone Special',
      message: 'Wishing you the very best today and always!',
    },
    decorations: meta.decorations,
    layout: 'portrait',
    elements,
  };
}
