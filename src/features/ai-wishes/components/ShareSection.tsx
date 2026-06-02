import React, { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Copy, Share2 } from 'lucide-react-native';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { wishService } from '@/services/wish/wish.service';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { shareWish, type WishShareChannel } from '../utils/share-wish';
import { WishColors, WishShadows } from '../constants/design-tokens';

type ShareOption = {
  id: WishShareChannel;
  label: string;
  color: string;
  bg: string;
  renderIcon: (size: number) => React.ReactNode;
};

const SHARE_OPTIONS: ShareOption[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    bg: '#25D36618',
    renderIcon: (size) => <FontAwesome5 name="whatsapp" size={size} color="#25D366" />,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: '#0088CC',
    bg: '#0088CC18',
    renderIcon: (size) => <FontAwesome5 name="telegram-plane" size={size} color="#0088CC" />,
  },
  {
    id: 'sms',
    label: 'SMS',
    color: '#3B82F6',
    bg: '#3B82F618',
    renderIcon: (size) => <Ionicons name="chatbubble-ellipses" size={size} color="#3B82F6" />,
  },
  {
    id: 'email',
    label: 'Email',
    color: '#6366F1',
    bg: '#6366F118',
    renderIcon: (size) => <MaterialCommunityIcons name="email-outline" size={size} color="#6366F1" />,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    color: '#E4405F',
    bg: '#E4405F18',
    renderIcon: (size) => <FontAwesome5 name="instagram" size={size} color="#E4405F" />,
  },
  {
    id: 'copy',
    label: 'Copy',
    color: '#7C3AED',
    bg: '#7C3AED18',
    renderIcon: (size) => <Copy size={size} color="#7C3AED" strokeWidth={2} />,
  },
  {
    id: 'more',
    label: 'More',
    color: '#64748B',
    bg: '#64748B18',
    renderIcon: (size) => <Share2 size={size} color="#64748B" strokeWidth={2} />,
  },
];

type Props = {
  personName?: string;
};

export function ShareSection({ personName }: Props) {
  const currentWish = useAIWishesStore((s) => s.currentWish);
  const [sharingId, setSharingId] = useState<string | null>(null);

  const handleShare = useCallback(
    async (via: WishShareChannel) => {
      if (!currentWish) return;
      setSharingId(via);
      try {
        const ok = await shareWish(via, { text: currentWish.text, personName });
        if (ok) {
          await wishService.logShare(currentWish.id, via);
        }
      } catch {
        feedback.error('Share failed', 'Please try again or use Copy.');
      } finally {
        setSharingId(null);
      }
    },
    [currentWish, personName],
  );

  if (!currentWish) return null;

  return (
    <Animated.View entering={FadeInDown.delay(150).duration(400)} className="mb-8 px-5">
      <View className="flex-row items-center gap-2 mb-4">
        <View className="h-7 w-7 rounded-lg bg-primary/10 items-center justify-center">
          <Share2 size={14} color={WishColors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-extrabold text-foreground">Share your wish</Text>
          <Text className="text-[11px] text-foreground-muted mt-0.5">
            Send instantly via your favorite apps
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {SHARE_OPTIONS.map((opt) => {
          const isSharing = sharingId === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => void handleShare(opt.id)}
              disabled={sharingId !== null}
              className="items-center rounded-2xl border border-border/60 bg-surface px-3 py-3.5 active:opacity-85"
              style={({ pressed }) => ({
                width: '30%',
                minWidth: 96,
                transform: [{ scale: pressed ? 0.96 : 1 }],
                opacity: sharingId !== null && !isSharing ? 0.55 : 1,
                ...WishShadows.sm,
              })}
              accessibilityRole="button"
              accessibilityLabel={`Share via ${opt.label}`}
              accessibilityState={{ disabled: sharingId !== null }}>
              <View
                className="h-12 w-12 rounded-2xl items-center justify-center mb-2"
                style={{ backgroundColor: opt.bg }}>
                {opt.renderIcon(22)}
              </View>
              <Text className="text-[11px] font-bold text-foreground-secondary text-center">
                {isSharing ? '...' : opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
