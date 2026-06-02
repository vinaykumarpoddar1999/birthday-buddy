import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Zap, Type, FileText, type LucideIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { WishLength } from '../types';
import { WishSectionHeader } from './WishSectionHeader';

type LengthItem = {
  id: WishLength;
  label: string;
  description: string;
  Icon: LucideIcon;
};

const LENGTHS: LengthItem[] = [
  { id: 'short', label: 'Short', description: '1 Line', Icon: Zap },
  { id: 'medium', label: 'Medium', description: '3-4 Lines', Icon: Type },
  { id: 'long', label: 'Long', description: 'Paragraph', Icon: FileText },
];

export function LengthSelector() {
  const selectedLength = useAIWishesStore((s) => s.selectedLength);
  const setLength = useAIWishesStore((s) => s.setLength);

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-5">
      <WishSectionHeader step={2} title="Choose length" subtitle="Short punchy line or a full paragraph" Icon={Type} />
      <View className="px-5">

      <View className="flex-row gap-2.5">
        {LENGTHS.map((opt) => {
          const isActive = selectedLength === opt.id;
          const { Icon } = opt;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setLength(opt.id)}
              className="flex-1 overflow-hidden rounded-xl border"
              style={[
                isActive
                  ? {
                      borderColor: '#7C3AED',
                      backgroundColor: '#F5F3FF',
                      shadowColor: '#7C3AED',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 3,
                    }
                  : {
                      borderColor: '#F3F4F6',
                      backgroundColor: '#FFFFFF',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.04,
                      shadowRadius: 3,
                      elevation: 1,
                    },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${opt.label} length`}>
              <View className="items-center py-3 px-2">
                <View
                  className="h-8 w-8 rounded-lg items-center justify-center mb-1.5"
                  style={{
                    backgroundColor: isActive ? '#7C3AED' : '#F3F4F6',
                  }}>
                  <Icon size={16} color={isActive ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
                </View>
                <Text
                  className={`text-[13px] font-bold ${
                    isActive ? 'text-primary' : 'text-foreground'
                  }`}>
                  {opt.label}
                </Text>
                <Text
                  className={`text-[10px] mt-0.5 ${
                    isActive ? 'text-primary/70' : 'text-foreground-muted'
                  }`}>
                  {opt.description}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      </View>
    </Animated.View>
  );
}
