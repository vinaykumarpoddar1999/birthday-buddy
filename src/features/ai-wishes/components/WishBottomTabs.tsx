import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, FileText, Sparkles } from 'lucide-react-native';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { WishTabId } from '../types';

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
    <View
      className="flex-row bg-white border-t border-gray-100"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 8,
      }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className="flex-1 items-center py-2.5 min-h-[52px] justify-center"
            accessibilityRole="button"
            accessibilityLabel={`${tab.label}${isActive ? ', active tab' : ''}`}>
            {isActive && (
              <View className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-primary rounded-b-full" />
            )}
            <View
              className={`h-8 w-8 rounded-xl items-center justify-center ${
                isActive ? 'bg-primary/10' : ''
              }`}>
              <tab.Icon
                size={20}
                color={isActive ? '#7C3AED' : '#9CA3AF'}
                fill={isActive && tab.id === 'generate' ? '#7C3AED' : 'none'}
              />
            </View>
            <Text
              className={`text-[10px] mt-0.5 font-semibold ${
                isActive ? 'text-primary' : 'text-foreground-muted'
              }`}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
