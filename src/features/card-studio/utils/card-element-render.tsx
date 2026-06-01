import { Text, View } from 'react-native';

import {
  emojiToIconKey,
  getLucideIcon,
  isIconStickerContent,
  parseIconStickerContent,
} from '@shared/utils/lucide-icons';
import type { CardElement } from '@features/card-studio/types';

export function getElementPosition(el: CardElement, scale = 1) {
  return {
    position: 'absolute' as const,
    left: el.x * scale,
    top: el.y * scale,
    width: el.width * scale,
    height: el.height * scale,
    opacity: el.opacity,
    zIndex: el.zIndex,
    transform: [{ rotate: `${el.rotation}deg` }],
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
  // Legacy single-character emoji stickers
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

  if (shouldRenderContentAsIcon(content)) {
    return (
      <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
        <CardIconContent
          content={content}
          size={(el.fontSize || 32) * scale}
          color={el.color || '#7C3AED'}
        />
      </View>
    );
  }

  return (
    <View style={pos}>
      <Text
        style={{
          fontSize: (el.fontSize || 16) * scale,
          fontWeight: (el.fontWeight as '400' | '700') || '400',
          color: el.color || '#000',
          textAlign: el.textAlign || 'center',
          lineHeight: ((el.lineHeight || (el.fontSize || 16) * 1.35)) * scale,
          letterSpacing: (el.letterSpacing || 0) * scale,
        }}>
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

  if (Icon) {
    return (
      <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
        <Icon
          size={(el.fontSize || 32) * scale}
          color={el.color || defaultColor}
          strokeWidth={1.75}
        />
      </View>
    );
  }

  return (
    <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: (el.fontSize || 32) * scale }}>{content}</Text>
    </View>
  );
}
