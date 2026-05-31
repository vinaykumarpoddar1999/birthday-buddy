import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { CardElement, CardTemplate, PersonalizationData } from '../../types';
import { resolveElements } from '../../utils/placeholder';

const FULL_W = 340;
const FULL_H = 480;

const DEFAULT_DATA: PersonalizationData = {
  recipientName: 'Riya',
  senderName: 'With Love',
  relationship: '',
  age: '25',
  message: '',
  quote: '',
  emoji: '🎂',
  eventType: 'birthday',
  date: '',
  location: '',
  signature: '',
  additionalNote: '',
};

function TinyEl({ el, s }: { el: CardElement; s: number }) {
  if (!el.visible) return null;

  const pos = {
    position: 'absolute' as const,
    left: el.x * s,
    top: el.y * s,
    width: el.width * s,
    height: el.height * s,
    opacity: el.opacity,
    zIndex: el.zIndex,
    transform: [{ rotate: `${el.rotation}deg` }],
  };

  if (el.type === 'text') {
    return (
      <View style={pos}>
        <Text
          style={{
            fontSize: (el.fontSize || 16) * s,
            fontWeight: (el.fontWeight as '400' | '700') || '400',
            color: el.color || '#000',
            textAlign: el.textAlign || 'center',
            lineHeight: ((el.lineHeight || (el.fontSize || 16) * 1.35)) * s,
          }}
          numberOfLines={0}>
          {el.content || ''}
        </Text>
      </View>
    );
  }

  if (el.type === 'sticker') {
    return (
      <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: (el.fontSize || 32) * s }}>{el.content || ''}</Text>
      </View>
    );
  }

  if (el.type === 'image') {
    return (
      <View
        style={{
          ...pos,
          backgroundColor: el.backgroundColor || 'rgba(255,255,255,0.15)',
          borderRadius: (el.borderRadius || 12) * s,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ fontSize: (el.fontSize || 30) * s }}>{el.content || '📸'}</Text>
      </View>
    );
  }

  return null;
}

type Props = {
  template: CardTemplate;
  width?: number;
  personalization?: PersonalizationData;
};

export const TemplateThumbnail = memo(function TemplateThumbnail({
  template,
  width = 160,
  personalization,
}: Props) {
  const scale = width / FULL_W;
  const height = FULL_H * scale;
  const data = { ...DEFAULT_DATA, ...template.placeholders, ...personalization } as PersonalizationData;
  const resolved = resolveElements(template.elements, data);
  const bg = template.background;

  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      {bg.type === 'gradient' ? (
        <LinearGradient
          colors={(bg.value as string[]) as [string, string, ...string[]]}
          start={bg.gradientStart || { x: 0, y: 0 }}
          end={bg.gradientEnd || { x: 1, y: 1 }}
          style={{ flex: 1 }}>
          <View style={{ width: FULL_W * scale, height, position: 'relative' }}>
            {resolved.sort((a, b) => a.zIndex - b.zIndex).map((el) => (
              <TinyEl key={el.id} el={el} s={scale} />
            ))}
          </View>
        </LinearGradient>
      ) : (
        <View style={{ flex: 1, backgroundColor: typeof bg.value === 'string' ? bg.value : '#fff' }}>
          <View style={{ width: FULL_W * scale, height, position: 'relative' }}>
            {resolved.sort((a, b) => a.zIndex - b.zIndex).map((el) => (
              <TinyEl key={el.id} el={el} s={scale} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
});
