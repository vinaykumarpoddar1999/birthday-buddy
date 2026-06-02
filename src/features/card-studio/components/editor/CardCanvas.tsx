import React, { useRef } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Move } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import { getCanvasDimensions, getCanvasScale } from '../../utils/canvas-dimensions';
import { resolveElements } from '../../utils/placeholder';
import { CardRenderer } from '../preview/CardRenderer';
import { DraggableElement } from './DraggableElement';
import { SelectionActions } from './SelectionActions';

type Props = {
  viewShotRef?: React.RefObject<React.ComponentRef<typeof ViewShot> | null>;
  editable?: boolean;
};

function isRenderableElement(el: { x: number; y: number; width: number; height: number }): boolean {
  return [el.x, el.y, el.width, el.height].every((value) => Number.isFinite(value));
}

export function CardCanvas({ viewShotRef, editable = true }: Props) {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const elements = useCardStudioStore((s) => s.elements);
  const personalization = useCardStudioStore((s) => s.personalization);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const canvasFormat = useCardStudioStore((s) => s.canvasFormat);
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const selectElement = useCardStudioStore((s) => s.selectElement);
  const internalRef = useRef<View>(null);
  const { width: screenW } = useWindowDimensions();

  if (!template) return null;

  const canvasScale = getCanvasScale(screenW, canvasFormat, editable ? 'editor' : 'preview');
  const resolved = resolveElements(elements, personalization);
  const safeResolved = resolved.filter(isRenderableElement);
  const { w, h } = getCanvasDimensions(canvasFormat);

  return (
    <View className="items-center py-3 px-4">
      <Pressable
        onPress={() => selectElement(null)}
        accessibilityRole="button"
        accessibilityLabel="Card canvas. Tap to deselect elements."
        className="rounded-3xl overflow-hidden"
        style={{
          width: w * canvasScale + 10,
          height: h * canvasScale + 10,
          padding: 5,
          backgroundColor: '#F3F0FF',
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.18,
          shadowRadius: 28,
          elevation: 12,
        }}>
        <View
          style={{
            width: w * canvasScale,
            height: h * canvasScale,
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
          }}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
            <CardRenderer
              ref={internalRef}
              template={template}
              personalization={personalization}
              elements={elements}
              scale={canvasScale}
              customBackground={customBackground}
              hideElements={editable}
              canvasFormat={canvasFormat}
            />
          </ViewShot>

          {editable
            ? safeResolved
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => (
                  <DraggableElement
                    key={el.id}
                    element={el}
                    scale={canvasScale}
                    canvasFormat={canvasFormat}
                    isSelected={selectedElementId === el.id}
                    onSelect={() => selectElement(el.id)}
                  />
                ))
            : null}
          {editable ? <SelectionActions /> : null}
        </View>
      </Pressable>

      <View className="flex-row items-center mt-2.5 gap-2">
        <View className="flex-row items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100">
          <View className="h-2 w-2 rounded-full bg-green-400" />
          <Text className="text-[10px] font-semibold text-foreground-muted">
            {editable ? 'Drag to move · Pinch to resize' : 'Preview'}
          </Text>
          <Move size={10} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );
}
