import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { VisualEffect } from '../../types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MAX_PARTICLES = 12;

interface VisualEffectsLayerProps {
  effects: VisualEffect[];
}

const EFFECT_EMOJIS: Partial<Record<VisualEffect, string[]>> = {
  confetti: ['🎊', '🎉', '✨', '🥳'],
  fireworks: ['🎆', '✨', '🌟', '💥'],
  hearts: ['❤️', '💕', '💖', '💗'],
  flowers: ['🌸', '🌺', '🌷', '🌻'],
  snow: ['❄️', '🌨️', '✨', '❅'],
  sparkles: ['✨', '⭐', '💫', '🌟'],
  balloons: ['🎈', '🎈', '🎈', '🎈'],
  particles: ['💫', '✨', '🌟', '⚡'],
  glow: ['🌟', '✨', '💛', '🔆'],
  floating_objects: ['🎀', '🦋', '💝', '🎵'],
};

function Particle({ emoji, index, total }: { emoji: string; index: number; total: number }) {
  const translateY = useSharedValue(SCREEN_H + 40);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const startX = useMemo(() => ((index * 17 + 7) % 90) * (SCREEN_W / 100), [index]);
  const duration = useMemo(() => 4000 + (index % 4) * 800, [index]);
  const delay = useMemo(() => index * 350, [index]);

  useEffect(() => {
    const drift = ((index % 3) - 1) * 30;

    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.85, { duration: duration * 0.15 }),
        withTiming(0.85, { duration: duration * 0.6 }),
        withTiming(0, { duration: duration * 0.25 }),
      ),
      -1,
    ));

    translateY.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(SCREEN_H + 40, { duration: 0 }),
        withTiming(-60, { duration, easing: Easing.out(Easing.quad) }),
      ),
      -1,
    ));

    translateX.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(drift, { duration: duration / 2 }),
        withTiming(-drift, { duration: duration / 2 }),
      ),
      -1,
    ));

    rotate.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(360 * (index % 2 === 0 ? 1 : -1), { duration }),
      ),
      -1,
    ));

    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.7 + (index % 3) * 0.2, { duration: duration * 0.2 }),
        withTiming(1 + (index % 3) * 0.15, { duration: duration * 0.5 }),
        withTiming(0.3, { duration: duration * 0.3 }),
      ),
      -1,
    ));
  }, [delay, duration, index, opacity, rotate, scale, translateX, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        { position: 'absolute', left: startX, fontSize: 18 + (index % 3) * 4 },
        animStyle,
      ]}>
      {emoji}
    </Animated.Text>
  );
}

export function VisualEffectsLayer({ effects }: VisualEffectsLayerProps) {
  const particles = useMemo(() => {
    if (effects.length === 0) return [];
    const allEmojis = effects.flatMap((e) => EFFECT_EMOJIS[e] ?? ['✨']);
    const items: { emoji: string; index: number }[] = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      items.push({ emoji: allEmojis[i % allEmojis.length], index: i });
    }
    return items;
  }, [effects]);

  if (particles.length === 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p) => (
        <Particle key={`fx-${p.index}`} emoji={p.emoji} index={p.index} total={particles.length} />
      ))}
    </View>
  );
}
