import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PRIVACY_POLICY_SECTIONS } from '../content/privacy-policy.content';

export const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Privacy Policy</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[12px] text-foreground-secondary mt-2 mb-4">Last updated: June 1, 2026</Text>

        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <View key={section.title} className="bg-surface rounded-2xl p-4 border border-border/60 mb-3">
            <Text className="text-[14px] font-bold text-foreground mb-2">{section.title}</Text>
            <Text className="text-[13px] text-foreground-secondary leading-5">{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
