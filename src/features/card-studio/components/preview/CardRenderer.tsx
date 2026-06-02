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
import type { BackgroundEffect, CardBackground, CardElement, CardTemplate, CanvasFormat, PersonalizationData } from '../../types';
import { getCanvasDimensions } from '../../utils/canvas-dimensions';
import { resolveElements } from '../../utils/placeholder';
import {
  CardShapeElement,
  CardStickerElement,
  CardTextElement,
  getElementPosition,
  resolveIconKey,
} from '../../utils/card-element-render';

export const CARD_W = 340;
export const CARD_H = 480;

function isRenderableElement(el: CardElement): boolean {
  return [el.x, el.y, el.width, el.height].every((value) => Number.isFinite(value));
}

function EffectOverlay({ effect, cardW, cardH }: { effect: BackgroundEffect; cardW: number; cardH: number }) {
  const intensity = effect.intensity ?? 0.5;

  if (effect.type === 'overlay') {
    return (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: cardW,
          height: cardH,
          backgroundColor: effect.color || '#000',
          opacity: intensity * 0.6,
        }}
      />
    );
  }

  if (effect.type === 'glass') {
    return (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: cardW,
          height: cardH,
          backgroundColor: `rgba(255,255,255,${intensity * 0.25})`,
        }}
      />
    );
  }

  if (effect.type === 'glow') {
    return (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: cardW,
          height: cardH,
          backgroundColor: effect.color || 'rgba(124,58,237,0.15)',
          opacity: intensity,
        }}
      />
    );
  }

  return null;
}

function BackgroundLayer({ bg, cardW, cardH }: { bg: CardBackground; cardW: number; cardH: number }) {
  const opacity = bg.opacity ?? 1;

  if (bg.type === 'gradient') {
    return (
      <View style={{ position: 'absolute', inset: 0, opacity }}>
        <LinearGradient
          colors={(bg.value as string[]) as [string, string, ...string[]]}
          start={bg.gradientStart || { x: 0, y: 0 }}
          end={bg.gradientEnd || { x: 1, y: 1 }}
          style={{ position: 'absolute', inset: 0, width: cardW, height: cardH }}
        />
      </View>
    );
  }

  if (bg.type === 'image' && typeof bg.value === 'string') {
    const scale = bg.imageScale ?? 1;
    const offsetX = bg.imageOffsetX ?? 0;
    const offsetY = bg.imageOffsetY ?? 0;
    return (
      <View style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity }}>
        <Image
          source={{ uri: bg.value }}
          style={{
            position: 'absolute',
            width: cardW * scale,
            height: cardH * scale,
            left: offsetX,
            top: offsetY,
            transform: [{ rotate: `${bg.imageRotation ?? 0}deg` }],
          }}
          contentFit="cover"
          blurRadius={bg.blur ? bg.blur * 10 : 0}
        />
        {bg.overlayColor && bg.overlayOpacity ? (
          <View
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: bg.overlayColor,
              opacity: bg.overlayOpacity,
            }}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: typeof bg.value === 'string' ? bg.value : '#FFF',
        opacity,
      }}
    />
  );
}

function RenderElement({ el }: { el: CardElement }) {
  if (!el.visible) return null;
  if (!isRenderableElement(el)) return null;

  if (el.type === 'text') {
    return <CardTextElement el={el} scale={1} />;
  }

  if (el.type === 'sticker' || el.type === 'icon') {
    return <CardStickerElement el={el} scale={1} defaultColor={el.color || '#7C3AED'} />;
  }

  if (el.type === 'shape' || el.type === 'frame') {
    return <CardShapeElement el={el} scale={1} />;
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

type Props = {
  template: CardTemplate;
  personalization: PersonalizationData;
  elements: CardElement[];
  scale?: number;
  customBackground?: CardBackground | null;
  hideElements?: boolean;
  canvasFormat?: CanvasFormat;
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
      canvasFormat,
    },
    ref,
  ) {
    const format = canvasFormat || template.layout || 'portrait';
    const { w: cardW, h: cardH } = getCanvasDimensions(format);
    const resolved = resolveElements(elements, personalization);
    const bg = customBackground ?? template.background;

    const innerContent = (
      <View style={{ width: cardW, height: cardH, position: 'relative' }}>
        <BackgroundLayer bg={bg} cardW={cardW} cardH={cardH} />
        {bg.effects?.map((effect, i) => (
          <EffectOverlay key={`${effect.type}-${i}`} effect={effect} cardW={cardW} cardH={cardH} />
        ))}
        {!hideElements
          ? resolved
              .filter(isRenderableElement)
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
          width: cardW * scale,
          height: cardH * scale,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: cardW,
            height: cardH,
            transform: [{ scale }],
            transformOrigin: 'top left',
          }}>
          {innerContent}
        </View>
      </View>
    );
  },
);

export { getCanvasDimensions };
