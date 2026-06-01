import React, { useRef } from 'react';
import { Dimensions, Text, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Move } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import { CardRenderer } from '../preview/CardRenderer';

const SCREEN_W = Dimensions.get('window').width;
const CANVAS_SCALE = Math.min((SCREEN_W - 48) / 340, 0.85);

type Props = {
  viewShotRef?: React.RefObject<ViewShot | null>;
};

export function CardCanvas({ viewShotRef }: Props) {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const elements = useCardStudioStore((s) => s.elements);
  const personalization = useCardStudioStore((s) => s.personalization);

  const internalRef = useRef<View>(null);

  if (!template) return null;

  return (
    <View className="items-center py-5">
      {/* Canvas wrapper with subtle checkerboard pattern hint */}
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          width: 340 * CANVAS_SCALE + 8,
          height: 480 * CANVAS_SCALE + 8,
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
            width: 340 * CANVAS_SCALE,
            height: 480 * CANVAS_SCALE,
            borderRadius: 20,
            overflow: 'hidden',
          }}>
          <CardRenderer
            ref={internalRef}
            template={template}
            personalization={personalization}
            elements={elements}
            scale={CANVAS_SCALE}
          />
        </View>
      </View>

      {/* Live preview badge */}
      <View className="flex-row items-center mt-3 gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100">
        <View className="h-2 w-2 rounded-full bg-green-400" />
        <Text className="text-[10px] font-semibold text-foreground-muted">Live Preview</Text>
        <Move size={10} color="#9CA3AF" />
      </View>
    </View>
  );
}
