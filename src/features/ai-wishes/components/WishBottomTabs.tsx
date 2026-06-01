import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Clock, FileText, Sparkles } from 'lucide-react-native';

import { useAIWishesStore } from '../store/ai-wishes.store';
import type { WishTabId } from '../types';

const TABS: { id: WishTabId; label: string; Icon: typeof Sparkles }[] = [
  { id: 'generate', label: 'AI Wish', Icon: Sparkles },
  { id: 'history', label: 'History', Icon: Clock },
  { id: 'templates', label: 'My Templates', Icon: FileText },
];

export function WishBottomTabs() {
  const activeTab = useAIWishesStore((s) => s.activeTab);
  const setActiveTab = useAIWishesStore((s) => s.setActiveTab);

  return (
    <View
      className="flex-row bg-white border-t border-gray-100"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 4,
      }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className="flex-1 items-center py-3"
            accessibilityRole="button"
            accessibilityLabel={tab.label}>
            <tab.Icon
              size={20}
              color={isActive ? '#7C3AED' : '#9CA3AF'}
              fill={isActive && tab.id === 'generate' ? '#7C3AED' : 'none'}
            />
            <Text
              className={`text-[10px] mt-1 font-semibold ${
                isActive ? 'text-primary' : 'text-foreground-muted'
              }`}>
              {tab.label}
            </Text>
            {isActive && (
              <View className="absolute top-0 left-1/3 right-1/3 h-[2.5px] bg-primary rounded-b-full" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
