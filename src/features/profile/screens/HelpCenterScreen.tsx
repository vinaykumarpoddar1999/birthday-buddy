import { router } from 'expo-router';
import { ArrowLeft, Bug, ChevronRight, Lightbulb, Mail } from 'lucide-react-native';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SUPPORT_EMAIL = 'support@birthdaybuddy.app';

export const HelpCenterScreen = () => {
  const openSupportEmail = () => {
    void Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('BirthdayBuddy Support')}`,
    );
  };

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
        <Text className="text-title text-foreground font-bold">Help Center</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4 leading-5">
          Need assistance? Choose an option below and we will help you as soon as possible.
        </Text>

        <View className="bg-surface rounded-2xl border border-border/60">
          <Pressable
            className="flex-row items-center py-3.5 px-4"
            onPress={openSupportEmail}
            accessibilityRole="button"
            accessibilityLabel="Contact support via email">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#FEF3C7]">
              <Mail size={18} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Contact Support</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">{SUPPORT_EMAIL}</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
          <View className="h-[0.5px] bg-border/60 mx-4" />
          <Pressable
            className="flex-row items-center py-3.5 px-4"
            onPress={() => router.push({ pathname: '/send-feedback', params: { category: 'bug' } })}
            accessibilityRole="button"
            accessibilityLabel="Report an issue">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#FEE2E2]">
              <Bug size={18} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Report an Issue</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Describe a bug or problem</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
          <View className="h-[0.5px] bg-border/60 mx-4" />
          <Pressable
            className="flex-row items-center py-3.5 px-4"
            onPress={() => router.push({ pathname: '/send-feedback', params: { category: 'feature' } })}
            accessibilityRole="button"
            accessibilityLabel="Request a feature">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#EDE9FE]">
              <Lightbulb size={18} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Feature Request</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Suggest something new</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        <Pressable
          className="mt-4 bg-primary/10 rounded-2xl py-3.5 px-4 border border-primary/20"
          onPress={() => router.push('/help-faq')}
          accessibilityRole="button"
          accessibilityLabel="Browse help and FAQ">
          <Text className="text-[14px] font-semibold text-primary text-center">Browse Help & FAQ</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
