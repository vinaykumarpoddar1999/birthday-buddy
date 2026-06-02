import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, FileText, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { WishTabId } from '../types';
import { WishColors, WishShadows } from '../constants/design-tokens';

const TABS: { id: WishTabId; label: string; Icon: typeof Sparkles }[] = [
  { id: 'generate', label: 'Generate', Icon: Sparkles },
  { id: 'history', label: 'History', Icon: Clock },
  { id: 'templates', label: 'Templates', Icon: FileText },
];

export function WishBottomTabs() {
  const insets = useSafeAreaInsets();
  const activeTab = useAIWishesStore((s) => s.activeTab);
  const setActiveTab = useAIWishesStore((s) => s.setActiveTab);

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      className="flex-row bg-surface border-t border-border/60"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        ...WishShadows.sm,
        shadowOffset: { width: 0, height: -4 },
      }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className="flex-1 items-center py-2.5 min-h-[56px] justify-center active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={`${tab.label}${isActive ? ', active tab' : ''}`}
            accessibilityState={{ selected: isActive }}>
            {isActive && (
              <View className="absolute top-0 left-[20%] right-[20%] h-[3px] bg-primary rounded-b-full" />
            )}
            <View
              className={`h-9 w-9 rounded-xl items-center justify-center ${
                isActive ? 'bg-primary/12' : 'bg-transparent'
              }`}>
              <tab.Icon
                size={20}
                color={isActive ? WishColors.primary : WishColors.foregroundMuted}
                fill={isActive && tab.id === 'generate' ? WishColors.primary : 'none'}
              />
            </View>
            <Text
              className={`text-[10px] mt-1 font-bold ${
                isActive ? 'text-primary' : 'text-foreground-muted'
              }`}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
