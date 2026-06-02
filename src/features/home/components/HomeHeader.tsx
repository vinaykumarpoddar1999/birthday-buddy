import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, Hand, Search, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { Colors, Shadows, scale } from '../constants/design-tokens';
import { useNotificationStore } from '@/stores/notification.store';
import { useProfileStore } from '@features/profile/store/profile.store';
import { getAvatarSource } from '@/shared/utils/avatar';

export function HomeHeader() {
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.isRead).length);
  const profile = useProfileStore((s) => s.profile);
  const displayName = profile.fullName || 'Rahul';
  const firstName = displayName.split(' ')[0];

  const avatarSource = profile.profileImage
    ? { uri: profile.profileImage }
    : getAvatarSource(profile.gender === 'female' ? 'female' : 'male');

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          style={styles.avatarWrapper}
          onPress={() => router.push('/(tabs)/profile')}
          accessibilityRole="button"
          accessibilityLabel="Open profile">
          <View style={styles.avatarRing}>
            <Image
              source={avatarSource}
              style={styles.avatar}
              contentFit="cover"
              accessibilityLabel={`${displayName} avatar`}
            />
          </View>
        </Pressable>

        <View style={styles.greetingContainer}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Hey, {firstName} </Text>
            <Hand size={scale(28)} color="#F59E0B" fill="#FBBF24" />
          </View>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitleText}>Let&apos;s make every birthday magical</Text>
            <Sparkles size={scale(14)} color="#A855F7" style={{ marginLeft: 4 }} />
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/search')}
            accessibilityRole="button"
            accessibilityLabel="Search">
            <Search size={scale(22)} color="#374151" strokeWidth={2} />
          </Pressable>
          <View>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push('/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications">
              <Bell size={scale(22)} color="#374151" strokeWidth={2} />
            </Pressable>
            {unreadCount > 0 && <View style={styles.badge} />}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: scale(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    marginRight: scale(12),
  },
  avatarRing: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    borderWidth: 3,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 8,
  },
  avatar: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
  },
  greetingContainer: {
    flex: 1,
    marginRight: scale(8),
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: scale(26),
    fontWeight: '800',
    color: Colors.foreground,
    letterSpacing: -0.5,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(2),
  },
  subtitleText: {
    fontSize: scale(13),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  actionButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  badge: {
    position: 'absolute',
    top: scale(2),
    right: scale(2),
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: Colors.pinkBadge,
    borderWidth: 2,
    borderColor: Colors.background,
  },
});
