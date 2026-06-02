import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Share2, Star } from 'lucide-react-native';
import { Linking, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { useReferrals } from '@features/referrals/hooks/useReferrals';
import { referralService } from '@/services/premium/referral.service';
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

export function ShareAppSection() {
  const { code } = useReferrals();

  const shareMessage = code
    ? referralService.getShareMessage(code)
    : 'Never forget a birthday again 🎉\n\nDownload BirthdayBuddy:\nhttps://birthdaybuddy.app';

  const handleShare = async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch {
      /* dismissed */
    }
  };

  const handleRate = async () => {
    const url = getStoreUrl();
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[...Gradients.hero]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <View style={styles.iconBadge}>
          <Heart size={22} color="#FFF" fill="#FFF" />
        </View>
        <Text style={styles.title}>Love BirthdayBuddy?</Text>
        <Text style={styles.subtitle}>
          Share the app with friends and help us grow. Your support means everything to our small team.
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={() => void handleShare()}
            style={styles.primaryBtn}
            accessibilityRole="button"
            accessibilityLabel="Share app invite">
            <Share2 size={18} color="#7C3AED" />
            <Text style={styles.primaryBtnText}>Share invite</Text>
          </Pressable>
          <Pressable
            onPress={() => void handleRate()}
            style={styles.secondaryBtn}
            accessibilityRole="button"
            accessibilityLabel="Rate on Play Store">
            <Star size={16} color="#FFF" />
            <Text style={styles.secondaryBtnText}>Rate us</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: scale(24),
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    padding: scale(24),
    alignItems: 'center',
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
    marginBottom: scale(20),
    paddingHorizontal: scale(8),
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
