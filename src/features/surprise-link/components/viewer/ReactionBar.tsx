import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle } from 'lucide-react-native';

import type { ReactionType } from '../../types';

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'loved_it', emoji: '❤️', label: 'Loved It' },
  { type: 'emotional', emoji: '🥹', label: 'Emotional' },
  { type: 'smile', emoji: '😊', label: 'Smile' },
  { type: 'applause', emoji: '👏', label: 'Applause' },
  { type: 'favorite', emoji: '⭐', label: 'Favorite' },
];

interface ReactionBarProps {
  onReact: (type: ReactionType) => void;
  onReply: () => void;
}

function ReactionButton({ reaction, onPress }: { reaction: typeof REACTIONS[number]; onPress: () => void }) {
  const scale = useSharedValue(1);
  const [reacted, setReacted] = useState(false);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.4, { damping: 4 }),
      withSpring(1, { damping: 6 }),
    );
    setReacted(true);
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={reaction.label}
        className={`items-center px-3.5 py-3 rounded-2xl mx-0.5 min-h-[52px] min-w-[52px] justify-center ${reacted ? 'bg-primary/15' : 'bg-gray-50'}`}
        style={reacted ? { borderWidth: 1.5, borderColor: '#7C3AED40' } : undefined}>
        <Text className="text-[26px] leading-[32px]">{reaction.emoji}</Text>
        <Text className={`text-[9px] font-bold mt-1 ${reacted ? 'text-primary' : 'text-foreground-secondary'}`}>
          {reaction.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ReactionBar({ onReact, onReply }: ReactionBarProps) {
  return (
    <View className="border-t border-gray-100 bg-white">
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFF', '#F5F3FF']}
        className="px-4 pt-4 pb-5">
        <Text className="text-[13px] font-bold text-foreground mb-3 text-center">
          How did this make you feel?
        </Text>
        <View className="flex-row justify-center flex-wrap gap-1.5 mb-4">
          {REACTIONS.map((r) => (
            <ReactionButton key={r.type} reaction={r} onPress={() => onReact(r.type)} />
          ))}
        </View>
        <Pressable
          onPress={onReply}
          accessibilityRole="button"
          className="rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 4,
          }}>
          <LinearGradient
            colors={['#7C3AED', '#9333EA', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 flex-row items-center justify-center">
            <MessageCircle size={18} color="#FFF" />
            <Text className="text-[15px] font-bold text-white ml-2">Send a Reply</Text>
          </LinearGradient>
        </Pressable>
      </LinearGradient>
    </View>
  );
}
