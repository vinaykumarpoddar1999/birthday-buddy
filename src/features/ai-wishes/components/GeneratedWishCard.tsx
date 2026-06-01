import React, { useCallback, useState } from 'react';
import { Alert, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ClipboardCopy,
  Pen,
  Heart,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';

import { useAIWishesStore } from '../store/ai-wishes.store';
import type { GeneratedWish } from '../types';

type Props = {
  wish: GeneratedWish;
  wishIndex: number;
  totalWishes: number;
  onRegenerate: () => void;
};

export function GeneratedWishCard({ wish, wishIndex, totalWishes, onRegenerate }: Props) {
  const updateText = useAIWishesStore((s) => s.updateCurrentWishText);
  const toggleFavorite = useAIWishesStore((s) => s.toggleFavorite);
  const addToHistory = useAIWishesStore((s) => s.addToHistory);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(wish.text);
  const [copied, setCopied] = useState(false);

  const wordCount = wish.text.trim().split(/\s+/).length;
  const charCount = wish.text.length;

  const handleCopy = useCallback(() => {
    if (Platform.OS === 'web') {
      navigator.clipboard?.writeText(wish.text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    addToHistory({ ...wish, sharedVia: [], usedInCard: false });
  }, [wish, addToHistory]);

  const handleEdit = useCallback(() => {
    if (isEditing) {
      updateText(editText);
      setIsEditing(false);
    } else {
      setEditText(wish.text);
      setIsEditing(true);
    }
  }, [isEditing, editText, wish.text, updateText]);

  const handleFavorite = useCallback(() => {
    addToHistory({ ...wish, sharedVia: [], usedInCard: false });
    toggleFavorite(wish.id);
  }, [wish, toggleFavorite, addToHistory]);

  const handleReset = useCallback(() => {
    updateText(wish.originalText);
    setEditText(wish.originalText);
    setIsEditing(false);
  }, [wish.originalText, updateText]);

  return (
    <View className="px-5 mb-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[14px] font-bold text-foreground">
            Your AI Generated Wish
          </Text>
          <Sparkles size={14} color="#7C3AED" />
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-[11px] text-foreground-muted">
            {wishIndex} / {totalWishes} wishes left
          </Text>
          <Pressable
            onPress={handleFavorite}
            className="h-7 w-7 rounded-full items-center justify-center bg-gray-50"
            accessibilityRole="button">
            <Heart
              size={13}
              color={wish.isFavorite ? '#EF4444' : '#9CA3AF'}
              fill={wish.isFavorite ? '#EF4444' : 'none'}
            />
          </Pressable>
        </View>
      </View>

      {/* Wish card */}
      <View
        className="bg-white rounded-2xl overflow-hidden border border-gray-100"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
        }}>
        <View className="p-4">
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

        {/* Meta */}
        <View className="flex-row items-center justify-between px-4 py-2.5 bg-gray-50/50 border-t border-gray-50">
          <Text className="text-[10px] text-foreground-muted">
            {wordCount} words · {charCount} chars
          </Text>
          {wish.isEdited && (
            <Text className="text-[10px] text-primary font-medium">Edited</Text>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row border-t border-gray-50">
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
          <View className="w-[1px] bg-gray-50" />
          <ActionButton
            icon={<RefreshCw size={14} color="#7C3AED" />}
            label="Regenerate"
            onPress={onRegenerate}
          />
          <View className="w-[1px] bg-gray-50" />
          <ActionButton
            icon={<Pen size={14} color={isEditing ? '#7C3AED' : '#6B7280'} />}
            label={isEditing ? 'Save' : 'Edit'}
            onPress={handleEdit}
            active={isEditing}
          />
          {wish.isEdited && (
            <>
              <View className="w-[1px] bg-gray-50" />
              <ActionButton
                icon={<RotateCcw size={14} color="#EF4444" />}
                label="Reset"
                onPress={handleReset}
              />
            </>
          )}
        </View>
      </View>
    </View>
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
      className={`flex-1 flex-row items-center justify-center py-3 gap-1.5 ${
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
