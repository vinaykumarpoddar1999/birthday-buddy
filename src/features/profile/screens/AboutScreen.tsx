import Constants from 'expo-constants';
import { router } from 'expo-router';
import { ArrowLeft, Cake, FileText, Heart, Mail, Shield } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';
const appBuild =
  Constants.nativeBuildVersion ??
  Constants.expoConfig?.ios?.buildNumber ??
  Constants.expoConfig?.android?.versionCode?.toString() ??
  'dev';

export const AboutScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">About</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View className="items-center mt-6 mb-6">
          <View className="h-20 w-20 rounded-2xl bg-primary/10 items-center justify-center mb-3">
            <Cake size={40} color="#7C3AED" />
          </View>
          <Text className="text-heading text-foreground font-bold">BirthdayBuddy</Text>
          <Text className="text-body text-foreground-secondary mt-1">Never miss a birthday again</Text>
          <View className="flex-row items-center gap-4 mt-3">
            <View className="items-center">
              <Text className="text-[13px] font-bold text-foreground">Version</Text>
              <Text className="text-[12px] text-foreground-secondary">{appVersion}</Text>
            </View>
            <View className="h-4 w-[1px] bg-border" />
            <View className="items-center">
              <Text className="text-[13px] font-bold text-foreground">Build</Text>
              <Text className="text-[12px] text-foreground-secondary">{appBuild}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="bg-surface rounded-2xl p-4 border border-border/60 mb-4">
          <Text className="text-[14px] text-foreground leading-6">
            BirthdayBuddy is your personal birthday assistant that helps you remember, celebrate,
            and make every birthday special. With AI-powered wishes, beautiful card creation,
            smart reminders, and more.
          </Text>
        </View>

        {/* Links */}
        <View className="bg-surface rounded-2xl border border-border/60">
          <Pressable
            className="flex-row items-center py-3.5 px-4"
            onPress={() => router.push('/terms-conditions')}
            accessibilityRole="button">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DBEAFE]">
              <FileText size={18} color="#3B82F6" />
            </View>
            <Text className="text-[15px] font-medium text-foreground flex-1">Terms & Conditions</Text>
          </Pressable>
          <View className="h-[0.5px] bg-border/60 mx-4" />
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
            onPress={() => router.push('/open-source-licenses')}
            accessibilityRole="button">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#FCE7F3]">
              <FileText size={18} color="#EC4899" />
            </View>
            <Text className="text-[15px] font-medium text-foreground flex-1">Open Source Licenses</Text>
          </Pressable>
          <View className="h-[0.5px] bg-border/60 mx-4" />
          <Pressable
            className="flex-row items-center py-3.5 px-4"
            onPress={() => router.push('/help-center')}
            accessibilityRole="button">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#FEF3C7]">
              <Mail size={18} color="#F59E0B" />
            </View>
            <Text className="text-[15px] font-medium text-foreground flex-1">Contact Support</Text>
          </Pressable>
        </View>

        {/* Credits */}
        <View className="bg-surface rounded-2xl p-4 border border-border/60 mt-4">
          <Text className="text-[14px] font-bold text-foreground mb-2">Credits</Text>
          <Text className="text-[13px] text-foreground-secondary leading-5">
            Built with React Native, Expo, and love.{'\n'}
            Icons by Lucide Icons.{'\n'}
            UI inspired by modern consumer apps.
          </Text>
        </View>

        {/* Footer */}
        <View className="items-center mt-6 mb-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-[13px] text-foreground-secondary">Made with</Text>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
            <Text className="text-[13px] text-foreground-secondary">in India</Text>
          </View>
          <Text className="text-[11px] text-foreground-secondary/60 mt-1">© 2026 BirthdayBuddy. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
