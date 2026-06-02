import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Check, ClipboardCopy, Pen, RotateCcw, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { feedback } from '@/shared/feedback';
import { wishService } from '@/services/wish/wish.service';
import { wishHistoryQueryKey } from '../hooks/useWishHistory';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { GeneratedWish } from '../types';
import { WishColors, WishShadows } from '../constants/design-tokens';

type Props = {
  wish: GeneratedWish;
};

export function GeneratedWishCard({ wish }: Props) {
  const queryClient = useQueryClient();
  const updateText = useAIWishesStore((s) => s.updateCurrentWishText);
  const setCurrentWish = useAIWishesStore((s) => s.setCurrentWish);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(wish.text);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditText(wish.text);
    setIsEditing(false);
    setCopied(false);
  }, [wish.id, wish.text]);

  const wordCount = (isEditing ? editText : wish.text).trim().split(/\s+/).filter(Boolean).length;
  const charCount = (isEditing ? editText : wish.text).length;

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
    feedback.success('Copied!', 'Wish copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  }, [wish.text]);

  const handleEdit = useCallback(async () => {
    if (isEditing) {
      if (!editText.trim()) {
        feedback.error('Empty wish', 'Please write something before saving.');
        return;
      }
      updateText(editText.trim());
      await wishService.updateText(wish.id, editText.trim());
      setCurrentWish({ ...wish, text: editText.trim(), isEdited: true });
      setIsEditing(false);
      invalidateHistory();
      feedback.success('Saved!', 'Your edits have been saved.');
    } else {
      setEditText(wish.text);
      setIsEditing(true);
    }
  }, [isEditing, editText, wish, updateText, setCurrentWish, invalidateHistory]);

  const handleReset = useCallback(async () => {
    updateText(wish.originalText);
    setEditText(wish.originalText);
    setIsEditing(false);
    await wishService.updateText(wish.id, wish.originalText);
    setCurrentWish({ ...wish, text: wish.originalText, isEdited: false });
    invalidateHistory();
    feedback.success('Reset', 'Wish restored to original.');
  }, [wish, updateText, setCurrentWish, invalidateHistory]);

  return (
    <Animated.View entering={FadeInDown.duration(500)} className="px-5 mb-5">
      <View className="flex-row items-center gap-2 mb-3">
        <View className="h-8 w-8 rounded-xl bg-primary/12 items-center justify-center">
          <Sparkles size={16} color={WishColors.primary} />
        </View>
        <View>
          <Text className="text-[15px] font-extrabold text-foreground">Your Generated Wish</Text>
          <Text className="text-[11px] text-foreground-muted">Copy or edit your message</Text>
        </View>
      </View>

      <View
        className="bg-surface rounded-2xl overflow-hidden border border-border/80"
        style={WishShadows.lg}>
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center flex-wrap gap-1.5">
            <View className="px-2.5 py-1 bg-primary/10 rounded-full">
              <Text className="text-[9px] font-bold text-primary uppercase">
                {wish.tone.replace('-', ' ')}
              </Text>
            </View>
            <View className="px-2.5 py-1 bg-border/40 rounded-full">
              <Text className="text-[9px] font-semibold text-foreground-muted uppercase">
                {wish.length}
              </Text>
            </View>
            {wish.isEdited && (
              <View className="px-2.5 py-1 bg-amber-50 rounded-full">
                <Text className="text-[9px] font-semibold text-amber-600">Edited</Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-4 pb-3">
          {isEditing ? (
            <TextInput
              value={editText}
              onChangeText={setEditText}
              multiline
              className="text-[15px] text-foreground leading-6 p-0 min-h-[120px]"
              style={{ textAlignVertical: 'top' }}
              autoFocus
              accessibilityLabel="Edit wish text"
            />
          ) : (
            <Text className="text-[15px] text-foreground leading-6">{wish.text}</Text>
          )}
        </View>

        <View className="flex-row items-center px-4 py-2.5 bg-background/80 border-t border-border/60">
          <Text className="text-[10px] text-foreground-muted flex-1">
            {wordCount} words · {charCount} chars
          </Text>
        </View>

        <View className="flex-row border-t border-border/60">
          <ActionButton
            icon={
              copied ? (
                <Check size={15} color={WishColors.success} strokeWidth={3} />
              ) : (
                <ClipboardCopy size={15} color={WishColors.foregroundSecondary} />
              )
            }
            label={copied ? 'Copied!' : 'Copy'}
            onPress={handleCopy}
            active={copied}
          />
          <ActionDivider />
          <ActionButton
            icon={<Pen size={15} color={isEditing ? WishColors.primary : WishColors.foregroundSecondary} />}
            label={isEditing ? 'Save' : 'Edit'}
            onPress={() => void handleEdit()}
            active={isEditing}
          />
          {wish.isEdited && (
            <>
              <ActionDivider />
              <ActionButton
                icon={<RotateCcw size={15} color={WishColors.error} />}
                label="Reset"
                onPress={() => void handleReset()}
              />
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

function ActionDivider() {
  return <View className="w-px bg-border/60 self-stretch" />;
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
      className={`flex-1 flex-row items-center justify-center py-3.5 gap-1.5 active:bg-primary/5 ${
        active ? 'bg-primary/8' : ''
      }`}
      accessibilityRole="button"
      accessibilityLabel={label}>
      {icon}
      <Text
        className={`text-[11px] font-bold ${
          active ? 'text-primary' : 'text-foreground-secondary'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
