import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';
const APP_ICON = require('../../../../assets/images/icon.png');

export const AboutScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">About</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="items-center mt-10 mb-8">
          <View
            className="rounded-[28px] overflow-hidden mb-5"
            style={{
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 10,
            }}>
            <Image source={APP_ICON} style={{ width: 96, height: 96 }} contentFit="cover" />
          </View>
          <Text className="text-[28px] text-foreground font-bold tracking-tight">Birthday Buddy</Text>
          <Text className="text-[14px] text-foreground-secondary mt-2">Version {appVersion}</Text>
        </View>

        <View className="rounded-3xl overflow-hidden mb-6">
          <LinearGradient
            colors={['#EDE9FE', '#FDF4FF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View className="px-6 py-6">
              <Text className="text-[16px] text-foreground font-semibold mb-3">Your birthday companion</Text>
              <Text className="text-[15px] text-foreground-secondary leading-7">
                Birthday Buddy helps you remember every important birthday, send thoughtful wishes, and create
                beautiful cards for the people you care about. Stay organized, never miss a celebration, and
                make every birthday feel special.
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View className="items-center mt-4 mb-4">
          <View className="flex-row items-center gap-1">
            <Text className="text-[13px] text-foreground-secondary">Made with</Text>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
            <Text className="text-[13px] text-foreground-secondary">for celebrations everywhere</Text>
          </View>
          <Text className="text-[11px] text-foreground-secondary/60 mt-2">
            © {new Date().getFullYear()} Birthday Buddy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
