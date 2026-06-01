import { router } from 'expo-router';
import { ArrowLeft, Check, Monitor, Moon, Sun } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { useProfileStore } from '../store/profile.store';
import { useThemeStore } from '@/stores/theme.store';

type ThemeItem = { key: 'light' | 'dark' | 'system'; icon: LucideIcon; title: string; desc: string; bg: string; iconColor: string };

const THEMES: ThemeItem[] = [
  { key: 'light', icon: Sun, title: 'Light', desc: 'Bright and clean interface', bg: '#FEF3C7', iconColor: '#F59E0B' },
  { key: 'dark', icon: Moon, title: 'Dark', desc: 'Easy on the eyes at night', bg: '#1E293B', iconColor: '#94A3B8' },
  { key: 'system', icon: Monitor, title: 'System', desc: 'Follows your device settings', bg: '#EDE9FE', iconColor: '#7C3AED' },
];

export const ThemeSelectScreen = () => {
  const theme = useProfileStore((s) => s.theme);
  const setTheme = useProfileStore((s) => s.setTheme);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const handleSelect = (t: 'light' | 'dark' | 'system') => {
    setTheme(t);
    setThemeMode(t);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Theme</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">Choose your app appearance.</Text>

        <View className="gap-3">
          {THEMES.map((t) => {
            const isSelected = theme === t.key;
            const Icon = t.icon;
            return (
              <Pressable
                key={t.key}
                onPress={() => handleSelect(t.key)}
                className={`bg-surface rounded-2xl p-4 border-2 flex-row items-center ${isSelected ? 'border-primary' : 'border-border/60'}`}
                accessibilityRole="button">
                <View className="h-14 w-14 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: t.bg }}>
                  <Icon size={28} color={t.iconColor} />
                </View>
                <View className="flex-1">
                  <Text className={`text-[16px] font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{t.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5">{t.desc}</Text>
                </View>
                {isSelected && (
                  <View className="h-6 w-6 rounded-full bg-primary items-center justify-center">
                    <Check size={14} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
