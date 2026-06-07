import type { CardBackground, CardElement, CardTemplate, TemplateCategory } from '../../types';

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

export function buildTemplate(meta: TemplateMeta): CardTemplate {
  const elements: CardElement[] = [
    shapeLayer(`${meta.id}-bg-shape`, {
      x: 24,
      y: 48,
      width: 292,
      height: 380,
      backgroundColor: meta.colors.accent,
      opacity: 0.12,
      borderRadius: 28,
      zIndex: 0,
    }),
    ...(meta.accentIcons ?? []).map((icon, i) =>
      stickerLayer(`${meta.id}-icon-${i}`, icon, {
        x: i % 2 === 0 ? 28 : 278,
        y: 36 + i * 8,
        width: 32,
        height: 32,
        rotation: i % 2 === 0 ? -12 : 12,
        opacity: 0.65,
        zIndex: 1,
        fontSize: 22,
      }),
    ),
    textLayer(`${meta.id}-headline`, meta.headline, {
      x: 28,
      y: 68,
      width: 284,
      height: meta.subline ? 76 : 88,
      fontSize: 28,
      fontWeight: '800',
      color: meta.headlineColor,
      lineHeight: 34,
      textPreset: 'headline',
      textShadowColor: 'rgba(0,0,0,0.15)',
      textShadowRadius: 6,
      zIndex: 3,
    }),
    ...(meta.subline
      ? [
          textLayer(`${meta.id}-subline`, meta.subline, {
            x: 28,
            y: 142,
            width: 284,
            height: 32,
            fontSize: 14,
            fontWeight: '600',
            color: meta.messageColor,
            lineHeight: 18,
            textPreset: 'subheading',
            opacity: 0.9,
            zIndex: 3,
          }),
        ]
      : []),
    textLayer(`${meta.id}-name`, '{{recipientName}}', {
      x: 28,
      y: meta.subline ? 178 : 170,
      width: 284,
      height: 58,
      fontSize: 32,
      fontWeight: '800',
      color: meta.nameColor,
      lineHeight: 38,
      textPreset: 'headline',
      textShadowColor: 'rgba(0,0,0,0.1)',
      textShadowRadius: 4,
      isPlaceholder: true,
      placeholderKey: 'recipientName',
      zIndex: 4,
    }),
    textLayer(`${meta.id}-message`, '{{message}}', {
      x: 32,
      y: 252,
      width: 276,
      height: 96,
      fontSize: 15,
      fontWeight: '500',
      color: meta.messageColor,
      lineHeight: 21,
      textPreset: 'body',
      isPlaceholder: true,
      placeholderKey: 'message',
      zIndex: 3,
    }),
    stickerLayer(`${meta.id}-footer-icon`, 'icon:sparkles', {
      x: 154,
      y: 420,
      width: 32,
      height: 32,
      opacity: 0.5,
      zIndex: 2,
      fontSize: 20,
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
