import React, { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

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
        <CardStickerElement
          el={{ ...element, x: 0, y: 0 }}
          scale={scale}
          defaultColor={element.color || '#7C3AED'}
        />
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

  const posX = useSharedValue(safeX);
  const posY = useSharedValue(safeY);
  const boxW = useSharedValue(safeWidth);
  const boxH = useSharedValue(safeHeight);
  const startX = useSharedValue(safeX);
  const startY = useSharedValue(safeY);
  const startW = useSharedValue(safeWidth);
  const startH = useSharedValue(safeHeight);
  const pinchStartW = useSharedValue(safeWidth);
  const pinchStartH = useSharedValue(safeHeight);

  const elementId = element.id;
  const locked = !!element.locked;
  const canvasW = CARD_W;
  const canvasH = CARD_H;
  const viewScale = scale;

  useEffect(() => {
    posX.value = safeX;
    posY.value = safeY;
    boxW.value = safeWidth;
    boxH.value = safeHeight;
  }, [safeX, safeY, safeWidth, safeHeight, posX, posY, boxW, boxH]);

  const commitMove = useCallback(
    (x: number, y: number) => {
      updateElement(elementId, { x, y });
    },
    [elementId, updateElement],
  );

  const commitResize = useCallback(
    (w: number, h: number) => {
      updateElement(elementId, { width: w, height: h });
    },
    [elementId, updateElement],
  );

  const handleSelect = useCallback(() => onSelect(), [onSelect]);

  const beginDrag = useCallback(() => {
    setIsDragging(true);
    onSelect();
  }, [setIsDragging, onSelect]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    pushHistory();
  }, [setIsDragging, pushHistory]);

  const dragGesture = Gesture.Pan()
    .enabled(!locked)
    .onBegin(() => {
      startX.value = posX.value;
      startY.value = posY.value;
      runOnJS(beginDrag)();
    })
    .onUpdate((e) => {
      const nx = Math.max(
        0,
        Math.min(canvasW - boxW.value, startX.value + e.translationX / viewScale),
      );
      const ny = Math.max(
        0,
        Math.min(canvasH - boxH.value, startY.value + e.translationY / viewScale),
      );
      posX.value = nx;
      posY.value = ny;
    })
    .onEnd(() => {
      runOnJS(commitMove)(posX.value, posY.value);
      runOnJS(endDrag)();
    })
    .onFinalize(() => {
      runOnJS(setIsDragging)(false);
    });

  const resizeGesture = Gesture.Pan()
    .enabled(!locked)
    .onBegin(() => {
      startW.value = boxW.value;
      startH.value = boxH.value;
      runOnJS(beginDrag)();
    })
    .onUpdate((e) => {
      const nw = Math.max(
        MIN_SIZE,
        Math.min(canvasW - posX.value, startW.value + e.translationX / viewScale),
      );
      const nh = Math.max(
        MIN_SIZE,
        Math.min(canvasH - posY.value, startH.value + e.translationY / viewScale),
      );
      boxW.value = nw;
      boxH.value = nh;
    })
    .onEnd(() => {
      runOnJS(commitResize)(boxW.value, boxH.value);
      runOnJS(endDrag)();
    })
    .onFinalize(() => {
      runOnJS(setIsDragging)(false);
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(!locked && isSelected)
    .onBegin(() => {
      pinchStartW.value = boxW.value;
      pinchStartH.value = boxH.value;
      runOnJS(setIsDragging)(true);
    })
    .onUpdate((e) => {
      const factor = Math.max(0.4, Math.min(3, e.scale));
      const nw = Math.max(
        MIN_SIZE,
        Math.min(canvasW - posX.value, pinchStartW.value * factor),
      );
      const nh = Math.max(
        MIN_SIZE,
        Math.min(canvasH - posY.value, pinchStartH.value * factor),
      );
      boxW.value = nw;
      boxH.value = nh;
    })
    .onEnd(() => {
      runOnJS(commitResize)(boxW.value, boxH.value);
      runOnJS(endDrag)();
    })
    .onFinalize(() => {
      runOnJS(setIsDragging)(false);
    });

  const composedGesture = Gesture.Simultaneous(dragGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: posX.value * viewScale,
    top: posY.value * viewScale,
    width: boxW.value * viewScale,
    height: boxH.value * viewScale,
    zIndex: safeZIndex + (isSelected ? 1000 : 0),
    opacity: Math.min(1, safeOpacity),
    transform: [{ rotate: `${safeRotation}deg` }],
  }));

  if (!element.visible) return null;

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={animatedStyle}
        accessibilityRole="button"
        accessibilityLabel={`${element.type} element${isSelected ? ', selected' : ''}`}>
        <Pressable onPress={handleSelect} style={{ flex: 1, overflow: 'hidden' }}>
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
      </Animated.View>
    </GestureDetector>
  );
}
