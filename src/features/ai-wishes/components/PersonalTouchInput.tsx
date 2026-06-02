import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Feather } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { WishSectionHeader } from './WishSectionHeader';

export function PersonalTouchInput() {
  const personalContext = useAIWishesStore((s) => s.personalContext);
  const setPersonalContext = useAIWishesStore((s) => s.setPersonalContext);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-5 mb-5">
      <WishSectionHeader
        step={4}
        title="Personal touch"
        subtitle="Optional — inside jokes & memories make wishes unforgettable"
        Icon={Feather}
      />

      <View
        className={`rounded-2xl overflow-hidden border ${
          isFocused ? 'border-primary' : 'border-gray-100'
        }`}
        style={
          isFocused
            ? {
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 3,
              }
            : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }
        }>
        <View className="flex-row items-start bg-white">
          <View className="pt-3.5 pl-3.5">
            <Feather size={16} color={isFocused ? '#7C3AED' : '#C4B5FD'} />
          </View>
          <TextInput
            value={personalContext}
            onChangeText={setPersonalContext}
            placeholder="e.g. inside jokes, memories, special moments..."
            placeholderTextColor="#C4B5FD"
            multiline
            maxLength={150}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 px-2.5 py-3.5 text-[13px] text-foreground min-h-[56px]"
            style={{ textAlignVertical: 'top' }}
          />
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-1.5 ml-1">
        <Text className="text-[9px] text-foreground-muted">
          Memories & inside jokes make wishes unforgettable
        </Text>
        <Text className={`text-[10px] ${personalContext.length >= 140 ? 'text-warning font-semibold' : 'text-foreground-muted'}`}>
          {personalContext.length}/150
        </Text>
      </View>
    </Animated.View>
  );
}
