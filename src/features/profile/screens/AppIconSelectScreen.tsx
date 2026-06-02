import { router } from 'expo-router';
import { ArrowLeft, Cake, Check, Crown, Gift, PartyPopper } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appIconService } from '@/services/app-icon/app-icon.service';
import { useFeedback } from '@/shared/hooks/useFeedback';

import { useProfileStore } from '../store/profile.store';
import type { AppIconOption } from '../types';

const ICONS: { key: AppIconOption; icon: LucideIcon; label: string; desc: string; bg: string; color: string }[] = [
  { key: 'classic', icon: Cake, label: 'Classic', desc: 'Default BirthdayBuddy icon', bg: '#EDE9FE', color: '#7C3AED' },
  { key: 'premium', icon: Crown, label: 'Premium', desc: 'Exclusive premium icon', bg: '#FEF3C7', color: '#F59E0B' },
  { key: 'gift', icon: Gift, label: 'Gift Theme', desc: 'Gift-wrapped icon', bg: '#FCE7F3', color: '#EC4899' },
  { key: 'cake', icon: Cake, label: 'Cake Theme', desc: 'Birthday cake icon', bg: '#DCFCE7', color: '#22C55E' },
  { key: 'party', icon: PartyPopper, label: 'Party Theme', desc: 'Celebration icon', bg: '#DBEAFE', color: '#3B82F6' },
];

export const AppIconSelectScreen = () => {
  const appIcon = useProfileStore((s) => s.appIcon);
  const setAppIcon = useProfileStore((s) => s.setAppIcon);
  const { toast } = useFeedback();

  const handleSelect = (icon: AppIconOption) => {
    void appIconService.setIcon(icon).then((result) => {
      setAppIcon(icon);
      if (result.nativeApplied) {
        toast('App icon updated', 'success');
      } else {
        toast('App icon preference saved', 'success');
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">App Icon</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">Choose your app icon style.</Text>

        <View className="flex-row flex-wrap justify-between gap-y-3">
          {ICONS.map((item) => {
            const isSelected = appIcon === item.key;
            const Icon = item.icon;
            return (
              <Pressable
                key={item.key}
                onPress={() => handleSelect(item.key)}
                className={`w-[48%] rounded-2xl p-4 border-2 items-center ${isSelected ? 'border-primary bg-primary/5' : 'border-border/60 bg-surface'}`}
                accessibilityRole="button">
                {isSelected && <Check size={14} color="#7C3AED" style={{ position: 'absolute', top: 8, right: 8 }} />}
                <View className="h-16 w-16 rounded-2xl items-center justify-center mb-2" style={{ backgroundColor: item.bg }}>
                  <Icon size={28} color={item.color} />
                </View>
                <Text className={`text-[14px] font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{item.label}</Text>
                <Text className="text-[11px] text-foreground-secondary mt-0.5 text-center">{item.desc}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
