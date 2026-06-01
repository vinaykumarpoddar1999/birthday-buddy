import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';
import type { AppLanguage } from '../types';

const LANGUAGES: { key: AppLanguage; code: string; name: string; native: string }[] = [
  { key: 'english', code: 'EN', name: 'English', native: 'English' },
  { key: 'hindi', code: 'HI', name: 'Hindi', native: 'हिन्दी' },
  { key: 'bengali', code: 'BN', name: 'Bengali', native: 'বাংলা' },
  { key: 'spanish', code: 'ES', name: 'Spanish', native: 'Español' },
  { key: 'french', code: 'FR', name: 'French', native: 'Français' },
  { key: 'german', code: 'DE', name: 'German', native: 'Deutsch' },
  { key: 'arabic', code: 'AR', name: 'Arabic', native: 'العربية' },
  { key: 'japanese', code: 'JA', name: 'Japanese', native: '日本語' },
];

export const LanguageSelectScreen = () => {
  const language = useProfileStore((s) => s.language);
  const setLanguage = useProfileStore((s) => s.setLanguage);

  const handleSelect = (lang: AppLanguage) => {
    setLanguage(lang);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Language</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">Select your preferred language.</Text>

        <View className="bg-surface rounded-2xl border border-border/60">
          {LANGUAGES.map((lang, i) => {
            const isSelected = language === lang.key;
            return (
              <View key={lang.key}>
                {i > 0 && <View className="h-[0.5px] bg-border/60 mx-4" />}
                <Pressable
                  className={`flex-row items-center py-3.5 px-4 ${isSelected ? 'bg-primary/5' : ''}`}
                  onPress={() => handleSelect(lang.key)}
                  accessibilityRole="button">
                  <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <Text className="text-[11px] font-bold text-primary">{lang.code}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className={`text-[15px] font-medium ${isSelected ? 'text-primary font-bold' : 'text-foreground'}`}>{lang.name}</Text>
                    <Text className="text-[12px] text-foreground-secondary mt-0.5">{lang.native}</Text>
                  </View>
                  {isSelected && <Check size={20} color="#7C3AED" />}
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
