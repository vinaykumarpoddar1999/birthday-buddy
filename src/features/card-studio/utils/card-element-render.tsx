import { type TextStyle, Text, View } from 'react-native';

import {
  emojiToIconKey,
  getLucideIcon,
  isIconStickerContent,
  parseIconStickerContent,
} from '@shared/utils/lucide-icons';
import type { CardElement, FontWeight, TextPreset } from '@features/card-studio/types';

function toFiniteNumber(
  value: number | undefined,
  fallback: number,
  min?: number,
  max?: number,
): number {
  if (!Number.isFinite(value)) return fallback;
  let next = value as number;
  if (typeof min === 'number') next = Math.max(min, next);
  if (typeof max === 'number') next = Math.min(max, next);
  return next;
}

const FONT_WEIGHT_MAP: Record<string, TextStyle['fontWeight']> = {
  normal: '400',
  bold: '700',
  '300': '300',
  '400': '400',
  '500': '500',
  '600': '600',
  '700': '700',
  '800': '800',
};

function mapFontWeight(weight?: FontWeight | string): TextStyle['fontWeight'] {
  if (!weight) return '400';
  return FONT_WEIGHT_MAP[String(weight)] ?? '400';
}

function resolveFontStyle(preset?: TextPreset): TextStyle['fontStyle'] {
  if (preset === 'signature' || preset === 'quote') return 'italic';
  return 'normal';
}

function resolveTextEffects(el: CardElement): Pick<TextStyle, 'textShadowColor' | 'textShadowOffset' | 'textShadowRadius'> {
  if (el.textShadowColor) {
    return {
      textShadowColor: el.textShadowColor,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: toFiniteNumber(el.textShadowRadius, 4, 0),
    };
  }

  if (el.textPreset === 'headline') {
    return {
      textShadowColor: 'rgba(0,0,0,0.12)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    };
  }

  if (el.textPreset === 'subheading') {
    return {
      textShadowColor: 'rgba(0,0,0,0.08)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    };
  }

  return {};
}

export function getElementPosition(el: CardElement, scale = 1) {
  const x = toFiniteNumber(el.x, 0, 0);
  const y = toFiniteNumber(el.y, 0, 0);
  const width = toFiniteNumber(el.width, 24, 1);
  const height = toFiniteNumber(el.height, 24, 1);
  const opacity = toFiniteNumber(el.opacity, 1, 0, 1);
  const zIndex = toFiniteNumber(el.zIndex, 0, 0);
  const rotation = toFiniteNumber(el.rotation, 0);

  return {
    position: 'absolute' as const,
    left: x * scale,
    top: y * scale,
    width: width * scale,
    height: height * scale,
    opacity,
    zIndex,
    transform: [{ rotate: `${rotation}deg` }],
  };
}

export function resolveIconKey(content: string): string {
  return isIconStickerContent(content)
    ? parseIconStickerContent(content)
    : emojiToIconKey(content);
}

export function shouldRenderContentAsIcon(content: string | undefined): boolean {
  if (!content) return false;
  if (isIconStickerContent(content)) return true;
  return content.length <= 4 && getLucideIcon(emojiToIconKey(content)) !== null;
}

export function CardIconContent({
  content,
  size,
  color,
}: {
  content: string;
  size: number;
  color: string;
}) {
  const Icon = getLucideIcon(resolveIconKey(content));
  if (!Icon) return null;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={size} color={color} strokeWidth={1.75} />
    </View>
  );
}

function computeNumberOfLines(content: string, boxHeight: number, lineHeight: number, padding: number): number {
  const explicitLines = Math.max(1, content.split('\n').length);
  const maxLinesFromHeight = Math.max(1, Math.floor((boxHeight - padding * 2) / lineHeight));
  return Math.max(explicitLines, maxLinesFromHeight);
}

export function CardTextElement({ el, scale = 1 }: { el: CardElement; scale?: number }) {
  const content = el.content || '';
  const pos = getElementPosition(el, scale);
  const baseFontSize = toFiniteNumber(el.fontSize, 16, 8);
  const fontSize = baseFontSize * scale;
  const baseLineHeight = toFiniteNumber(el.lineHeight, Math.round(baseFontSize * 1.3), 8);
  const lineHeight = baseLineHeight * scale;
  const baseLetterSpacing = toFiniteNumber(el.letterSpacing, 0);
  const strokeWidth = toFiniteNumber(el.strokeWidth, 1, 0);
  const boxHeight = toFiniteNumber(el.height, 24, 1) * scale;
  const boxWidth = toFiniteNumber(el.width, 24, 1) * scale;
  const padding = Math.max(6, fontSize * 0.1);
  const numberOfLines = computeNumberOfLines(content, boxHeight, lineHeight, padding);
  const textWidth = Math.max(1, boxWidth - padding * 2);
  const isPlaceholder = Boolean(el.isPlaceholder);
  const isFixedSizeText = el.textPreset === 'headline' || el.textPreset === 'subheading';

  if (shouldRenderContentAsIcon(content)) {
    return (
      <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
        <CardIconContent
          content={content}
          size={fontSize}
          color={el.color || '#7C3AED'}
        />
      </View>
    );
  }

  const textStyle: TextStyle = {
    fontSize,
    fontWeight: mapFontWeight(el.fontWeight),
    fontStyle: resolveFontStyle(el.textPreset),
    color: el.color || '#000',
    textAlign: el.textAlign || 'center',
    lineHeight,
    letterSpacing: baseLetterSpacing * scale,
    includeFontPadding: false,
    ...resolveTextEffects(el),
  };

  const horizontalAlign =
    el.textAlign === 'left' ? 'flex-start' : el.textAlign === 'right' ? 'flex-end' : 'center';

  const containerStyle = {
    ...pos,
    justifyContent: 'center' as const,
    alignItems: horizontalAlign as 'flex-start' | 'flex-end' | 'center',
    paddingHorizontal: padding,
    paddingVertical: padding,
    overflow: 'visible' as const,
  };

  const textProps = {
    adjustsFontSizeToFit: !isFixedSizeText,
    minimumFontScale: isPlaceholder ? 0.35 : isFixedSizeText ? 1 : 0.45,
    numberOfLines: isFixedSizeText ? Math.max(1, content.split('\n').length) : numberOfLines,
    ellipsizeMode: 'tail' as const,
    allowFontScaling: false,
  };

  if (el.strokeColor && el.strokeWidth) {
    return (
      <View style={containerStyle}>
        <Text
          style={{
            ...textStyle,
            position: 'absolute',
            color: el.strokeColor,
            width: textWidth,
            left: padding - strokeWidth,
            top: padding,
          }}
          {...textProps}>
          {content}
        </Text>
        <Text
          style={{
            ...textStyle,
            position: 'absolute',
            color: el.strokeColor,
            width: textWidth,
            left: padding + strokeWidth,
            top: padding,
          }}
          {...textProps}>
          {content}
        </Text>
        <Text style={[textStyle, { width: textWidth, maxWidth: textWidth }]} {...textProps}>
          {content}
        </Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[textStyle, { width: textWidth, maxWidth: textWidth }]} {...textProps}>
        {content}
      </Text>
    </View>
  );
}

export function CardStickerElement({
  el,
  scale = 1,
  defaultColor = '#7C3AED',
}: {
  el: CardElement;
  scale?: number;
  defaultColor?: string;
}) {
  const content = el.content || '';
  const pos = getElementPosition(el, scale);
  const Icon = getLucideIcon(resolveIconKey(content));
  const iconSize = toFiniteNumber(el.fontSize, 32, 8) * scale;

  if (Icon) {
    return (
      <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
        <Icon
          size={iconSize}
          color={el.color || defaultColor}
          strokeWidth={1.75}
        />
      </View>
    );
  }

  return (
    <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: iconSize }}>{content}</Text>
    </View>
  );
}

