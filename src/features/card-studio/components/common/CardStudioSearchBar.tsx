import React, { useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { studioTokens } from '../../constants/studio-tokens';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
};

export function CardStudioSearchBar({
  value,
  onChangeText,
  placeholder = 'Search templates...',
  accessibilityLabel = 'Search templates',
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center bg-surface rounded-2xl px-3 border ${
        focused ? 'border-primary/50' : 'border-border'
      }`}
      style={{ height: studioTokens.searchHeight }}>
      <Search size={16} color={studioTokens.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={studioTokens.colors.textMuted}
        className="flex-1 ml-2 text-body text-foreground"
        style={{
          flex: 1,
          height: studioTokens.searchHeight - 2,
          paddingVertical: 0,
          marginVertical: 0,
          lineHeight: 20,
          textAlignVertical: 'center',
          ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
        }}
        accessibilityLabel={accessibilityLabel}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={8}
          className="h-8 w-8 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Clear search">
          <X size={16} color={studioTokens.colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
