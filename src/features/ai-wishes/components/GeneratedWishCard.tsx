import React, { useCallback, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import {
  Check,
  ClipboardCopy,
  Heart,
  Pen,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { wishService } from '@/services/wish/wish.service';
import { wishHistoryQueryKey } from '../hooks/useWishHistory';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { GeneratedWish } from '../types';

type Props = {
  wish: GeneratedWish;
  wishIndex: number;
  totalWishes: number;
  onRegenerate: () => void;
};

export function GeneratedWishCard({ wish, onRegenerate }: Props) {
  const queryClient = useQueryClient();
  const updateText = useAIWishesStore((s) => s.updateCurrentWishText);
  const setCurrentWish = useAIWishesStore((s) => s.setCurrentWish);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(wish.text);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(wish.isFavorite);

  const wordCount = wish.text.trim().split(/\s+/).length;
  const charCount = wish.text.length;

  const invalidateHistory = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: wishHistoryQueryKey });
  }, [queryClient]);

  const handleCopy = useCallback(() => {
    if (Platform.OS === 'web') {
      void navigator.clipboard?.writeText(wish.text);
    } else {
      void Clipboard.setStringAsync(wish.text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [wish.text]);

  const handleEdit = useCallback(async () => {
    if (isEditing) {
      updateText(editText);
      await wishService.updateText(wish.id, editText);
      setCurrentWish({ ...wish, text: editText, isEdited: true });
      setIsEditing(false);
      invalidateHistory();
    } else {
      setEditText(wish.text);
      setIsEditing(true);
    }
  }, [isEditing, editText, wish, updateText, setCurrentWish, invalidateHistory]);

  const handleFavorite = useCallback(async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    await wishService.toggleFavorite(wish.id, next);
    setCurrentWish({ ...wish, isFavorite: next });
    invalidateHistory();
  }, [wish, isFavorite, setCurrentWish, invalidateHistory]);

  const handleReset = useCallback(() => {
    updateText(wish.originalText);
    setEditText(wish.originalText);
    setIsEditing(false);
    void wishService.updateText(wish.id, wish.originalText);
    setCurrentWish({ ...wish, text: wish.originalText, isEdited: false });
    invalidateHistory();
  }, [wish, updateText, setCurrentWish, invalidateHistory]);

  return (
    <Animated.View entering={FadeInDown.duration(500)} className="px-5 mb-5">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Sparkles size={16} color="#7C3AED" />
          <Text className="text-[15px] font-bold text-foreground">
            Your Generated Wish
          </Text>
        </View>
        <Pressable
          onPress={handleFavorite}
          className="h-8 w-8 rounded-full items-center justify-center bg-gray-50 active:bg-gray-100"
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <Heart
            size={15}
            color={isFavorite ? '#EF4444' : '#9CA3AF'}
            fill={isFavorite ? '#EF4444' : 'none'}
          />
        </Pressable>
      </View>

      <View
        className="bg-white rounded-2xl overflow-hidden border border-gray-100"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 5,
        }}>
        <LinearGradient
          colors={['#F5F3FF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <View className="p-4 pb-0">
            <View className="flex-row items-center gap-1.5 mb-2">
              <View className="px-2 py-0.5 bg-primary/10 rounded-full">
                <Text className="text-[9px] font-bold text-primary uppercase">{wish.tone}</Text>
              </View>
              <View className="px-2 py-0.5 bg-gray-100 rounded-full">
                <Text className="text-[9px] font-semibold text-foreground-muted uppercase">{wish.length}</Text>
              </View>
              {wish.isEdited && (
                <View className="px-2 py-0.5 bg-amber-50 rounded-full">
                  <Text className="text-[9px] font-semibold text-amber-600">Edited</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        <View className="px-4 pb-3">
          {isEditing ? (
            <TextInput
              value={editText}
              onChangeText={setEditText}
              multiline
              className="text-[14px] text-foreground leading-6 p-0 min-h-[100px]"
              style={{ textAlignVertical: 'top' }}
              autoFocus
            />
          ) : (
            <Text className="text-[14px] text-foreground leading-6">
              {wish.text}
            </Text>
          )}
        </View>

        <View className="flex-row items-center px-4 py-2 bg-gray-50/80 border-t border-gray-50">
          <Text className="text-[10px] text-foreground-muted flex-1">
            {wordCount} words  ·  {charCount} chars
          </Text>
        </View>

        <View className="flex-row border-t border-gray-100">
          <ActionButton
            icon={
              copied ? (
                <Check size={14} color="#22C55E" strokeWidth={3} />
              ) : (
                <ClipboardCopy size={14} color="#6B7280" />
              )
            }
            label={copied ? 'Copied!' : 'Copy'}
            onPress={handleCopy}
            active={copied}
          />
          <View className="w-[1px] bg-gray-100" />
          <ActionButton
            icon={<RefreshCw size={14} color="#7C3AED" />}
            label="Regenerate"
            onPress={onRegenerate}
          />
          <View className="w-[1px] bg-gray-100" />
          <ActionButton
            icon={<Pen size={14} color={isEditing ? '#7C3AED' : '#6B7280'} />}
            label={isEditing ? 'Save' : 'Edit'}
            onPress={handleEdit}
            active={isEditing}
          />
          {wish.isEdited && (
            <>
              <View className="w-[1px] bg-gray-100" />
              <ActionButton
                icon={<RotateCcw size={14} color="#EF4444" />}
                label="Reset"
                onPress={handleReset}
              />
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center py-3 gap-1.5 active:bg-gray-50 ${
        active ? 'bg-primary/5' : ''
      }`}
      accessibilityRole="button">
      {icon}
      <Text
        className={`text-[11px] font-semibold ${
          active ? 'text-primary' : 'text-foreground-secondary'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
