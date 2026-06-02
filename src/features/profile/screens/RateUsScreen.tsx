import Constants from 'expo-constants';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconCircle } from '@shared/ui/IconCircle';

import { useProfileStore } from '../store/profile.store';

const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

function getStoreUrl(): string | null {
  const config = Constants.expoConfig;
  const iosBundleId = config?.ios?.bundleIdentifier ?? 'com.birthdaybuddy.app';
  const androidPackage = config?.android?.package ?? iosBundleId;
  const iosAppId = (config?.extra as { iosAppId?: string } | undefined)?.iosAppId;

  if (Platform.OS === 'ios' && iosAppId) {
    return `https://apps.apple.com/app/id${iosAppId}`;
  }
  if (Platform.OS === 'ios') {
    return `https://apps.apple.com/app/${iosBundleId}`;
  }
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${androidPackage}`;
  }

  if (iosAppId) {
    return `https://apps.apple.com/app/id${iosAppId}`;
  }
  return `https://play.google.com/store/apps/details?id=${androidPackage}`;
}

export const RateUsScreen = () => {
  const existingRating = useProfileStore((s) => s.appRating);
  const setAppRating = useProfileStore((s) => s.setAppRating);
  const [rating, setRating] = useState(existingRating ?? 0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const openAppStore = async () => {
    const url = getStoreUrl();
    if (!url) return;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setAppRating(rating);

    if (rating >= 4) {
      await openAppStore();
      setSubmitted(true);
      return;
    }

    router.push({
      pathname: '/send-feedback',
      params: {
        category: 'improvement',
        subject: `App rating: ${rating} stars`,
        message: feedback.trim() || `User rated the app ${rating} out of 5.`,
      },
    });
  };

  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6" edges={['top']}>
        <IconCircle icon={CheckCircle} size="xl" iconColor="#7C3AED" bgColor="#EDE9FE" className="mb-4" />
        <Text className="text-heading text-foreground font-bold text-center">Thank You!</Text>
        <Text className="text-body text-foreground-secondary text-center mt-2">
          Your {rating}-star rating means a lot to us. We are glad you enjoy BirthdayBuddy!
        </Text>
        <Pressable className="bg-primary rounded-xl px-6 py-3 mt-6" onPress={() => router.back()} accessibilityRole="button">
          <Text className="text-[15px] font-bold text-white">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Rate Us</Text>
      </View>

      <View className="flex-1 px-5 items-center pt-10">
        <View className="flex-row gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={28}
              color={i <= rating ? '#F59E0B' : '#E5E7EB'}
              fill={i <= rating ? '#F59E0B' : 'transparent'}
            />
          ))}
        </View>
        <Text className="text-heading text-foreground font-bold text-center mt-4">How do you like BirthdayBuddy?</Text>
        <Text className="text-body text-foreground-secondary text-center mt-2">Tap a star to rate your experience</Text>

        <View className="flex-row gap-3 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable key={i} onPress={() => setRating(i)} accessibilityRole="button" accessibilityLabel={`Rate ${i} stars`}>
              <Star
                size={40}
                color={i <= rating ? '#F59E0B' : '#E5E7EB'}
                fill={i <= rating ? '#F59E0B' : 'transparent'}
              />
            </Pressable>
          ))}
        </View>

        {rating > 0 && (
          <Text className="text-[14px] font-semibold text-primary mt-3">
            {RATING_LABELS[rating - 1]}
          </Text>
        )}

        {rating > 0 && rating <= 3 && (
          <View className="w-full mt-6">
            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Tell us how we can improve (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-foreground min-h-[80px] w-full"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        )}

        {rating > 0 && (
          <Pressable className="bg-primary rounded-2xl py-4 w-full mt-6 items-center" onPress={() => void handleSubmit()} accessibilityRole="button">
            <Text className="text-[15px] font-bold text-white">
              {rating >= 4 ? 'Rate on App Store' : 'Send Feedback'}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};
