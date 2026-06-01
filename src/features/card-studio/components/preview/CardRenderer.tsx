import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';

import {
  getLucideIcon,
  isIconStickerContent,
  parseIconStickerContent,
} from '@shared/utils/lucide-icons';
import type { CardBackground, CardElement, CardTemplate, PersonalizationData } from '../../types';
import { resolveElements } from '../../utils/placeholder';
import {
  CardStickerElement,
  CardTextElement,
  getElementPosition,
  resolveIconKey,
} from '../../utils/card-element-render';

const CARD_W = 340;
const CARD_H = 480;

function RenderElement({ el }: { el: CardElement }) {
  if (!el.visible) return null;

  if (el.type === 'text') {
    return <CardTextElement el={el} scale={1} />;
  }

  if (el.type === 'sticker') {
    return <CardStickerElement el={el} scale={1} defaultColor={el.color || '#7C3AED'} />;
  }

  if (el.type === 'image') {
    const pos = getElementPosition(el, 1);

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

    const placeholderContent = el.content || 'icon:camera';
    const iconKey = isIconStickerContent(placeholderContent)
      ? parseIconStickerContent(placeholderContent)
      : resolveIconKey(placeholderContent);
    const PlaceholderIcon = getLucideIcon(iconKey) ?? Camera;

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
        <PlaceholderIcon
          size={el.fontSize ? el.fontSize * 0.6 : 24}
          color="rgba(255,255,255,0.7)"
          strokeWidth={1.75}
        />
      </View>
    );
  }

  return null;
}

function BackgroundLayer({ bg }: { bg: CardBackground }) {
  if (bg.type === 'gradient') {
    return (
      <LinearGradient
        colors={(bg.value as string[]) as [string, string, ...string[]]}
        start={bg.gradientStart || { x: 0, y: 0 }}
        end={bg.gradientEnd || { x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />
    );
  }

  if (bg.type === 'image' && typeof bg.value === 'string') {
    return (
      <Image
        source={{ uri: bg.value }}
        style={{ position: 'absolute', inset: 0, width: CARD_W, height: CARD_H }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: typeof bg.value === 'string' ? bg.value : '#FFF',
      }}
    />
  );
}

type Props = {
  template: CardTemplate;
  personalization: PersonalizationData;
  elements: CardElement[];
  scale?: number;
  customBackground?: CardBackground | null;
  hideElements?: boolean;
};

export const CardRenderer = forwardRef<View, Props>(
  function CardRenderer(
    {
      template,
      personalization,
      elements,
      scale = 1,
      customBackground = null,
      hideElements = false,
    },
    ref,
  ) {
    const resolved = resolveElements(elements, personalization);
    const bg = customBackground ?? template.background;

    const innerContent = (
      <View style={{ width: CARD_W, height: CARD_H, position: 'relative' }}>
        <BackgroundLayer bg={bg} />
        {!hideElements
          ? resolved
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((el) => <RenderElement key={el.id} el={el} />)
          : null}
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
          {innerContent}
        </View>
      </View>
    );
  },
);

export { CARD_W, CARD_H };
