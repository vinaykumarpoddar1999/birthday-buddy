import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown, Globe } from 'lucide-react-native';

import { useAIWishesStore } from '../store/ai-wishes.store';
import type { LanguageOption, WishLanguage } from '../types';

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
    <View className="mb-4 px-5" style={{ zIndex: 50 }}>
      <Text className="text-[14px] font-bold text-foreground mb-3">3. Language</Text>
      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
          elevation: 1,
        }}
        accessibilityRole="button">
        <View className="flex-row items-center gap-2">
          <Globe size={15} color="#7C3AED" />
          <Text className="text-[13px] font-semibold text-foreground">
            {current.label}
          </Text>
          <Text className="text-[11px] text-foreground-muted">
            {current.nativeLabel !== current.label ? `(${current.nativeLabel})` : ''}
          </Text>
        </View>
        <ChevronDown
          size={16}
          color="#9CA3AF"
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {open && (
        <View
          className="mt-1 bg-white rounded-xl border border-gray-100 overflow-hidden"
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            top: 78,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 10,
            zIndex: 100,
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
                className={`flex-row items-center justify-between px-4 py-3 ${
                  idx < LANGUAGES.length - 1 ? 'border-b border-gray-50' : ''
                } ${isSelected ? 'bg-primary/5' : ''}`}
                accessibilityRole="button">
                <Text
                  className={`text-[13px] ${
                    isSelected ? 'font-bold text-primary' : 'font-medium text-foreground'
                  }`}>
                  {lang.label}
                </Text>
                <Text className="text-[11px] text-foreground-muted">{lang.nativeLabel}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
