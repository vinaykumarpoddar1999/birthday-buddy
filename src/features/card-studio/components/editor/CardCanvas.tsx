import React, { useRef } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Move } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import { CardRenderer, CARD_W, CARD_H } from '../preview/CardRenderer';
import { DraggableElement } from './DraggableElement';
import { resolveElements } from '../../utils/placeholder';

const SCREEN_W = Dimensions.get('window').width;
const CANVAS_SCALE = Math.min((SCREEN_W - 48) / CARD_W, 0.85);

type Props = {
  viewShotRef?: React.RefObject<React.ComponentRef<typeof ViewShot> | null>;
  editable?: boolean;
};

export function CardCanvas({ viewShotRef, editable = true }: Props) {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const elements = useCardStudioStore((s) => s.elements);
  const personalization = useCardStudioStore((s) => s.personalization);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const selectElement = useCardStudioStore((s) => s.selectElement);

  const internalRef = useRef<View>(null);

  if (!template) return null;

  const resolved = resolveElements(elements, personalization);

  return (
    <View className="items-center py-5">
      <Pressable
        onPress={() => selectElement(null)}
        className="rounded-3xl overflow-hidden"
        style={{
          width: CARD_W * CANVAS_SCALE + 8,
          height: CARD_H * CANVAS_SCALE + 8,
          padding: 4,
          backgroundColor: '#F3F0FF',
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 8,
        }}>
        <View
          style={{
            width: CARD_W * CANVAS_SCALE,
            height: CARD_H * CANVAS_SCALE,
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
              scale={CANVAS_SCALE}
              customBackground={customBackground}
              hideElements={editable}
            />
          </ViewShot>

          {editable
            ? resolved
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => (
                  <DraggableElement
                    key={el.id}
                    element={el}
                    scale={CANVAS_SCALE}
                    isSelected={selectedElementId === el.id}
                    onSelect={() => selectElement(el.id)}
                  />
                ))
            : null}
        </View>
      </Pressable>

      <View className="flex-row items-center mt-3 gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100">
        <View className="h-2 w-2 rounded-full bg-green-400" />
        <Text className="text-[10px] font-semibold text-foreground-muted">
          {editable ? 'Drag · Resize · Rotate' : 'Live Preview'}
        </Text>
        <Move size={10} color="#9CA3AF" />
      </View>
    </View>
  );
}
