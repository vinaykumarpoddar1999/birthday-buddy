import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

import { useCardStudioStore } from '../../store/card-studio.store';
import { CardRenderer } from '../preview/CardRenderer';

const SCREEN_W = Dimensions.get('window').width;
const CANVAS_SCALE = Math.min((SCREEN_W - 48) / 340, 0.82);

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
    <View className="items-center py-5 bg-gray-50/50">
      <View
        className="shadow-lg"
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
  );
}
