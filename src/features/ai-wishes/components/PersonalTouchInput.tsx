import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { useAIWishesStore } from '../store/ai-wishes.store';

export function PersonalTouchInput() {
  const personalContext = useAIWishesStore((s) => s.personalContext);
  const setPersonalContext = useAIWishesStore((s) => s.setPersonalContext);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="px-5 mb-5">
      <Text className="text-[14px] font-bold text-foreground mb-1">
        4. Add personal touch
        <Text className="text-foreground-muted font-normal text-[11px]"> (Optional)</Text>
      </Text>
      <Text className="text-[10px] text-foreground-muted mb-3">
        Add context to make the wish feel more personal
      </Text>

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
        <TextInput
          value={personalContext}
          onChangeText={setPersonalContext}
          placeholder="e.g. inside jokes, memories, special moments..."
          placeholderTextColor="#C4B5FD"
          multiline
          maxLength={150}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-white px-4 py-3.5 text-[13px] text-foreground min-h-[56px]"
          style={{ textAlignVertical: 'top' }}
        />
      </View>
      <Text className="text-[10px] text-foreground-muted mt-1.5 ml-1 text-right">
        {personalContext.length}/150
      </Text>
    </View>
  );
}
