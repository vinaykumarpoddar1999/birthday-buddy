import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Feather, Lightbulb } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { WishSectionHeader } from './WishSectionHeader';
import { WishColors, WishShadows } from '../constants/design-tokens';

const SUGGESTIONS = [
  'Shared memory',
  'Inside joke',
  'Favorite hobby',
  'Recent achievement',
  'What makes them special',
];

export function PersonalTouchInput() {
  const personalContext = useAIWishesStore((s) => s.personalContext);
  const setPersonalContext = useAIWishesStore((s) => s.setPersonalContext);
  const [isFocused, setIsFocused] = useState(false);

  const appendSuggestion = (hint: string) => {
    const prefix = personalContext.trim() ? `${personalContext.trim()}. ` : '';
    const next = `${prefix}${hint}: `;
    if (next.length <= 150) {
      setPersonalContext(next);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-5 mb-5">
      <WishSectionHeader
        step={4}
        title="Personal touch"
        subtitle="Optional — inside jokes & memories make wishes unforgettable"
        Icon={Feather}
      />

      <View
        className={`rounded-2xl overflow-hidden border bg-surface ${
          isFocused ? 'border-primary' : 'border-border/80'
        }`}
        style={isFocused ? WishShadows.md : WishShadows.sm}>
        <View className="flex-row items-start">
          <View className="pt-3.5 pl-3.5">
            <Feather size={16} color={isFocused ? WishColors.primary : '#C4B5FD'} />
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
            className="flex-1 px-2.5 py-3.5 text-[14px] text-foreground min-h-[64px]"
            style={{ textAlignVertical: 'top' }}
            accessibilityLabel="Personal context for wish"
          />
        </View>
      </View>

      <View className="flex-row items-center gap-1.5 mt-2 ml-0.5">
        <Lightbulb size={11} color={WishColors.foregroundMuted} />
        <Text className="text-[10px] text-foreground-muted flex-1">Quick prompts</Text>
        <Text
          className={`text-[10px] font-semibold ${
            personalContext.length >= 140 ? 'text-warning' : 'text-foreground-muted'
          }`}>
          {personalContext.length}/150
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2 mt-2">
        {SUGGESTIONS.map((hint) => (
          <Pressable
            key={hint}
            onPress={() => appendSuggestion(hint)}
            className="px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 active:bg-primary/15"
            accessibilityRole="button"
            accessibilityLabel={`Add ${hint} prompt`}>
            <Text className="text-[10px] font-semibold text-primary">{hint}</Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}
