import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, ChevronDown, Globe } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { LanguageOption } from '../types';
import { WishSectionHeader } from './WishSectionHeader';
import { WishColors, WishShadows } from '../constants/design-tokens';

const LANGUAGES: LanguageOption[] = [
  { id: 'english', label: 'English', nativeLabel: 'English' },
  { id: 'hindi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { id: 'bengali', label: 'Bengali', nativeLabel: 'বাংলা' },
  { id: 'spanish', label: 'Spanish', nativeLabel: 'Español' },
  { id: 'french', label: 'French', nativeLabel: 'Français' },
  { id: 'german', label: 'German', nativeLabel: 'Deutsch' },
];

export function LanguageSelector() {
  const selectedLanguage = useAIWishesStore((s) => s.selectedLanguage);
  const setLanguage = useAIWishesStore((s) => s.setLanguage);
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.id === selectedLanguage) || LANGUAGES[0];

  return (
    <Animated.View
      entering={FadeInDown.delay(250).duration(400)}
      className="mb-4 px-5"
      style={{ zIndex: 50 }}>
      <WishSectionHeader step={3} title="Language" subtitle="Write wishes in their preferred language" Icon={Globe} />

      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between bg-surface border border-border/80 rounded-xl px-4 py-3 active:bg-primary/5"
        style={WishShadows.sm}
        accessibilityRole="button">
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
            <Globe size={16} color={WishColors.primary} />
          </View>
          <View>
            <Text className="text-[13px] font-semibold text-foreground">
              {current.label}
            </Text>
            {current.nativeLabel !== current.label && (
              <Text className="text-[10px] text-foreground-muted">
                {current.nativeLabel}
              </Text>
            )}
          </View>
        </View>
        <ChevronDown
          size={16}
          color="#9CA3AF"
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {open && (
        <View
          className="mt-1.5 bg-surface rounded-xl border border-border/80 overflow-hidden"
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            top: 90,
            zIndex: 100,
            ...WishShadows.lg,
          }}>
          {LANGUAGES.map((lang, idx) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <Pressable
                key={lang.id}
                onPress={() => {
                  setLanguage(lang.id);
                  setOpen(false);
                }}
                className={`flex-row items-center justify-between px-4 py-3 active:bg-primary/5 ${
                  idx < LANGUAGES.length - 1 ? 'border-b border-gray-50' : ''
                } ${isSelected ? 'bg-primary/5' : ''}`}
                accessibilityRole="button">
                <View className="flex-row items-center gap-2.5">
                  <Text
                    className={`text-[13px] ${
                      isSelected ? 'font-bold text-primary' : 'font-medium text-foreground'
                    }`}>
                    {lang.label}
                  </Text>
                  {lang.nativeLabel !== lang.label && (
                    <Text className="text-[11px] text-foreground-muted">{lang.nativeLabel}</Text>
                  )}
                </View>
                {isSelected && <Check size={16} color="#7C3AED" strokeWidth={2.5} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </Animated.View>
  );
}
