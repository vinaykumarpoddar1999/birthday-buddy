import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';
import type { AppCurrency } from '../types';

const CURRENCIES: { key: AppCurrency; symbol: string; name: string }[] = [
  { key: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { key: 'USD', symbol: '$', name: 'US Dollar' },
  { key: 'EUR', symbol: '€', name: 'Euro' },
  { key: 'GBP', symbol: '£', name: 'British Pound' },
];

export const CurrencySelectScreen = () => {
  const currency = useProfileStore((s) => s.currency);
  const setCurrency = useProfileStore((s) => s.setCurrency);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Currency</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">Select currency for gifts and orders.</Text>

        <View className="bg-surface rounded-2xl border border-border/60">
          {CURRENCIES.map((c, i) => {
            const isSelected = currency === c.key;
            return (
              <View key={c.key}>
                {i > 0 && <View className="h-[0.5px] bg-border/60 mx-4" />}
                <Pressable
                  className={`flex-row items-center py-3.5 px-4 ${isSelected ? 'bg-primary/5' : ''}`}
                  onPress={() => setCurrency(c.key)}
                  accessibilityRole="button">
                  <View className="h-10 w-10 rounded-xl items-center justify-center mr-3 bg-primary/10">
                    <Text className="text-[18px] font-bold text-primary">{c.symbol}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className={`text-[15px] font-medium ${isSelected ? 'text-primary font-bold' : 'text-foreground'}`}>{c.key}</Text>
                    <Text className="text-[12px] text-foreground-secondary mt-0.5">{c.name}</Text>
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
