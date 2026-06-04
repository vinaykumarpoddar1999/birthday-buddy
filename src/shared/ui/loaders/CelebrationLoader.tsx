import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import { APP_NAME } from '@/constants/app';

const APP_DISPLAY_NAME = 'Birthday Buddy';
import { DURATION } from '@/shared/motion/tokens';
import { ConfettiBurst } from '@/shared/ui/ConfettiBurst';
import {
  DEFAULT_STARTUP_MESSAGE,
  STARTUP_MESSAGE_CYCLE,
  STARTUP_TAGLINE,
} from '@/shared/ui/loaders/startup-messages';

const APP_ICON = require('../../../../assets/images/icon.png');

type CelebrationLoaderProps = {
  size?: 'small' | 'large';
  fullScreen?: boolean;
  progress?: number;
  message?: string;
  /** Full-screen startup uses the premium splash; inline keeps a compact spinner. */
  variant?: 'default' | 'startup';
};

function GlowOrb({ size, delay }: { size: number; delay: number }) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.9, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.55, { duration: 2200 }),
          withTiming(0.25, { duration: 2200 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glowOrb,
        style,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

function CyclingMessage({ messages, fallback }: { messages: readonly string[]; fallback: string }) {
  const [index, setIndex] = useState(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      opacity.value = withTiming(0, { duration: DURATION.fast / 2 });
      translateY.value = 6;
      setTimeout(() => {
        setIndex((current) => (current + 1) % messages.length);
        opacity.value = withTiming(1, { duration: DURATION.fast });
        translateY.value = withTiming(0, { duration: DURATION.normal, easing: Easing.out(Easing.cubic) });
      }, DURATION.fast / 2);
    }, 2600);

    return () => clearInterval(interval);
  }, [messages.length, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const text = messages[index] ?? fallback;

  return (
    <Animated.Text style={[styles.cycleMessage, animatedStyle]} accessibilityLiveRegion="polite">
      {text}
    </Animated.Text>
  );
}

function ProgressBar({ progress }: { progress?: number }) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (progress !== undefined) return;
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress, shimmer]);

  const fillStyle = useAnimatedStyle(() => {
    if (progress !== undefined) {
      return { width: `${Math.min(Math.max(progress, 0), 1) * 100}%` };
    }
    const width = interpolate(shimmer.value, [0, 1], [0.28, 0.88]);
    return { width: `${width * 100}%` };
  });

  return (
    <View style={styles.progressTrack} accessibilityRole="progressbar">
      <Animated.View style={[styles.progressFill, fillStyle]} />
    </View>
  );
}

function PremiumStartupLoader({ message, progress }: { message?: string; progress?: number }) {
  const iconScale = useSharedValue(0.92);
  const ringRotation = useSharedValue(0);

  useEffect(() => {
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }),
        withTiming(0.96, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 9000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [iconScale, ringRotation]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const displayMessage = message ?? DEFAULT_STARTUP_MESSAGE;
  const cycleMessages = message
    ? ([message] as const)
    : STARTUP_MESSAGE_CYCLE;

  return (
    <LinearGradient
      colors={['#4C1D95', '#6D28D9', '#A855F7', '#FDF4FF']}
      locations={[0, 0.35, 0.72, 1]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.fullScreen}>
      <ConfettiBurst active durationMs={4200} count={72} />
      <GlowOrb size={280} delay={0} />
      <GlowOrb size={200} delay={400} />

      <View style={styles.startupContent}>
        <View style={styles.iconStage}>
          <Animated.View style={[styles.iconRing, ringStyle]} pointerEvents="none" />
          <Animated.View style={iconStyle}>
            <View style={styles.iconFrame}>
              <Image
                source={APP_ICON}
                style={styles.appIcon}
                contentFit="cover"
                accessibilityLabel={`${APP_NAME} app icon`}
              />
            </View>
          </Animated.View>
        </View>

        <Text style={styles.appName}>{APP_DISPLAY_NAME}</Text>
        <Text style={styles.tagline}>{STARTUP_TAGLINE}</Text>

        <View style={styles.messageBlock}>
          {cycleMessages.length > 1 && !message ? (
            <CyclingMessage messages={cycleMessages} fallback={displayMessage} />
          ) : (
            <Text style={styles.cycleMessage}>{displayMessage}</Text>
          )}
        </View>

        <ProgressBar progress={progress} />
      </View>
    </LinearGradient>
  );
}

function CompactLoader({ message, size }: { message?: string; size: 'small' | 'large' }) {
  const spin = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(360, { duration: 1100, easing: Easing.linear }),
      -1,
      false,
    );
  }, [spin]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const isLarge = size === 'large';

  return (
    <View style={styles.inline}>
      <View style={[styles.compactWrap, !isLarge && styles.compactWrapSmall]}>
        <Animated.View
          style={[
            styles.compactRing,
            ringStyle,
            !isLarge && styles.compactRingSmall,
          ]}
        />
        <Image
          source={APP_ICON}
          style={[styles.compactIcon, !isLarge && styles.compactIconSmall]}
          contentFit="cover"
        />
      </View>
      {message ? (
        <Text style={[styles.compactMessage, !isLarge && styles.compactMessageSmall]}>{message}</Text>
      ) : null}
    </View>
  );
}

export function CelebrationLoader({
  size = 'large',
  fullScreen = false,
  progress,
  message,
  variant = 'default',
}: CelebrationLoaderProps) {
  if (fullScreen || variant === 'startup') {
    return <PremiumStartupLoader message={message} progress={progress} />;
  }

  return <CompactLoader message={message} size={size} />;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowOrb: {
    position: 'absolute',
    backgroundColor: 'rgba(251, 191, 36, 0.22)',
  },
  startupContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 360,
    zIndex: 2,
  },
  iconStage: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    borderTopColor: 'rgba(253, 224, 71, 0.95)',
    borderRightColor: 'rgba(236, 72, 153, 0.75)',
  },
  iconFrame: {
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 14,
  },
  appIcon: {
    width: 96,
    height: 96,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
  },
  messageBlock: {
    marginTop: 28,
    minHeight: 24,
    width: '100%',
  },
  cycleMessage: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
  },
  progressTrack: {
    marginTop: 24,
    width: '100%',
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FDE68A',
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  compactWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactWrapSmall: {
    width: 52,
    height: 52,
  },
  compactRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(124,58,237,0.15)',
    borderTopColor: '#7C3AED',
  },
  compactRingSmall: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  compactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  compactIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 9,
  },
  compactMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B21B6',
    textAlign: 'center',
  },
  compactMessageSmall: {
    fontSize: 13,
  },
});
