import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { type ReactNode, useEffect } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SCALE, SPRING } from '@/shared/motion/tokens';
import { ConfettiBurst } from '@/shared/ui/ConfettiBurst';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  heroIllustration?: ReactNode;
  headerColors?: [string, string, ...string[]];
  showEntryConfetti?: boolean;
};

export function EngagementModalShell({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  heroIllustration,
  headerColors = ['#7C3AED', '#A855F7', '#EC4899'],
  showEntryConfetti = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue<number>(SCALE.entrance);
  const heroFloat = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 280 });
      cardScale.value = withSpring(1, SPRING.bouncy);
      heroFloat.value = withRepeat(
        withSequence(withTiming(-6, { duration: 1200 }), withTiming(0, { duration: 1200 })),
        -1,
        true,
      );
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      cardScale.value = SCALE.entrance;
      heroFloat.value = 0;
    }
  }, [backdropOpacity, cardScale, heroFloat, visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heroFloat.value }],
  }));

  const handleClose = () => onClose();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={handleClose}>
      <Animated.View style={[backdropStyle, { flex: 1, backgroundColor: 'rgba(15,10,30,0.72)' }]}>
        {showEntryConfetti && visible ? <ConfettiBurst active durationMs={2500} count={80} /> : null}
        <Pressable
          className="flex-1 justify-center px-5"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close dialog">
          <Animated.View style={cardStyle}>
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="rounded-[28px] overflow-hidden bg-white border border-primary/20"
              style={{
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.35,
                shadowRadius: 28,
                elevation: 16,
              }}
              accessibilityRole="none">
              <LinearGradient
                colors={headerColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 22 }}>
                <View
                  className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10"
                  style={{ transform: [{ translateX: 40 }, { translateY: -40 }] }}
                />
                <Pressable
                  onPress={handleClose}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/25 items-center justify-center z-10 border border-white/30"
                  accessibilityRole="button"
                  accessibilityLabel="Close">
                  <X size={18} color="#FFF" />
                </Pressable>
                {heroIllustration ? (
                  <Animated.View style={heroStyle} className="items-center mb-4">
                    {heroIllustration}
                  </Animated.View>
                ) : null}
                <Text className="text-[24px] font-bold text-white pr-12 leading-8">{title}</Text>
                {subtitle ? (
                  <Text className="text-[15px] text-white/92 mt-2 leading-[22px]">{subtitle}</Text>
                ) : null}
              </LinearGradient>

              <View className="px-6 py-5 bg-white">{children}</View>

              {footer ? (
                <View className="px-6 pb-6 pt-0 gap-3 bg-white border-t border-gray-100">{footer}</View>
              ) : null}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
