import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, Hand, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

import { Colors, Shadows, scale } from '../constants/design-tokens';
import { useNotificationStore } from '@/stores/notification.store';
import { useProfileStore } from '@features/profile/store/profile.store';
import { usePrivacyDisplay } from '@/shared/hooks/usePrivacyDisplay';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';

export function HomeHeader() {
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.isRead).length);
  const profile = useProfileStore((s) => s.profile);
  const { maskName } = usePrivacyDisplay();
  const displayName = maskName(profile.fullName || 'there');
  const firstName = displayName.split(' ')[0] || 'there';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          style={styles.avatarWrapper}
          onPress={() => router.push('/(tabs)/profile')}
          accessibilityRole="button"
          accessibilityLabel="Open profile">
          <View style={styles.avatarRing}>
            <ProfileAvatar
              size="sm"
              profileImage={profile.profileImage}
              name={profile.fullName}
              gender={profile.gender}
              label={`${displayName} avatar`}
            />
          </View>
        </Pressable>

        <View style={styles.greetingContainer}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText} numberOfLines={1}>
              Hey, {firstName}{' '}
            </Text>
            <Hand size={scale(20)} color="#F59E0B" fill="#FBBF24" />
          </View>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitleText} numberOfLines={1}>
              Let&apos;s make every birthday magical
            </Text>
            <Sparkles size={scale(12)} color="#A855F7" style={{ marginLeft: 4 }} />
          </View>
        </View>

        <View style={styles.actionsRow}>
          <View>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push('/notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifications">
              <Bell size={scale(18)} color="#374151" strokeWidth={2} />
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
    paddingVertical: scale(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    marginRight: scale(10),
  },
  avatarRing: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    borderWidth: 2.5,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  greetingContainer: {
    flex: 1,
    marginRight: scale(6),
    minWidth: 0,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  greetingText: {
    fontSize: scale(20),
    fontWeight: '800',
    color: Colors.foreground,
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(1),
    flexShrink: 1,
  },
  subtitleText: {
    fontSize: scale(11),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flexShrink: 0,
  },
  actionButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  badge: {
    position: 'absolute',
    top: scale(2),
    right: scale(2),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: Colors.pinkBadge,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
});
