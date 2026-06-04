import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, Check, Crown, Lock, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePremium } from '@features/premium/hooks/usePremium';
import { usePremiumEntitlement } from '@features/premium/hooks/usePremiumEntitlement';
import { feedback } from '@/shared/feedback';

const BENEFITS = [
  'Unlimited AI wishes in any tone',
  'Premium card & surprise templates',
  'HD exports without watermarks',
  'Unlimited contacts & reminders',
  'Priority support',
];

export function PremiumUpgradeScreen() {
  const insets = useSafeAreaInsets();
  const { plans, isLoading, subscribe, restore } = usePremium();
  const { isActive } = usePremiumEntitlement();
  const [activating, setActivating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const yearlyPlan = plans.find((p) => p.planKey === 'yearly') ?? plans[0];

  const handleUpgrade = async () => {
    if (!yearlyPlan || activating) return;
    setActivating(true);
    try {
      await subscribe(yearlyPlan.planKey);
      feedback.success('Welcome to Premium', 'Your yearly plan is now active.');
      router.back();
    } catch (error) {
      feedback.error('Upgrade failed', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setActivating(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const ok = await restore();
      if (ok) {
        feedback.success('Restored', 'Your Premium access has been restored.');
        router.back();
      } else {
        feedback.warning('No purchase found', 'No active subscription on this device.');
      }
    } finally {
      setRestoring(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-surface border border-border items-center justify-center shrink-0"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="flex-1 text-center text-[17px] font-bold text-foreground px-2" numberOfLines={2}>
          BirthdayBuddy Premium
        </Text>
        <View className="h-10 w-10 shrink-0" />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#F3E8FF', '#FDF2F8', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl p-5 mb-5 border border-primary/10">
          <View className="flex-row items-start gap-2 mb-2">
            <Crown size={22} color="#D97706" fill="#FBBF24" style={{ marginTop: 2 }} />
            <Text className="flex-1 text-[22px] font-bold text-foreground" numberOfLines={3}>
              Make every birthday unforgettable
            </Text>
          </View>
          <Text className="text-[14px] text-foreground-secondary leading-5">
            Unlock AI wishes, premium templates, and unlimited reminders — all offline-ready today.
          </Text>
        </LinearGradient>

        <View className="bg-surface rounded-2xl border border-border p-4 mb-5">
          <Text className="text-[15px] font-bold text-foreground mb-3">Premium includes</Text>
          {BENEFITS.map((item) => (
            <View key={item} className="flex-row items-center gap-2 mb-2">
              <Check size={16} color="#7C3AED" />
              <Text className="text-[13px] text-foreground-secondary flex-1">{item}</Text>
            </View>
          ))}
        </View>

        {yearlyPlan ? (
          <View className="rounded-2xl border-2 border-primary bg-primary/5 p-4 mb-5">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[16px] font-bold text-foreground">{yearlyPlan.name}</Text>
              <View className="bg-primary rounded-full px-2.5 py-0.5">
                <Text className="text-[10px] font-bold text-white">Most Popular</Text>
              </View>
            </View>
            <Text className="text-[28px] font-bold text-primary">
              ₹{yearlyPlan.price}
              <Text className="text-[14px] font-medium text-foreground-secondary"> /year</Text>
            </Text>
            {yearlyPlan.savings ? (
              <Text className="text-[12px] text-success font-semibold mt-1">{yearlyPlan.savings}</Text>
            ) : null}
            <Text className="text-[12px] text-foreground-secondary mt-2">Billed once yearly · Cancel anytime</Text>
          </View>
        ) : null}

        {isActive ? (
          <View className="bg-success/10 border border-success/30 rounded-2xl p-4 mb-4">
            <Text className="text-[14px] font-bold text-success text-center">You have Premium active</Text>
          </View>
        ) : (
          <Pressable
            onPress={() => void handleUpgrade()}
            disabled={activating || isLoading || !yearlyPlan}
            className="rounded-2xl overflow-hidden mb-4"
            accessibilityRole="button">
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 px-5 flex-row items-center justify-center gap-2">
              {activating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Crown size={18} color="#FBBF24" fill="#FBBF24" />
                  <Text className="text-[16px] font-bold text-white">Upgrade to Premium</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}

        <View className="flex-row justify-around mb-6">
          <View className="items-center flex-1">
            <Lock size={18} color="#7C3AED" />
            <Text className="text-[11px] font-semibold text-foreground mt-1">Secure</Text>
          </View>
          <View className="items-center flex-1">
            <Shield size={18} color="#7C3AED" />
            <Text className="text-[11px] font-semibold text-foreground mt-1">Trusted</Text>
          </View>
          <View className="items-center flex-1">
            <Check size={18} color="#7C3AED" />
            <Text className="text-[11px] font-semibold text-foreground mt-1">Cancel anytime</Text>
          </View>
        </View>

        <Pressable onPress={() => void handleRestore()} disabled={restoring} accessibilityRole="button">
          <Text className="text-center text-[13px] text-primary font-semibold">
            {restoring ? 'Restoring…' : 'Restore Purchase'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/refer-earn')}
          className="mt-4 py-3 rounded-xl border border-primary/20 bg-primary/5 items-center"
          accessibilityRole="button">
          <Text className="text-[14px] font-bold text-primary">Refer friends · Earn Premium free</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
