import { router } from 'expo-router';
import { ArrowLeft, Check, Monitor, Moon, Sun } from 'lucide-react-native';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { useProfileStore } from '../store/profile.store';
import type { AppearanceSettings } from '../types';

const THEMES: { key: AppearanceSettings['theme']; icon: LucideIcon; title: string }[] = [
  { key: 'light', icon: Sun, title: 'Light' },
  { key: 'dark', icon: Moon, title: 'Dark' },
  { key: 'system', icon: Monitor, title: 'System' },
];

const ACCENT_COLORS = ['#7C3AED', '#EC4899', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444'];
const FONT_SIZES: AppearanceSettings['fontSize'][] = ['small', 'medium', 'large'];
const CARD_STYLES: AppearanceSettings['cardStyle'][] = ['classic', 'modern', 'minimal'];
const DENSITIES: AppearanceSettings['layoutDensity'][] = ['compact', 'comfortable', 'spacious'];

export const AppearanceSettingsScreen = () => {
  const appearance = useProfileStore((s) => s.appearanceSettings);
  const updateAppearance = useProfileStore((s) => s.updateAppearanceSettings);
  const setTheme = useProfileStore((s) => s.setTheme);

  const handleTheme = (t: AppearanceSettings['theme']) => {
    setTheme(t);
    updateAppearance({ theme: t });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Appearance</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">Customize how BirthdayBuddy looks and feels.</Text>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Theme</Text>
        <View className="flex-row gap-2 mb-5">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const selected = appearance.theme === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => handleTheme(t.key)}
                className={`flex-1 rounded-xl p-3 items-center border-2 ${selected ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}
                accessibilityRole="button">
                <Icon size={22} color={selected ? '#7C3AED' : '#9CA3AF'} />
                <Text className={`text-[12px] font-semibold mt-1 ${selected ? 'text-primary' : 'text-foreground-secondary'}`}>{t.title}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Accent Color</Text>
        <View className="flex-row flex-wrap gap-3 mb-5">
          {ACCENT_COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => updateAppearance({ accentColor: color })}
              className={`h-10 w-10 rounded-full items-center justify-center ${appearance.accentColor === color ? 'border-2 border-foreground' : ''}`}
              style={{ backgroundColor: color }}
              accessibilityRole="button">
              {appearance.accentColor === color && <Check size={16} color="#FFFFFF" />}
            </Pressable>
          ))}
        </View>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Font Size</Text>
        <View className="flex-row gap-2 mb-5">
          {FONT_SIZES.map((size) => (
            <Pressable
              key={size}
              onPress={() => updateAppearance({ fontSize: size })}
              className={`flex-1 py-2.5 rounded-xl items-center border capitalize ${appearance.fontSize === size ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
              accessibilityRole="button">
              <Text className={`text-[13px] font-semibold ${appearance.fontSize === size ? 'text-primary' : 'text-foreground-secondary'}`}>{size}</Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Card Style</Text>
        <View className="flex-row gap-2 mb-5">
          {CARD_STYLES.map((style) => (
            <Pressable
              key={style}
              onPress={() => updateAppearance({ cardStyle: style })}
              className={`flex-1 py-2.5 rounded-xl items-center border capitalize ${appearance.cardStyle === style ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
              accessibilityRole="button">
              <Text className={`text-[13px] font-semibold ${appearance.cardStyle === style ? 'text-primary' : 'text-foreground-secondary'}`}>{style}</Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Layout Density</Text>
        <View className="flex-row gap-2 mb-5">
          {DENSITIES.map((d) => (
            <Pressable
              key={d}
              onPress={() => updateAppearance({ layoutDensity: d })}
              className={`flex-1 py-2.5 rounded-xl items-center border capitalize ${appearance.layoutDensity === d ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
              accessibilityRole="button">
              <Text className={`text-[11px] font-semibold ${appearance.layoutDensity === d ? 'text-primary' : 'text-foreground-secondary'}`}>{d}</Text>
            </Pressable>
          ))}
        </View>

        <View className="bg-surface rounded-2xl px-4 border border-border/60">
          <View className="flex-row items-center py-3.5">
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Animations</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Enable smooth transitions</Text>
            </View>
            <Switch
              value={appearance.animationsEnabled}
              onValueChange={(v) => updateAppearance({ animationsEnabled: v })}
              trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
