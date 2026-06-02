import { router } from 'expo-router';
import { Crown, Sparkles, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  dismissRatePromptForDays,
  openAppStore,
} from '@/services/engagement/engagement-prompts.service';
import { useModalStore } from '@/stores/modal.store';
import { useProfileStore } from '@features/profile/store/profile.store';

import { EngagementModalShell } from './EngagementModalShell';

export function EngagementPromptHost() {
  const activeModal = useModalStore((s) => s.activeModal);
  const closeModal = useModalStore((s) => s.closeModal);
  const setAppRating = useProfileStore((s) => s.setAppRating);
  const [rateStars, setRateStars] = useState(0);

  const close = () => {
    setRateStars(0);
    closeModal();
  };

  return (
    <>
      <EngagementModalShell
        visible={activeModal === 'premium'}
        onClose={close}
        title="Unlock Premium"
        subtitle="Never miss a celebration with smarter reminders and exclusive templates."
        footer={
          <>
            <Pressable
              onPress={() => {
                close();
                router.push('/premium-upgrade');
              }}
              className="overflow-hidden rounded-2xl"
              accessibilityRole="button"
              accessibilityLabel="Go Premium">
              <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View className="flex-row items-center justify-center py-4 gap-2">
                  <Crown size={18} color="#FFF" />
                  <Text className="text-[16px] font-bold text-white">Go Premium</Text>
                </View>
              </LinearGradient>
            </Pressable>
            <Pressable
              onPress={close}
              className="py-3 items-center"
              accessibilityRole="button"
              accessibilityLabel="Maybe later">
              <Text className="text-[14px] font-semibold text-foreground-muted">Maybe later</Text>
            </Pressable>
          </>
        }>
        {['Unlimited AI wishes', 'Premium card templates', 'Priority birthday alarms'].map((item) => (
          <View key={item} className="flex-row items-center gap-3 mb-3">
            <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center">
              <Sparkles size={14} color="#7C3AED" />
            </View>
            <Text className="text-[14px] text-foreground font-medium">{item}</Text>
          </View>
        ))}
      </EngagementModalShell>

      <EngagementModalShell
        visible={activeModal === 'rate'}
        onClose={close}
        title="Enjoying BirthdayBuddy?"
        subtitle="A quick rating helps us reach more people who forget birthdays."
        footer={
          <>
            <Pressable
              onPress={async () => {
                if (rateStars > 0) setAppRating(rateStars);
                if (rateStars >= 4) await openAppStore();
                close();
              }}
              disabled={rateStars === 0}
              className="overflow-hidden rounded-2xl opacity-100"
              style={{ opacity: rateStars === 0 ? 0.5 : 1 }}
              accessibilityRole="button"
              accessibilityLabel="Submit rating">
              <LinearGradient colors={['#F59E0B', '#D97706']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View className="flex-row items-center justify-center py-4 gap-2">
                  <Star size={18} color="#FFF" fill="#FFF" />
                  <Text className="text-[16px] font-bold text-white">
                    {rateStars >= 4 ? 'Rate on Store' : 'Submit'}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
            <Pressable
              onPress={async () => {
                await dismissRatePromptForDays(7);
                close();
              }}
              className="py-3 items-center"
              accessibilityRole="button"
              accessibilityLabel="Not now">
              <Text className="text-[14px] font-semibold text-foreground-muted">Not now</Text>
            </Pressable>
          </>
        }>
        <View className="flex-row justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              onPress={() => setRateStars(n)}
              accessibilityRole="button"
              accessibilityLabel={`${n} stars`}>
              <Star
                size={36}
                color={n <= rateStars ? '#F59E0B' : '#D1D5DB'}
                fill={n <= rateStars ? '#F59E0B' : 'transparent'}
              />
            </Pressable>
          ))}
        </View>
      </EngagementModalShell>

      <EngagementModalShell
        visible={activeModal === 'update'}
        onClose={close}
        title="Update available"
        subtitle="Get the latest features, fixes, and a smoother birthday experience."
        footer={
          <>
            <Pressable
              onPress={async () => {
                await openAppStore();
                close();
              }}
              className="overflow-hidden rounded-2xl"
              accessibilityRole="button"
              accessibilityLabel="Update app">
              <LinearGradient colors={['#3B82F6', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View className="py-4 items-center">
                  <Text className="text-[16px] font-bold text-white">Update now</Text>
                </View>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={close} className="py-3 items-center" accessibilityRole="button">
              <Text className="text-[14px] font-semibold text-foreground-muted">Remind me in 7 days</Text>
            </Pressable>
          </>
        }>
        <Text className="text-[14px] text-foreground-secondary text-center leading-5">
          Tap update to open the app store and install the newest version of BirthdayBuddy.
        </Text>
      </EngagementModalShell>
    </>
  );
}
