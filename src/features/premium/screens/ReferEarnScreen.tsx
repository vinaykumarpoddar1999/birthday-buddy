import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Copy, Gift, Share2, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { referralService } from '@/services/premium/referral.service';
import { useReferralStore } from '@/stores/referral.store';
import { feedback } from '@/shared/feedback';

const GOAL = 5;

export function ReferEarnScreen() {
  const { code, inviteLink, joinedCount, hydrated, hydrate, simulateJoin } = useReferralStore();
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  const progress = Math.min(joinedCount, GOAL);
  const shareMessage = code ? referralService.getShareMessage(code) : '';

  const handleCopy = async () => {
    if (!inviteLink) return;
    await Clipboard.setStringAsync(inviteLink);
    feedback.success('Copied', 'Invite link copied to clipboard.');
  };

  const handleShare = async () => {
    if (!shareMessage) return;
    await Share.share({ message: shareMessage });
  };

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const reward = await simulateJoin();
      if (reward) {
        feedback.success('Reward unlocked', reward);
      } else {
        feedback.success('Friend joined', `${progress + 1} of ${GOAL} friends joined.`);
      }
    } finally {
      setSimulating(false);
    }
  };

  if (!hydrated) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#7C3AED" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="flex-1 text-center text-[17px] font-bold text-foreground mr-10">Refer & Earn</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32">
        <LinearGradient
          colors={['#FEF3C7', '#FCE7F3', '#FFFFFF']}
          className="rounded-3xl p-5 mb-5 border border-amber-100">
          <Text className="text-[20px] font-bold text-foreground">Refer 5 friends</Text>
          <Text className="text-[20px] font-bold text-primary">Get Premium free for 12 months</Text>
          <Text className="text-[13px] text-foreground-secondary mt-2">
            Share your link. When friends join, you both earn Premium rewards.
          </Text>
        </LinearGradient>

        <View className="bg-surface rounded-2xl border border-border p-4 mb-5">
          <Text className="text-[14px] font-bold text-foreground mb-3">Your progress</Text>
          <View className="flex-row items-center justify-between mb-2">
            {Array.from({ length: GOAL }).map((_, i) => (
              <View
                key={i}
                className={`h-10 w-10 rounded-full items-center justify-center border-2 ${
                  i < progress ? 'bg-primary border-primary' : 'border-border bg-background'
                }`}>
                {i < progress ? (
                  <Users size={16} color="#FFFFFF" />
                ) : (
                  <Text className="text-[12px] font-bold text-foreground-muted">{i + 1}</Text>
                )}
              </View>
            ))}
          </View>
          <Text className="text-[13px] text-foreground-secondary text-center">
            {progress} / {GOAL} friends joined
          </Text>
        </View>

        <View className="bg-surface rounded-2xl border border-border p-4 mb-4">
          <Text className="text-[12px] font-semibold text-foreground-secondary mb-2">Your invite link</Text>
          <Text className="text-[13px] text-foreground mb-3" numberOfLines={2}>
            {inviteLink ?? 'Loading…'}
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => void handleCopy()}
              className="flex-1 flex-row items-center justify-center gap-1.5 bg-primary rounded-xl py-3"
              accessibilityRole="button">
              <Copy size={16} color="#FFFFFF" />
              <Text className="text-[13px] font-bold text-white">Copy</Text>
            </Pressable>
            <Pressable
              onPress={() => void handleShare()}
              className="flex-1 flex-row items-center justify-center gap-1.5 bg-primary/10 border border-primary/20 rounded-xl py-3"
              accessibilityRole="button">
              <Share2 size={16} color="#7C3AED" />
              <Text className="text-[13px] font-bold text-primary">Share</Text>
            </Pressable>
          </View>
        </View>

        <View className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex-row gap-2">
          <Gift size={18} color="#D97706" />
          <Text className="text-[12px] text-foreground-secondary flex-1">
            Both you and your friend get 7 days of Premium when they join using your link.
          </Text>
        </View>

        {__DEV__ ? (
          <Pressable
            onPress={() => void handleSimulate()}
            disabled={simulating || progress >= GOAL}
            className="rounded-xl border border-dashed border-primary/40 py-3 items-center mb-4"
            accessibilityRole="button">
            <Text className="text-[13px] font-semibold text-primary">
              {simulating ? 'Simulating…' : 'Dev: Mark friend joined'}
            </Text>
          </Pressable>
        ) : null}

        <Text className="text-[11px] text-foreground-muted text-center">
          Once {GOAL} friends join, Premium will be activated automatically.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
