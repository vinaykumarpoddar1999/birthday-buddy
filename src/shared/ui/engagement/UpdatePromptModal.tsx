import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Rocket, Sparkles } from 'lucide-react-native';

import {
  getAppVersion,
  getLatestAvailableVersion,
  openAppStore,
} from '@/services/engagement/engagement-prompts.service';
import { AnimatedPressable } from '@/shared/motion/AnimatedPressable';
import { ConfettiBurst } from '@shared/ui/ConfettiBurst';

import { EngagementModalShell } from './EngagementModalShell';

const UPDATES = [
  { icon: Sparkles, label: 'New Features', desc: 'Fresh tools to celebrate better' },
  { icon: Rocket, label: 'Improvements', desc: 'Smoother, faster experience' },
  { icon: Sparkles, label: 'Bug Fixes', desc: 'Reliability you can count on' },
] as const;

function RocketIllustration() {
  return (
    <View className="flex-row items-center justify-center gap-3">
      <Svg width={48} height={48} viewBox="0 0 48 48">
        <Path
          d="M24 4 C24 4 36 16 36 28 L28 32 L24 44 L20 32 L12 28 C12 16 24 4 24 4Z"
          fill="#60A5FA"
        />
        <Circle cx="24" cy="20" r="4" fill="#DBEAFE" />
        <Path d="M16 36 L12 44 M32 36 L36 44" stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
      </Svg>
      <Svg width={28} height={28} viewBox="0 0 28 28">
        <Rect x="4" y="10" width="20" height="14" rx="2" fill="#F472B6" />
        <Rect x="12" y="10" width="4" height="14" fill="#EC4899" />
        <Rect x="4" y="6" width="20" height="6" rx="1" fill="#FB7185" />
      </Svg>
    </View>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function UpdatePromptModal({ visible, onClose }: Props) {
  const [showConfetti, setShowConfetti] = useState(false);
  const currentVersion = getAppVersion();
  const latestVersion = getLatestAvailableVersion();

  useEffect(() => {
    if (visible) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timer);
    }
    setShowConfetti(false);
    return undefined;
  }, [visible]);

  return (
    <EngagementModalShell
      visible={visible}
      onClose={onClose}
      title="New Update Available"
      subtitle={`Version ${latestVersion} is ready. You are on ${currentVersion}.`}
      headerColors={['#3B82F6', '#6366F1', '#7C3AED']}
      heroIllustration={<RocketIllustration />}
      showEntryConfetti
      footer={
        <>
          <AnimatedPressable
            onPress={async () => {
              await openAppStore();
              onClose();
            }}
            className="overflow-hidden rounded-2xl"
            accessibilityRole="button"
            accessibilityLabel="Update now">
            <LinearGradient colors={['#7C3AED', '#6366F1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="py-4 items-center">
                <Text className="text-[16px] font-bold text-white">Update Now</Text>
              </View>
            </LinearGradient>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={onClose}
            className="py-3 items-center"
            accessibilityRole="button"
            accessibilityLabel="Later">
            <Text className="text-[14px] font-semibold text-foreground-muted">Later</Text>
          </AnimatedPressable>
        </>
      }>
      <View className="relative min-h-[40px]">
        {showConfetti ? <ConfettiBurst active durationMs={2000} count={70} /> : null}
        <View className="gap-3">
          {UPDATES.map(({ icon: Icon, label, desc }) => (
            <View key={label} className="flex-row items-center gap-3 rounded-xl bg-blue-50/80 px-3 py-2.5 border border-blue-100">
              <View className="h-9 w-9 rounded-full bg-white items-center justify-center">
                <Icon size={16} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-foreground">{label}</Text>
                <Text className="text-[12px] text-foreground-secondary">{desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </EngagementModalShell>
  );
}
