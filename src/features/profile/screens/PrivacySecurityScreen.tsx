import { router } from 'expo-router';
import { FileText, Shield } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackButton } from '@/shared/ui/ScreenBackButton';

export const PrivacySecurityScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <ScreenBackButton />
        <Text className="text-title text-foreground font-bold">Privacy & Security</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="bg-surface rounded-2xl px-4 py-5 border border-border/60 mt-4">
          <Text className="text-[15px] font-medium text-foreground leading-6">
            Your data stays on your device. Birthday Buddy is offline-first — birthdays, wishes, and cards are stored
            locally in SQLite and never require an account.
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Legal</Text>
          <View className="bg-surface rounded-2xl border border-border/60">
            <Pressable
              className="flex-row items-center py-3.5 px-4"
              onPress={() => router.push('/privacy-policy')}
              accessibilityRole="button">
              <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DCFCE7]">
                <Shield size={18} color="#22C55E" />
              </View>
              <Text className="text-[15px] font-medium text-foreground flex-1">Privacy Policy</Text>
            </Pressable>
            <View className="h-[0.5px] bg-border/60 mx-4" />
            <Pressable
              className="flex-row items-center py-3.5 px-4"
              onPress={() => router.push('/terms-conditions')}
              accessibilityRole="button">
              <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DBEAFE]">
                <FileText size={18} color="#3B82F6" />
              </View>
              <Text className="text-[15px] font-medium text-foreground flex-1">Terms & Conditions</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
