import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Crown, Sparkles } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';

export function FilterPanel() {
  const filters = useCardStudioStore((s) => s.filters);
  const setFilters = useCardStudioStore((s) => s.setFilters);
  const resetFilters = useCardStudioStore((s) => s.resetFilters);

  const togglePremium = () => {
    if (filters.isPremiumOnly) {
      setFilters({ isPremiumOnly: false });
    } else {
      setFilters({ isPremiumOnly: true, isFreeOnly: false });
    }
  };

  const toggleFree = () => {
    if (filters.isFreeOnly) {
      setFilters({ isFreeOnly: false });
    } else {
      setFilters({ isFreeOnly: true, isPremiumOnly: false });
    }
  };

  return (
    <View className="flex-row items-center px-5 gap-2 mb-3">
      <Pressable
        onPress={togglePremium}
        className={`flex-row items-center px-3 py-1.5 rounded-full gap-1 border ${filters.isPremiumOnly ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}
        accessibilityRole="button"
        accessibilityState={{ selected: filters.isPremiumOnly }}>
        <Crown size={12} color={filters.isPremiumOnly ? '#D97706' : '#9CA3AF'} />
        <Text className={`text-[11px] font-semibold ${filters.isPremiumOnly ? 'text-amber-700' : 'text-foreground-muted'}`}>
          Premium
        </Text>
      </Pressable>
      <Pressable
        onPress={toggleFree}
        className={`flex-row items-center px-3 py-1.5 rounded-full gap-1 border ${filters.isFreeOnly ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
        accessibilityRole="button"
        accessibilityState={{ selected: filters.isFreeOnly }}>
        <Sparkles size={12} color={filters.isFreeOnly ? '#16A34A' : '#9CA3AF'} />
        <Text className={`text-[11px] font-semibold ${filters.isFreeOnly ? 'text-green-700' : 'text-foreground-muted'}`}>
          Free
        </Text>
      </Pressable>
      {(filters.isPremiumOnly || filters.isFreeOnly) ? (
        <Pressable onPress={resetFilters} accessibilityRole="button">
          <Text className="text-[11px] text-primary font-semibold">Clear</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
