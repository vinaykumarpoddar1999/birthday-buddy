import React, { useEffect } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

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
    width: cardW * previewScale.value + 8,
    height: cardH * previewScale.value + 8,
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    width: cardW * previewScale.value,
    height: cardH * previewScale.value,
  }));

  return (
    <View className="flex-1 bg-background">
      <Animated.View entering={FadeInDown.duration(350)} className="px-6 pt-4 pb-2 items-center">
        <Text className="text-[22px] font-bold text-foreground">Preview</Text>
        <Text className="text-[13px] text-foreground-muted mt-1 text-center">
          {template.name} · Pinch to zoom
        </Text>
      </Animated.View>

      <View className="flex-1 items-center justify-center px-6">
        <GestureDetector gesture={pinch}>
          <Animated.View entering={FadeInUp.duration(400).delay(80)}>
            <Animated.View
              className="rounded-3xl overflow-hidden"
              style={[
                animatedFrameStyle,
                { padding: 4, backgroundColor: '#F3F0FF' },
              ]}>
              <Animated.View
                style={[animatedCardStyle, { borderRadius: 20, overflow: 'hidden' }]}>
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

      <View className="px-5 pb-5 pt-3">
        <View className="flex-row gap-3">
          <Pressable
            onPress={prevStep}
            className="flex-row items-center justify-center bg-surface rounded-2xl px-5 py-4 gap-1.5 border border-border"
            accessibilityRole="button"
            accessibilityLabel="Edit card">
            <ChevronLeft size={16} color="#374151" />
            <Text className="text-[14px] font-semibold text-foreground">Edit</Text>
          </Pressable>

          <Pressable
            onPress={nextStep}
            className="flex-1 overflow-hidden rounded-2xl"
            accessibilityRole="button"
            accessibilityLabel="Continue to share">
            <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center justify-center py-4 gap-2">
                <Share2 size={17} color="#FFF" />
                <Text className="text-[15px] font-bold text-white">Share & Download</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
