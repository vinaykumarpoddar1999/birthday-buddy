import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { RotateCw } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CanvasFormat, CardElement } from '../../types';
import { getCanvasDimensions } from '../../utils/canvas-dimensions';
import {
  CardShapeElement,
  CardStickerElement,
  CardTextElement,
} from '../../utils/card-element-render';

const MIN_SIZE = 24;

type Props = {
  element: CardElement;
  scale: number;
  canvasFormat: CanvasFormat;
  isSelected: boolean;
  onSelect: () => void;
};

function safeNumber(value: number | undefined, fallback: number, min?: number): number {
  if (!Number.isFinite(value)) return fallback;
  const parsed = value as number;
  if (typeof min === 'number') return Math.max(min, parsed);
  return parsed;
}

function ElementContent({ element, scale }: { element: CardElement; scale: number }) {
  if (element.type === 'text') {
    return (
      <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
        <CardTextElement el={{ ...element, x: 0, y: 0 }} scale={scale} />
      </View>
    );
  }
  if (element.type === 'sticker' || element.type === 'icon') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CardStickerElement el={{ ...element, x: 0, y: 0 }} scale={scale} defaultColor={element.color || '#7C3AED'} />
      </View>
    );
  }
  if (element.type === 'shape' || element.type === 'frame') {
    return (
      <View style={{ flex: 1 }}>
        <CardShapeElement el={{ ...element, x: 0, y: 0 }} scale={scale} />
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

export function DraggableElement({ element, scale, canvasFormat, isSelected, onSelect }: Props) {
  const updateElement = useCardStudioStore((s) => s.updateElement);
  const pushHistory = useCardStudioStore((s) => s.pushHistory);
  const setIsDragging = useCardStudioStore((s) => s.setIsDragging);

  const { w: CARD_W, h: CARD_H } = getCanvasDimensions(canvasFormat);
  const safeX = safeNumber(element.x, 0, 0);
  const safeY = safeNumber(element.y, 0, 0);
  const safeWidth = safeNumber(element.width, MIN_SIZE, MIN_SIZE);
  const safeHeight = safeNumber(element.height, MIN_SIZE, MIN_SIZE);
  const safeRotation = safeNumber(element.rotation, 0);
  const safeOpacity = safeNumber(element.opacity, 1, 0);
  const safeZIndex = safeNumber(element.zIndex, 0, 0);

  const liveRef = useRef({ x: safeX, y: safeY, w: safeWidth, h: safeHeight, r: safeRotation });
  const startRef = useRef({ x: safeX, y: safeY, w: safeWidth, h: safeHeight, r: safeRotation });

  useEffect(() => {
    liveRef.current = { x: safeX, y: safeY, w: safeWidth, h: safeHeight, r: safeRotation };
  }, [safeX, safeY, safeWidth, safeHeight, safeRotation]);

  const elementIdRef = useRef(element.id);
  elementIdRef.current = element.id;
  const lockedRef = useRef(!!element.locked);
  lockedRef.current = !!element.locked;

  const dragGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!element.locked)
        .onBegin(() => {
          onSelect();
          setIsDragging(true);
          startRef.current = { ...liveRef.current };
        })
        .onUpdate((e) => {
          const nx = Math.max(0, Math.min(CARD_W - liveRef.current.w, startRef.current.x + e.translationX / scale));
          const ny = Math.max(0, Math.min(CARD_H - liveRef.current.h, startRef.current.y + e.translationY / scale));
          updateElement(elementIdRef.current, { x: nx, y: ny });
        })
        .onEnd(() => {
          setIsDragging(false);
          pushHistory();
        })
        .onFinalize(() => setIsDragging(false)),
    [element.locked, onSelect, pushHistory, scale, updateElement, setIsDragging, CARD_W, CARD_H],
  );

  const resizeGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!element.locked)
        .onBegin(() => {
          onSelect();
          setIsDragging(true);
          startRef.current = { ...liveRef.current };
        })
        .onUpdate((e) => {
          const nw = Math.max(MIN_SIZE, Math.min(CARD_W - liveRef.current.x, startRef.current.w + e.translationX / scale));
          const nh = Math.max(MIN_SIZE, Math.min(CARD_H - liveRef.current.y, startRef.current.h + e.translationY / scale));
          updateElement(elementIdRef.current, { width: nw, height: nh });
        })
        .onEnd(() => {
          setIsDragging(false);
          pushHistory();
        })
        .onFinalize(() => setIsDragging(false)),
    [element.locked, onSelect, pushHistory, scale, updateElement, setIsDragging, CARD_W, CARD_H],
  );

  const rotateGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!element.locked)
        .onBegin(() => {
          onSelect();
          setIsDragging(true);
          startRef.current = { ...liveRef.current };
        })
        .onUpdate((e) => {
          updateElement(elementIdRef.current, { rotation: startRef.current.r + e.translationX * 0.5 });
        })
        .onEnd(() => {
          setIsDragging(false);
          pushHistory();
        })
        .onFinalize(() => setIsDragging(false)),
    [element.locked, onSelect, pushHistory, updateElement, setIsDragging],
  );

  if (!element.visible) return null;

  const left = safeX * scale;
  const top = safeY * scale;
  const width = safeWidth * scale;
  const height = safeHeight * scale;

  return (
    <GestureDetector gesture={dragGesture}>
      <View
        style={{
          position: 'absolute',
          left,
          top,
          width,
          height,
          zIndex: safeZIndex + (isSelected ? 1000 : 0),
          opacity: Math.min(1, safeOpacity),
          transform: [{ rotate: `${safeRotation}deg` }],
        }}
        accessibilityRole="button"
        accessibilityLabel={`${element.type} element${isSelected ? ', selected' : ''}`}>
        <Pressable onPress={onSelect} style={{ flex: 1, overflow: 'hidden' }}>
          <ElementContent element={element} scale={scale} />
        </Pressable>

        {isSelected && !element.locked ? (
          <>
            <GestureDetector gesture={resizeGesture}>
              <View
                style={{
                  position: 'absolute',
                  right: -8,
                  bottom: -8,
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#7C3AED',
                  borderWidth: 2.5,
                  borderColor: '#FFF',
                }}
                accessibilityRole="adjustable"
                accessibilityLabel="Resize handle"
              />
            </GestureDetector>
            <GestureDetector gesture={rotateGesture}>
              <View
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -8,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: '#FFF',
                  borderWidth: 2,
                  borderColor: '#7C3AED',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessibilityRole="adjustable"
                accessibilityLabel="Rotate handle">
                <RotateCw size={11} color="#7C3AED" />
              </View>
            </GestureDetector>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderWidth: 2,
                borderColor: '#7C3AED',
                borderStyle: 'dashed',
                borderRadius: 4,
              }}
            />
          </>
        ) : null}
      </View>
    </GestureDetector>
  );
}
