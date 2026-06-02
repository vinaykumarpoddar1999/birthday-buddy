import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Copy,
  Mail,
  MessageCircle,
  Send,
  Share2,
  type LucideIcon,
} from 'lucide-react-native';
import { wishService } from '@/services/wish/wish.service';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { shareWish, type WishShareChannel } from '../utils/share-wish';
import { WishColors, WishShadows } from '../constants/design-tokens';

const SHARE_OPTIONS: {
  id: WishShareChannel;
  label: string;
  Icon: LucideIcon;
  color: string;
  bg: string;
}[] = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle, color: '#25D366', bg: '#25D36614' },
  { id: 'telegram', label: 'Telegram', Icon: Send, color: '#0088CC', bg: '#0088CC14' },
  { id: 'sms', label: 'SMS', Icon: MessageCircle, color: '#3B82F6', bg: '#3B82F614' },
  { id: 'email', label: 'Email', Icon: Mail, color: '#6366F1', bg: '#6366F114' },
  { id: 'instagram', label: 'Instagram', Icon: Share2, color: '#E4405F', bg: '#E4405F14' },
  { id: 'copy', label: 'Copy', Icon: Copy, color: '#7C3AED', bg: '#7C3AED14' },
  { id: 'more', label: 'More', Icon: Share2, color: '#6B7280', bg: '#6B728014' },
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
    <Animated.View entering={FadeInDown.delay(150).duration(400)} className="mb-5">
      <View className="flex-row items-center gap-2 px-5 mb-3">
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-2.5">
        {SHARE_OPTIONS.map((opt) => {
          const isSharing = sharingId === opt.id;
          const { Icon } = opt;
          return (
            <Pressable
              key={opt.id}
              onPress={() => void handleShare(opt.id)}
              disabled={sharingId !== null}
              className="items-center rounded-2xl border border-border/80 bg-surface px-3 py-3 min-w-[72px] active:opacity-80"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.95 : 1 }],
                opacity: sharingId !== null && !isSharing ? 0.6 : 1,
                ...WishShadows.sm,
              })}
              accessibilityRole="button"
              accessibilityLabel={`Share via ${opt.label}`}
              accessibilityState={{ disabled: sharingId !== null }}>
              <View
                className="h-10 w-10 rounded-xl items-center justify-center mb-1.5"
                style={{ backgroundColor: opt.bg }}>
                <Icon size={18} color={opt.color} strokeWidth={2} />
              </View>
              <Text className="text-[10px] font-bold text-foreground-secondary">{opt.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
