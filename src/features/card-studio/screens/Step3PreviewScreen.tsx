import React, { useEffect } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { CardStudioPrimaryButton } from '../components/common/CardStudioPrimaryButton';
import { CardStudioSecondaryButton } from '../components/common/CardStudioSecondaryButton';
import { studioTokens } from '../constants/studio-tokens';
import { useCardStudioStore } from '../store/card-studio.store';
import { CardRenderer } from '../components/preview/CardRenderer';
import { getCanvasDimensions, getCanvasScale } from '../utils/canvas-dimensions';

export function Step3PreviewScreen() {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const personalization = useCardStudioStore((s) => s.personalization);
  const elements = useCardStudioStore((s) => s.elements);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const canvasFormat = useCardStudioStore((s) => s.canvasFormat);
  const nextStep = useCardStudioStore((s) => s.nextStep);
  const prevStep = useCardStudioStore((s) => s.prevStep);

  const { width: screenW } = useWindowDimensions();
  const baseScale = getCanvasScale(screenW, canvasFormat, 'preview');
  const [displayScale, setDisplayScale] = React.useState(baseScale);
  const previewScale = useSharedValue(baseScale);
  const pinchBase = useSharedValue(baseScale);

  useEffect(() => {
    previewScale.value = baseScale;
    pinchBase.value = baseScale;
    setDisplayScale(baseScale);
  }, [baseScale, previewScale, pinchBase]);

  if (!template) return null;

  const { w: cardW, h: cardH } = getCanvasDimensions(canvasFormat);

  const applyPreviewScale = React.useCallback(
    (scale: number) => {
      previewScale.value = scale;
      setDisplayScale(scale);
    },
    [previewScale],
  );

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      pinchBase.value = previewScale.value;
    })
    .onUpdate((e) => {
      const next = Math.max(
        baseScale * 0.75,
        Math.min(baseScale * 1.35, pinchBase.value * e.scale),
      );
      previewScale.value = next;
      runOnJS(applyPreviewScale)(next);
    });

  const animatedFrameStyle = useAnimatedStyle(() => ({
    width: cardW * previewScale.value + 14,
    height: cardH * previewScale.value + 14,
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    width: cardW * previewScale.value,
    height: cardH * previewScale.value,
  }));

  return (
    <View className="flex-1 bg-background">
      <Animated.View entering={FadeInDown.duration(350)} className="px-5 pt-2 pb-2 items-center">
        <View className="rounded-full bg-primary/10 px-4 py-1.5 mb-1.5">
          <Text className="text-[12px] font-bold text-primary">{template.name}</Text>
        </View>
        <Text className="text-[13px] font-semibold text-foreground text-center">
          Preview your card
        </Text>
        <Text className="text-caption text-foreground-muted text-center mt-0.5">
          Pinch to zoom · Check text and layout
        </Text>
      </Animated.View>

      <View className="flex-1 items-center justify-center px-5" style={{ overflow: 'visible' }}>
        <GestureDetector gesture={pinch}>
          <Animated.View entering={FadeInUp.duration(400).delay(80)} style={{ overflow: 'visible' }}>
            <Animated.View
              className="rounded-3xl items-center justify-center"
              style={[
                animatedFrameStyle,
                {
                  padding: 7,
                  backgroundColor: studioTokens.colors.frameTint,
                  shadowColor: studioTokens.colors.primary,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.16,
                  shadowRadius: 22,
                  elevation: 10,
                  overflow: 'visible',
                },
              ]}>
              <Animated.View
                style={[
                  animatedCardStyle,
                  {
                    borderRadius: 20,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    elevation: 6,
                  },
                ]}>
                <CardRenderer
                  template={template}
                  personalization={personalization}
                  elements={elements}
                  scale={displayScale}
                  customBackground={customBackground}
                  canvasFormat={canvasFormat}
                />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View className="px-5 pb-5 pt-2 border-t border-border/50 bg-background">
        <View className="flex-row gap-3 items-stretch">
          <CardStudioSecondaryButton
            label="Edit"
            onPress={prevStep}
            icon={<ChevronLeft size={16} color="#374151" />}
            className="flex-none"
          />
          <CardStudioPrimaryButton
            label="Share & Download"
            onPress={nextStep}
            icon={<Share2 size={17} color="#FFF" />}
          />
        </View>
      </View>
    </View>
  );
}
