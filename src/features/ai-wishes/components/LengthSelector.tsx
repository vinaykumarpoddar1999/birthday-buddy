import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAIWishesStore } from '../store/ai-wishes.store';
import type { LengthOption, WishLength } from '../types';

const LENGTHS: LengthOption[] = [
  { id: 'short', label: 'Short', description: '1 Line' },
  { id: 'medium', label: 'Medium', description: '3 - 4 Lines' },
  { id: 'long', label: 'Long', description: 'Paragraph' },
];

export function LengthSelector() {
  const selectedLength = useAIWishesStore((s) => s.selectedLength);
  const setLength = useAIWishesStore((s) => s.setLength);

  return (
    <View className="mb-5 px-5">
      <Text className="text-[14px] font-bold text-foreground mb-3">2. Choose length</Text>
      <View className="flex-row gap-2.5">
        {LENGTHS.map((opt) => {
          const isActive = selectedLength === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setLength(opt.id)}
              className={`flex-1 items-center py-3 rounded-xl border ${
                isActive
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-100'
              }`}
              style={
                isActive
                  ? {
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 6,
                      elevation: 3,
                    }
                  : {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.04,
                      shadowRadius: 3,
                      elevation: 1,
                    }
              }
              accessibilityRole="button"
              accessibilityLabel={`${opt.label} length`}>
              <Text
                className={`text-[13px] font-bold ${
                  isActive ? 'text-white' : 'text-foreground'
                }`}>
                {opt.label}
              </Text>
              <Text
                className={`text-[10px] mt-0.5 ${
                  isActive ? 'text-white/70' : 'text-foreground-muted'
                }`}>
                {opt.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
