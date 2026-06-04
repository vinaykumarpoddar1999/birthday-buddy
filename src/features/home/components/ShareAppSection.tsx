import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Share2, Users } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform, Share, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

import { useReferrals } from '@features/referrals/hooks/useReferrals';
import { referralService } from '@/services/premium/referral.service';
import { AnimatedPressable } from '@/shared/motion/AnimatedPressable';
import { SPRING } from '@/shared/motion/tokens';
import { Colors, Gradients, scale, Spacing } from '../constants/design-tokens';

function getStoreUrl(): string {
  const config = Constants.expoConfig;
  const iosBundleId = config?.ios?.bundleIdentifier ?? 'com.birthdaybuddy.app';
  const androidPackage = config?.android?.package ?? iosBundleId;
  const iosAppId = (config?.extra as { iosAppId?: string } | undefined)?.iosAppId;

  if (Platform.OS === 'ios' && iosAppId) {
    return `https://apps.apple.com/app/id${iosAppId}`;
  }
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${androidPackage}`;
  }
  return 'https://birthdaybuddy.app';
}

function DecoBalloon({ style }: { style: object }) {
  return (
    <Animated.View style={style} pointerEvents="none">
      <Svg width={28} height={36} viewBox="0 0 28 36">
        <Ellipse cx="14" cy="14" rx="10" ry="12" fill="rgba(255,255,255,0.35)" />
        <Path d="M14 26 L14 34" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      </Svg>
    </Animated.View>
  );
}

function DecoGift({ style }: { style: object }) {
  return (
    <Animated.View style={style} pointerEvents="none">
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Rect x="3" y="10" width="18" height="12" rx="2" fill="rgba(255,255,255,0.3)" />
        <Rect x="10" y="10" width="4" height="12" fill="rgba(255,255,255,0.45)" />
        <Rect x="3" y="7" width="18" height="5" rx="1" fill="rgba(255,255,255,0.35)" />
      </Svg>
    </Animated.View>
  );
}

export function ShareAppSection() {
  const { code } = useReferrals();
  const entranceY = useSharedValue(24);
  const entranceOpacity = useSharedValue(0);
  const floatY = useSharedValue(0);

  useEffect(() => {
    entranceOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    entranceY.value = withDelay(200, withSpring(0, SPRING.gentle));
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [entranceOpacity, entranceY, floatY]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceY.value }],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const inviteMessage = code
    ? referralService.getShareMessage(code)
    : 'Never forget a birthday again 🎉\n\nDownload BirthdayBuddy:\nhttps://birthdaybuddy.app';

  const shareAppMessage =
    'Celebrate every special moment with Birthday Buddy 🎂\n\nDownload the app:\nhttps://birthdaybuddy.app';

  const handleInvite = async () => {
    try {
      await Share.share({ message: inviteMessage });
    } catch {
      /* dismissed */
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({ message: shareAppMessage });
    } catch {
      /* dismissed */
    }
  };

  return (
    <Animated.View style={[styles.wrapper, cardStyle]}>
      <Animated.View style={floatStyle}>
        <LinearGradient
          colors={[...Gradients.hero]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}>
          <DecoBalloon style={styles.balloonLeft} />
          <DecoBalloon style={styles.balloonRight} />
          <DecoGift style={styles.giftLeft} />

          <View style={styles.iconBadge}>
            <Heart size={22} color="#FFF" fill="#FFF" />
          </View>
          <Text style={styles.title}>Love Birthday Buddy?</Text>
          <Text style={styles.subtitle}>
            If this app helps you remember special moments, share it with friends and help us grow.
          </Text>

          <View style={styles.socialProof}>
            <Text style={styles.socialProofText}>🎉 Helping people celebrate every day</Text>
          </View>

          <View style={styles.actions}>
            <AnimatedPressable
              onPress={() => void handleInvite()}
              style={styles.primaryBtn}
              accessibilityRole="button"
              accessibilityLabel="Invite friends">
              <Users size={18} color={Colors.primary} />
              <Text style={styles.primaryBtnText}>Invite Friends</Text>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => void handleShareApp()}
              style={styles.secondaryBtn}
              accessibilityRole="button"
              accessibilityLabel="Share app">
              <Share2 size={16} color="#FFF" />
              <Text style={styles.secondaryBtnText}>Share App</Text>
            </AnimatedPressable>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: scale(24),
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    padding: scale(24),
    alignItems: 'center',
    position: 'relative',
  },
  balloonLeft: {
    position: 'absolute',
    top: scale(12),
    left: scale(12),
  },
  balloonRight: {
    position: 'absolute',
    top: scale(8),
    right: scale(16),
  },
  giftLeft: {
    position: 'absolute',
    bottom: scale(16),
    right: scale(20),
  },
  iconBadge: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  title: {
    fontSize: scale(20),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: scale(14),
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    lineHeight: scale(20),
    marginBottom: scale(14),
    paddingHorizontal: scale(8),
  },
  socialProof: {
    marginBottom: scale(18),
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  socialProofText: {
    fontSize: scale(12),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: scale(10),
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: '#FFFFFF',
    paddingVertical: scale(14),
    borderRadius: scale(16),
  },
  primaryBtnText: {
    fontSize: scale(15),
    fontWeight: '700',
    color: Colors.primary,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: scale(12),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  secondaryBtnText: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
