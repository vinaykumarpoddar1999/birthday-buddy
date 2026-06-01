import React, { useMemo, useRef } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { RotateCw } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardElement } from '../../types';
import {
  CardStickerElement,
  CardTextElement,
} from '../../utils/card-element-render';

const CARD_W = 340;
const CARD_H = 480;
const MIN_SIZE = 24;

type Props = {
  element: CardElement;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
};

function ElementContent({ element, scale }: { element: CardElement; scale: number }) {
  if (element.type === 'text') {
    return (
      <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <CardTextElement
          el={{ ...element, x: 0, y: 0 }}
          scale={scale}
        />
      </View>
    );
  }
  if (element.type === 'sticker') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CardStickerElement el={{ ...element, x: 0, y: 0 }} scale={scale} defaultColor={element.color || '#7C3AED'} />
      </View>
    );
  }
  if (element.type === 'image' && element.uri) {
    return (
      <Image
        source={{ uri: element.uri }}
        style={{
          width: element.width * scale,
          height: element.height * scale,
          borderRadius: (element.borderRadius || 0) * scale,
          opacity: element.opacity,
        }}
        contentFit="cover"
      />
    );
  }
  return null;
}

export function DraggableElement({ element, scale, isSelected, onSelect }: Props) {
  const updateElement = useCardStudioStore((s) => s.updateElement);
  const pushHistory = useCardStudioStore((s) => s.pushHistory);

  const startRef = useRef({ x: element.x, y: element.y, w: element.width, h: element.height, r: element.rotation });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !element.locked,
        onMoveShouldSetPanResponder: () => !element.locked,
        onPanResponderGrant: () => {
          onSelect();
          startRef.current = {
            x: element.x,
            y: element.y,
            w: element.width,
            h: element.height,
            r: element.rotation,
          };
        },
        onPanResponderMove: (_, gesture) => {
          if (element.locked) return;
          const nx = Math.max(0, Math.min(CARD_W - element.width, startRef.current.x + gesture.dx / scale));
          const ny = Math.max(0, Math.min(CARD_H - element.height, startRef.current.y + gesture.dy / scale));
          updateElement(element.id, { x: nx, y: ny });
        },
        onPanResponderRelease: () => pushHistory(),
      }),
    [element.id, element.locked, element.width, element.height, element.x, element.y, element.rotation, onSelect, pushHistory, scale, updateElement],
  );

  const resizeResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !element.locked,
        onMoveShouldSetPanResponder: () => !element.locked,
        onPanResponderGrant: () => {
          onSelect();
          startRef.current = {
            x: element.x,
            y: element.y,
            w: element.width,
            h: element.height,
            r: element.rotation,
          };
        },
        onPanResponderMove: (_, gesture) => {
          if (element.locked) return;
          const nw = Math.max(MIN_SIZE, Math.min(CARD_W - element.x, startRef.current.w + gesture.dx / scale));
          const nh = Math.max(MIN_SIZE, Math.min(CARD_H - element.y, startRef.current.h + gesture.dy / scale));
          updateElement(element.id, { width: nw, height: nh });
        },
        onPanResponderRelease: () => pushHistory(),
      }),
    [element.id, element.locked, element.x, element.y, element.height, element.width, onSelect, pushHistory, scale, updateElement],
  );

  const rotateResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !element.locked,
        onMoveShouldSetPanResponder: () => !element.locked,
        onPanResponderGrant: () => {
          onSelect();
          startRef.current.r = element.rotation;
        },
        onPanResponderMove: (_, gesture) => {
          if (element.locked) return;
          updateElement(element.id, { rotation: startRef.current.r + gesture.dx * 0.5 });
        },
        onPanResponderRelease: () => pushHistory(),
      }),
    [element.id, element.locked, element.rotation, onSelect, pushHistory, updateElement],
  );

  if (!element.visible) return null;

  const left = element.x * scale;
  const top = element.y * scale;
  const width = element.width * scale;
  const height = element.height * scale;

  return (
    <View
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        zIndex: element.zIndex + (isSelected ? 1000 : 0),
        opacity: element.opacity,
        transform: [{ rotate: `${element.rotation}deg` }],
      }}
      {...panResponder.panHandlers}>
      <Pressable onPress={onSelect} style={{ flex: 1, overflow: 'hidden' }}>
        <ElementContent element={element} scale={scale} />
      </Pressable>

      {isSelected && !element.locked ? (
        <>
          <View
            {...resizeResponder.panHandlers}
            style={{
              position: 'absolute',
              right: -6,
              bottom: -6,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: '#7C3AED',
              borderWidth: 2,
              borderColor: '#FFF',
            }}
          />
          <View
            {...rotateResponder.panHandlers}
            style={{
              position: 'absolute',
              right: -6,
              top: -6,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: '#FFF',
              borderWidth: 2,
              borderColor: '#7C3AED',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <RotateCw size={10} color="#7C3AED" />
          </View>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderWidth: 1.5,
              borderColor: '#7C3AED',
              borderStyle: 'dashed',
              borderRadius: 4,
            }}
          />
        </>
      ) : null}
    </View>
  );
}
