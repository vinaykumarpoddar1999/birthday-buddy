import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { Star } from 'lucide-react-native';

import {
  dismissRatePromptForDays,
  openAppStore,
} from '@/services/engagement/engagement-prompts.service';
import { useProfileStore } from '@features/profile/store/profile.store';
import { AnimatedPressable } from '@/shared/motion/AnimatedPressable';
import { SPRING } from '@/shared/motion/tokens';
import { ConfettiBurst } from '@shared/ui/ConfettiBurst';
import { LinearGradient } from 'expo-linear-gradient';

import { EngagementModalShell } from './EngagementModalShell';

function MascotIllustration() {
  return (
    <View className="h-20 w-20 rounded-full bg-pink-100 items-center justify-center">
      <Svg width={56} height={56} viewBox="0 0 56 56">
        <Circle cx="28" cy="28" r="24" fill="#FBCFE8" />
        <Circle cx="20" cy="24" r="3" fill="#831843" />
        <Circle cx="36" cy="24" r="3" fill="#831843" />
        <Path d="M18 34 Q28 42 38 34" stroke="#831843" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Ellipse cx="28" cy="8" rx="8" ry="4" fill="#7C3AED" opacity={0.8} />
      </Svg>
    </View>
  );
}

function AnimatedStar({
  value,
  selected,
  onPress,
}: {
  value: number;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.15 : 1, SPRING.micro);
  }, [scale, selected]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${value} stars`}>
      <Animated.View style={style}>
        <Star
          size={36}
          color={selected ? '#F59E0B' : '#D1D5DB'}
          fill={selected ? '#F59E0B' : 'transparent'}
        />
      </Animated.View>
    </AnimatedPressable>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function RatePromptModal({ visible, onClose }: Props) {
  const setAppRating = useProfileStore((s) => s.setAppRating);
  const [rateStars, setRateStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClose = () => {
    setRateStars(0);
    setShowConfetti(false);
    onClose();
  };

  const handleStarPress = (n: number) => {
    setRateStars(n);
    if (n >= 4) setShowConfetti(true);
  };

  return (
    <EngagementModalShell
      visible={visible}
      onClose={handleClose}
      title="Loving Birthday Buddy?"
      subtitle="Your review helps us grow and reach more people."
      headerColors={['#EC4899', '#DB2777', '#7C3AED']}
      heroIllustration={<MascotIllustration />}
      footer={
        <>
          <AnimatedPressable
            onPress={async () => {
              if (rateStars > 0) setAppRating(rateStars);
              if (rateStars >= 4) await openAppStore();
              handleClose();
            }}
            disabled={rateStars === 0}
            className="overflow-hidden rounded-2xl"
            style={{ opacity: rateStars === 0 ? 0.5 : 1 }}
            accessibilityRole="button"
            accessibilityLabel="Rate on Play Store">
            <LinearGradient colors={['#F59E0B', '#D97706']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center justify-center py-4 gap-2">
                <Star size={18} color="#FFF" fill="#FFF" />
                <Text className="text-[16px] font-bold text-white">
                  {Platform.OS === 'ios' ? 'Rate on App Store' : 'Rate on Play Store'}
                </Text>
              </View>
            </LinearGradient>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={async () => {
              await dismissRatePromptForDays(7);
              handleClose();
            }}
            className="py-3 items-center"
            accessibilityRole="button"
            accessibilityLabel="Later">
            <Text className="text-[14px] font-semibold text-foreground-muted">Later</Text>
          </AnimatedPressable>
        </>
      }>
      <View className="relative min-h-[72px]">
        {showConfetti ? <ConfettiBurst active durationMs={2200} count={100} /> : null}
        <View className="flex-row justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <AnimatedStar
              key={n}
              value={n}
              selected={n <= rateStars}
              onPress={() => handleStarPress(n)}
            />
          ))}
        </View>
      </View>
    </EngagementModalShell>
  );
}
