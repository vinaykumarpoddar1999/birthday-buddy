import React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Move } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import { getCanvasDimensions, getCanvasScale } from '../../utils/canvas-dimensions';
import { resolveElements } from '../../utils/placeholder';
import { CardRenderer } from '../preview/CardRenderer';
import { DraggableElement } from './DraggableElement';
import { SelectionActions } from './SelectionActions';

function isRenderableElement(el: { x: number; y: number; width: number; height: number }): boolean {
  return [el.x, el.y, el.width, el.height].every((value) => Number.isFinite(value));
}

export function CardCanvas({ editable = true }: { editable?: boolean }) {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const elements = useCardStudioStore((s) => s.elements);
  const personalization = useCardStudioStore((s) => s.personalization);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const canvasFormat = useCardStudioStore((s) => s.canvasFormat);
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const selectElement = useCardStudioStore((s) => s.selectElement);
  const { width: screenW } = useWindowDimensions();

  if (!template) return null;

  const canvasScale = getCanvasScale(screenW, canvasFormat, editable ? 'editor' : 'preview');
  const resolved = resolveElements(elements, personalization);
  const safeResolved = resolved.filter(isRenderableElement);
  const { w, h } = getCanvasDimensions(canvasFormat);

  return (
    <View className="items-center py-2 px-3">
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
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.16,
          shadowRadius: 20,
          elevation: 10,
        }}>
        <View
          collapsable={false}
          style={{
            width: w * canvasScale,
            height: h * canvasScale,
            borderRadius: 20,
            overflow: 'hidden',
            position: 'relative',
          }}>
          <CardRenderer
            template={template}
            personalization={personalization}
            elements={elements}
            scale={canvasScale}
            customBackground={customBackground}
            hideElements={editable}
            canvasFormat={canvasFormat}
          />

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

      {editable ? (
        <View className="flex-row items-center mt-1.5 gap-2">
          <View className="flex-row items-center gap-1.5 bg-surface px-3 py-1 rounded-full border border-border/80">
            <View className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <Text className="text-[10px] font-semibold text-foreground-muted">
              Drag to move · Pinch to resize
            </Text>
            <Move size={10} color="#9CA3AF" />
          </View>
        </View>
      ) : null}
    </View>
  );
}