export function CardShapeElement({ el, scale = 1 }: { el: CardElement; scale?: number }) {
  const pos = getElementPosition(el, scale);
  const shapeType = el.shapeType || 'rounded';
  const width = toFiniteNumber(el.width, 24, 1);
  const height = toFiniteNumber(el.height, 24, 1);
  const borderWidth = toFiniteNumber(el.borderWidth, 0, 0);
  const borderRadius =
    shapeType === 'circle'
      ? Math.min(width, height) * scale * 0.5
      : shapeType === 'rectangle'
        ? 0
        : toFiniteNumber(el.borderRadius, 12, 0) * scale;

  return (
    <View
      style={{
        ...pos,
        backgroundColor: el.backgroundColor || 'rgba(124,58,237,0.2)',
        borderRadius,
        borderWidth: borderWidth * scale,
        borderColor: el.borderColor || 'transparent',
      }}
    />
  );
}

export const TEXT_PRESETS = {
  headline: { fontSize: 28, fontWeight: '800' as const, textPreset: 'headline' as const },
  subheading: { fontSize: 20, fontWeight: '600' as const, textPreset: 'subheading' as const },
  body: { fontSize: 15, fontWeight: '500' as const, textPreset: 'body' as const },
  signature: { fontSize: 14, fontWeight: '500' as const, textPreset: 'signature' as const, fontStyle: 'italic' as const },
  quote: { fontSize: 17, fontWeight: '400' as const, textPreset: 'quote' as const, fontStyle: 'italic' as const },
};

export const FONT_COLORS = [
  '#FFFFFF', '#000000', '#7C3AED', '#EC4899', '#F59E0B',
  '#10B981', '#0EA5E9', '#EF4444', '#1F2937', '#F472B6',
];
