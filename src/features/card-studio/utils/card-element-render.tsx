import { Text, View } from 'react-native';

import {
  emojiToIconKey,
  getLucideIcon,
  isIconStickerContent,
  parseIconStickerContent,
} from '@shared/utils/lucide-icons';
import type { CardElement } from '@features/card-studio/types';

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

export function CardTextElement({ el, scale = 1 }: { el: CardElement; scale?: number }) {
  const content = el.content || '';
  const pos = getElementPosition(el, scale);
  const baseFontSize = toFiniteNumber(el.fontSize, 16, 8);
  const fontSize = baseFontSize * scale;
  const baseLineHeight = toFiniteNumber(el.lineHeight, baseFontSize * 1.35, 8);
  const lineHeight = baseLineHeight * scale;
  const baseLetterSpacing = toFiniteNumber(el.letterSpacing, 0);
  const textShadowRadius = toFiniteNumber(el.textShadowRadius, 0, 0);
  const strokeWidth = toFiniteNumber(el.strokeWidth, 1, 0);
  const boxHeight = toFiniteNumber(el.height, 24, 1) * scale;
  const boxWidth = toFiniteNumber(el.width, 24, 1) * scale;
  const padding = Math.max(2, fontSize * 0.12);
  const explicitLines = Math.max(1, content.split('\n').length);
  const maxLinesFromHeight = Math.max(
    1,
    Math.floor((boxHeight - padding * 2) / lineHeight),
  );
  const numberOfLines = Math.max(explicitLines, maxLinesFromHeight);

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

  const textStyle = {
    fontSize,
    fontWeight: (el.fontWeight as '400' | '700') || '400',
    color: el.color || '#000',
    textAlign: el.textAlign || ('center' as const),
    lineHeight,
    letterSpacing: baseLetterSpacing * scale,
    textShadowColor: el.textShadowColor,
    textShadowOffset: el.textShadowColor ? { width: 0, height: 1 } : undefined,
    textShadowRadius,
    includeFontPadding: false,
  };

  const containerStyle = {
    ...pos,
    justifyContent: 'center' as const,
    padding,
    overflow: 'visible' as const,
  };

  if (el.strokeColor && el.strokeWidth) {
    return (
      <View style={containerStyle}>
        <Text
          style={{
            ...textStyle,
            position: 'absolute',
            color: el.strokeColor,
            left: padding - strokeWidth,
            right: padding + strokeWidth,
            top: padding,
            width: boxWidth - padding * 2,
          }}
          adjustsFontSizeToFit
          minimumFontScale={0.35}
          numberOfLines={numberOfLines}>
          {content}
        </Text>
        <Text
          style={{
            ...textStyle,
            position: 'absolute',
            color: el.strokeColor,
            left: padding + strokeWidth,
            right: padding - strokeWidth,
            top: padding,
            width: boxWidth - padding * 2,
          }}
          adjustsFontSizeToFit
          minimumFontScale={0.35}
          numberOfLines={numberOfLines}>
          {content}
        </Text>
        <Text
          style={[textStyle, { width: '100%' }]}
          adjustsFontSizeToFit
          minimumFontScale={0.35}
          numberOfLines={numberOfLines}>
          {content}
        </Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text
        style={[textStyle, { width: '100%', flexShrink: 1 }]}
        adjustsFontSizeToFit
        minimumFontScale={0.35}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail">
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
  headline: { fontSize: 32, fontWeight: '800' as const, textPreset: 'headline' as const },
  subheading: { fontSize: 22, fontWeight: '600' as const, textPreset: 'subheading' as const },
  body: { fontSize: 16, fontWeight: '400' as const, textPreset: 'body' as const },
  signature: { fontSize: 14, fontWeight: '500' as const, textPreset: 'signature' as const, fontStyle: 'italic' as const },
  quote: { fontSize: 18, fontWeight: '400' as const, textPreset: 'quote' as const, fontStyle: 'italic' as const },
};

export const FONT_COLORS = [
  '#FFFFFF', '#000000', '#7C3AED', '#EC4899', '#F59E0B',
  '#10B981', '#0EA5E9', '#EF4444', '#1F2937', '#F472B6',
];
