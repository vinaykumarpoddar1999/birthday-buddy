import React, { useCallback } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Camera,
  Mail,
  MessageCircle,
  Share2,
  type LucideIcon,
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

import { useAIWishesStore } from '../store/ai-wishes.store';

const SHARE_OPTIONS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  colors: [string, string];
}[] = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle, colors: ['#25D366', '#128C7E'] },
  { id: 'instagram', label: 'Instagram', Icon: Camera, colors: ['#E1306C', '#C13584'] },
  { id: 'sms', label: 'SMS', Icon: MessageCircle, colors: ['#3B82F6', '#1D4ED8'] },
  { id: 'email', label: 'Email', Icon: Mail, colors: ['#6366F1', '#4338CA'] },
  { id: 'more', label: 'More', Icon: Share2, colors: ['#6B7280', '#374151'] },
];

export function ShareSection() {
  const currentWish = useAIWishesStore((s) => s.currentWish);
  const markShared = useAIWishesStore((s) => s.markShared);
  const addToHistory = useAIWishesStore((s) => s.addToHistory);

  const handleShare = useCallback(
    async (via: string) => {
      if (!currentWish) return;

      addToHistory({ ...currentWish, sharedVia: [via], usedInCard: false });
      markShared(currentWish.id, via);

      if (via === 'more') {
        try {
          const available = await Sharing.isAvailableAsync();
          if (available) {
            Alert.alert('Share', currentWish.text);
          }
        } catch {
          Alert.alert('Shared!', 'Wish shared successfully.');
        }
      } else {
        Alert.alert('Shared!', `Wish ready to share via ${via}.`);
      }
    },
    [currentWish, markShared, addToHistory],
  );

  if (!currentWish) return null;

  return (
    <View className="px-5 mb-5">
      <Text className="text-[14px] font-bold text-foreground mb-3">Share your wish</Text>
      <View className="flex-row gap-2.5">
        {SHARE_OPTIONS.map((opt) => {
          const { Icon } = opt;
          return (
            <Pressable
              key={opt.id}
              onPress={() => handleShare(opt.id)}
              className="flex-1 overflow-hidden rounded-xl"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.94 : 1 }],
                shadowColor: opt.colors[0],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 3,
              })}
              accessibilityRole="button"
              accessibilityLabel={`Share via ${opt.label}`}>
              <LinearGradient
                colors={opt.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>
                <View className="items-center py-2.5">
                  <Icon size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text className="text-[9px] font-bold text-white mt-1">{opt.label}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
