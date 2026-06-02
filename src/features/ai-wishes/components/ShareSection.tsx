import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Camera,
  Mail,
  MessageCircle,
  Send,
  Share2,
  type LucideIcon,
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import { wishService } from '@/services/wish/wish.service';
import { useAIWishesStore } from '../store/ai-wishes.store';

const SHARE_OPTIONS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  colors: [string, string];
}[] = [
  { id: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle, colors: ['#25D366', '#128C7E'] },
  { id: 'instagram', label: 'Instagram', Icon: Camera, colors: ['#E1306C', '#C13584'] },
  { id: 'sms', label: 'SMS', Icon: Send, colors: ['#3B82F6', '#1D4ED8'] },
  { id: 'email', label: 'Email', Icon: Mail, colors: ['#6366F1', '#4338CA'] },
  { id: 'more', label: 'More', Icon: Share2, colors: ['#6B7280', '#374151'] },
];

export function ShareSection() {
  const currentWish = useAIWishesStore((s) => s.currentWish);

  const handleShare = useCallback(
    async (via: string) => {
      if (!currentWish) return;
      await wishService.logShare(currentWish.id, via);
      if (via === 'more') {
        try {
          const available = await Sharing.isAvailableAsync();
          if (available) {
            feedback.success('Share', currentWish.text);
          }
        } catch {
          feedback.success('Shared!', 'Wish shared successfully.');
        }
      } else {
        feedback.success('Shared!', `Wish ready to share via ${via}.`);
      }
    },
    [currentWish],
  );

  if (!currentWish) return null;

  return (
    <Animated.View entering={FadeInDown.delay(150).duration(400)} className="px-5 mb-5">
      <View className="flex-row items-center gap-2 mb-3">
        <Share2 size={16} color="#7C3AED" />
        <Text className="text-[14px] font-bold text-foreground">Share your wish</Text>
      </View>

      <View className="flex-row gap-2">
        {SHARE_OPTIONS.map((opt) => {
          const { Icon } = opt;
          return (
            <Pressable
              key={opt.id}
              onPress={() => handleShare(opt.id)}
              className="flex-1 overflow-hidden rounded-xl"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.92 : 1 }],
                shadowColor: opt.colors[0],
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              })}
              accessibilityRole="button"
              accessibilityLabel={`Share via ${opt.label}`}>
              <LinearGradient
                colors={opt.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>
                <View className="items-center py-3">
                  <Icon size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text className="text-[9px] font-bold text-white mt-1.5">{opt.label}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
