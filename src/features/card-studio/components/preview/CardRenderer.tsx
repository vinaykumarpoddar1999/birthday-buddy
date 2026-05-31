import React, { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import type { CardElement, CardTemplate, PersonalizationData } from '../../types';
import { resolveElements } from '../../utils/placeholder';

const CARD_W = 340;
const CARD_H = 480;

function RenderElement({ el }: { el: CardElement }) {
  if (!el.visible) return null;

  const pos = {
    position: 'absolute' as const,
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
    opacity: el.opacity,
    zIndex: el.zIndex,
    transform: [{ rotate: `${el.rotation}deg` }],
  };

  if (el.type === 'text') {
    return (
      <View style={pos}>
        <Text
          style={{
            fontSize: el.fontSize || 16,
            fontWeight: (el.fontWeight as '400' | '700') || '400',
            color: el.color || '#000',
            textAlign: el.textAlign || 'center',
            lineHeight: el.lineHeight || (el.fontSize || 16) * 1.35,
            letterSpacing: el.letterSpacing || 0,
          }}>
          {el.content || ''}
        </Text>
      </View>
    );
  }

  if (el.type === 'sticker') {
    return (
      <View style={{ ...pos, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: el.fontSize || 32 }}>{el.content || ''}</Text>
      </View>
    );
  }

  if (el.type === 'image') {
    if (el.uri) {
      return (
        <View style={pos}>
          <Image
            source={{ uri: el.uri }}
            style={{ width: el.width, height: el.height, borderRadius: el.borderRadius || 0 }}
            contentFit="cover"
          />
        </View>
      );
    }
    return (
      <View
        style={{
          ...pos,
          backgroundColor: el.backgroundColor || 'rgba(255,255,255,0.15)',
          borderRadius: el.borderRadius || 12,
          borderWidth: el.borderWidth || 2,
          borderColor: el.borderColor || 'rgba(255,255,255,0.3)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ fontSize: el.fontSize || 40 }}>{el.content || '📸'}</Text>
      </View>
    );
  }

  return null;
}

type Props = {
  template: CardTemplate;
  personalization: PersonalizationData;
  elements: CardElement[];
  scale?: number;
};

export const CardRenderer = forwardRef<View, Props>(
  function CardRenderer({ template, personalization, elements, scale = 1 }, ref) {
    const resolved = resolveElements(elements, personalization);
    const bg = template.background;

    const innerContent = (
      <View style={{ width: CARD_W, height: CARD_H, position: 'relative' }}>
        {resolved
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((el) => (
            <RenderElement key={el.id} el={el} />
          ))}
      </View>
    );

    return (
      <View
        ref={ref}
        collapsable={false}
        style={{
          width: CARD_W * scale,
          height: CARD_H * scale,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: CARD_W,
            height: CARD_H,
            transform: [{ scale }],
            transformOrigin: 'top left',
          }}>
          {bg.type === 'gradient' ? (
            <LinearGradient
              colors={(bg.value as string[]) as [string, string, ...string[]]}
              start={bg.gradientStart || { x: 0, y: 0 }}
              end={bg.gradientEnd || { x: 1, y: 1 }}
              style={{ flex: 1 }}>
              {innerContent}
            </LinearGradient>
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: typeof bg.value === 'string' ? bg.value : '#FFF',
              }}>
              {innerContent}
            </View>
          )}
        </View>
      </View>
    );
  },
);
