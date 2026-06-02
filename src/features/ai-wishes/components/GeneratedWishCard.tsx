import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import {
  Bookmark,
  Check,
  ClipboardCopy,
  Heart,
  Pen,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
} from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { feedback } from '@/shared/feedback';
import { wishService } from '@/services/wish/wish.service';
import { wishHistoryQueryKey } from '../hooks/useWishHistory';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { shareWish } from '../utils/share-wish';
import type { GeneratedWish } from '../types';
import { WishColors, WishGradients, WishShadows } from '../constants/design-tokens';

type Props = {
  wish: GeneratedWish;
  onRegenerate: () => void;
  isGenerating?: boolean;
};

export function GeneratedWishCard({ wish, onRegenerate, isGenerating = false }: Props) {
  const queryClient = useQueryClient();
  const updateText = useAIWishesStore((s) => s.updateCurrentWishText);
  const setCurrentWish = useAIWishesStore((s) => s.setCurrentWish);
  const saveTemplate = useAIWishesStore((s) => s.saveTemplate);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(wish.text);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(wish.isFavorite);

  const heartScale = useSharedValue(1);

  useEffect(() => {
    setEditText(wish.text);
    setIsEditing(false);
    setIsFavorite(wish.isFavorite);
    setCopied(false);
    setSaved(false);
  }, [wish.id, wish.text, wish.isFavorite]);

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

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

  const handleFavorite = useCallback(async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    heartScale.value = withSequence(withSpring(1.35), withSpring(1));
    await wishService.toggleFavorite(wish.id, next);
    setCurrentWish({ ...wish, isFavorite: next });
    invalidateHistory();
  }, [wish, isFavorite, setCurrentWish, invalidateHistory, heartScale]);

  const handleReset = useCallback(async () => {
    updateText(wish.originalText);
    setEditText(wish.originalText);
    setIsEditing(false);
    await wishService.updateText(wish.id, wish.originalText);
    setCurrentWish({ ...wish, text: wish.originalText, isEdited: false });
    invalidateHistory();
    feedback.success('Reset', 'Wish restored to original.');
  }, [wish, updateText, setCurrentWish, invalidateHistory]);

  const handleSaveTemplate = useCallback(() => {
    saveTemplate({
      id: `tpl_${Date.now()}`,
      name: `${wish.tone.replace('-', ' ')} · ${wish.personName}`,
      text: wish.text,
      tone: wish.tone,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
    feedback.success('Template saved!', 'Find it in the Templates tab.');
    setTimeout(() => setSaved(false), 2000);
  }, [wish, saveTemplate]);

  const handleQuickShare = useCallback(async () => {
    await shareWish('more', { text: wish.text, personName: wish.personName });
    await wishService.logShare(wish.id, 'more');
  }, [wish]);

  return (
    <Animated.View entering={FadeInDown.duration(500)} className="px-5 mb-5">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 rounded-xl bg-primary/12 items-center justify-center">
            <Sparkles size={16} color={WishColors.primary} />
          </View>
          <View>
            <Text className="text-[15px] font-extrabold text-foreground">Your Generated Wish</Text>
            <Text className="text-[11px] text-foreground-muted">Tap actions below to refine & share</Text>
          </View>
        </View>
        <Pressable
          onPress={() => void handleFavorite()}
          className="h-10 w-10 rounded-full items-center justify-center bg-surface border border-border/80 active:bg-red-50"
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <Animated.View style={heartAnimStyle}>
            <Heart
              size={18}
              color={isFavorite ? WishColors.error : WishColors.foregroundMuted}
              fill={isFavorite ? WishColors.error : 'none'}
            />
          </Animated.View>
        </Pressable>
      </View>

      <View
        className="bg-surface rounded-2xl overflow-hidden border border-border/80"
        style={WishShadows.lg}>
        <LinearGradient
          colors={[...WishGradients.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}>
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row items-center flex-wrap gap-1.5">
              <View className="px-2.5 py-1 bg-primary/10 rounded-full">
                <Text className="text-[9px] font-bold text-primary uppercase">{wish.tone.replace('-', ' ')}</Text>
              </View>
              <View className="px-2.5 py-1 bg-border/40 rounded-full">
                <Text className="text-[9px] font-semibold text-foreground-muted uppercase">{wish.length}</Text>
              </View>
              <View className="px-2.5 py-1 bg-border/40 rounded-full">
                <Text className="text-[9px] font-semibold text-foreground-muted capitalize">{wish.language}</Text>
              </View>
              {wish.isEdited && (
                <View className="px-2.5 py-1 bg-amber-50 rounded-full">
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

        <View className="flex-row flex-wrap border-t border-border/60">
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
            icon={<Share2 size={15} color={WishColors.primary} />}
            label="Share"
            onPress={() => void handleQuickShare()}
          />
          <ActionDivider />
          <ActionButton
            icon={
              saved ? (
                <Check size={15} color={WishColors.success} strokeWidth={3} />
              ) : (
                <Bookmark size={15} color={WishColors.foregroundSecondary} />
              )
            }
            label={saved ? 'Saved!' : 'Save'}
            onPress={handleSaveTemplate}
            active={saved}
          />
          <ActionDivider />
          <ActionButton
            icon={<RefreshCw size={15} color={WishColors.primary} />}
            label={isGenerating ? 'Wait...' : 'Regenerate'}
            onPress={onRegenerate}
            disabled={isGenerating}
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
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 min-w-[20%] flex-row items-center justify-center py-3.5 gap-1.5 active:bg-primary/5 ${
        active ? 'bg-primary/8' : ''
      } ${disabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}>
      {icon}
      <Text
        className={`text-[10px] font-bold ${
          active ? 'text-primary' : 'text-foreground-secondary'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
