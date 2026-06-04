import { router } from 'expo-router';
import { Bell, Crown, Gift, Palette, Shield, Sparkles, Zap } from 'lucide-react-native';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AnimatedPressable } from '@/shared/motion/AnimatedPressable';
import { ShimmerOverlay } from '@/shared/motion/ShimmerOverlay';

import { EngagementModalShell } from './EngagementModalShell';

const BENEFITS = [
  { icon: Bell, label: 'Unlimited Birthday Reminders' },
  { icon: Palette, label: 'Premium Greeting Cards' },
  { icon: Gift, label: 'Surprise Scheduler' },
  { icon: Zap, label: 'Advanced Notifications' },
  { icon: Shield, label: 'Ad-Free Experience' },
  { icon: Sparkles, label: 'Priority Features' },
] as const;

function CrownIllustration() {
  return (
    <View className="h-16 w-16 rounded-full bg-amber-400/30 items-center justify-center border border-amber-300/40">
      <Svg width={40} height={32} viewBox="0 0 40 32">
        <Path
          d="M4 26 L8 12 L16 18 L20 6 L24 18 L32 12 L36 26 Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth={1.5}
        />
        <Path d="M4 26 L36 26" stroke="#F59E0B" strokeWidth={2} />
        <Path d="M12 26 L12 22 M20 26 L20 20 M28 26 L28 22" stroke="#FDE68A" strokeWidth={2} />
      </Svg>
    </View>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function PremiumPromptModal({ visible, onClose }: Props) {
  return (
    <EngagementModalShell
      visible={visible}
      onClose={onClose}
      title="Unlock Birthday Buddy Premium"
      subtitle="Never miss a celebration with smarter reminders and exclusive templates."
      headerColors={['#7C3AED', '#A855F7', '#EC4899']}
      heroIllustration={<CrownIllustration />}
      showEntryConfetti
      footer={
        <>
          <AnimatedPressable
            onPress={() => {
              onClose();
              router.push('/premium-upgrade');
            }}
            className="overflow-hidden rounded-2xl"
            accessibilityRole="button"
            accessibilityLabel="Upgrade Now">
            <View className="relative overflow-hidden rounded-2xl">
              <View className="flex-row items-center justify-center py-4 gap-2 bg-primary">
                <Crown size={18} color="#FFF" />
                <Text className="text-[16px] font-bold text-white">Upgrade Now</Text>
              </View>
              <ShimmerOverlay borderRadius={16} />
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={onClose}
            className="py-3 items-center"
            accessibilityRole="button"
            accessibilityLabel="Maybe later">
            <Text className="text-[14px] font-semibold text-foreground-muted">Maybe Later</Text>
          </AnimatedPressable>
        </>
      }>
      <View className="gap-2.5">
        {BENEFITS.map(({ icon: Icon, label }) => (
          <View
            key={label}
            className="flex-row items-center gap-3 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
            <View className="h-8 w-8 rounded-full bg-amber-100 items-center justify-center">
              <Icon size={14} color="#D97706" />
            </View>
            <Text className="text-[13px] text-foreground font-semibold flex-1">{label}</Text>
          </View>
        ))}
      </View>
    </EngagementModalShell>
  );
}
