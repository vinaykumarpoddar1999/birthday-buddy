import React, { memo } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'lucide-react-native';

import { getLucideIcon } from '@shared/utils/lucide-icons';
import type { CardElement, CardTemplate, PersonalizationData } from '../../types';
import { resolveElements } from '../../utils/placeholder';
import {
  CardStickerElement,
  CardTextElement,
  getElementPosition,
  resolveIconKey,
} from '../../utils/card-element-render';

const FULL_W = 340;
const FULL_H = 480;

const DEFAULT_DATA: PersonalizationData = {
  recipientName: 'Riya',
  senderName: 'With Love',
  relationship: '',
  age: '25',
  message: '',
  quote: '',
  eventType: 'birthday',
  date: '',
  location: '',
  signature: '',
  additionalNote: '',
};

function TinyEl({ el, s }: { el: CardElement; s: number }) {
  if (!el.visible) return null;

  if (el.type === 'text') {
    return <CardTextElement el={el} scale={s} />;
  }

  if (el.type === 'sticker') {
    return <CardStickerElement el={el} scale={s} />;
  }

  if (el.type === 'image') {
    const pos = getElementPosition(el, s);
    const iconKey = resolveIconKey(el.content || 'icon:camera');
    const PlaceholderIcon = getLucideIcon(iconKey) ?? Camera;

    return (
      <View
        style={{
          ...pos,
          backgroundColor: el.backgroundColor || 'rgba(255,255,255,0.15)',
          borderRadius: (el.borderRadius || 12) * s,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <PlaceholderIcon
          size={(el.fontSize ? el.fontSize * 0.6 : 24) * s}
          color="rgba(255,255,255,0.7)"
          strokeWidth={1.75}
        />
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
