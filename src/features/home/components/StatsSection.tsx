import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Flame, PartyPopper, TrendingUp } from 'lucide-react-native';

import { Colors, Shadows, scale } from '../constants/design-tokens';

type StatsSectionProps = {
  remindersToday: number;
  streakDays: number;
  upcomingThisWeek: number;
};

export function StatsSection({ remindersToday, streakDays, upcomingThisWeek }: StatsSectionProps) {
  return (
    <View style={styles.container}>
      {/* Reminders Card */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={['#FFA64D', '#FF7A59']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBg}>
              <Bell size={scale(18)} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text style={styles.cardLabel}>Today&apos;s Reminders</Text>
          </View>
          <Text style={styles.cardValue}>{remindersToday}</Text>
          <Text style={styles.cardSubtext}>{upcomingThisWeek} upcoming birthdays in 7 days</Text>
          {/* Decoration */}
          <View style={styles.decoration}>
            <PartyPopper size={scale(36)} color="rgba(255,255,255,0.2)" />
          </View>
        </LinearGradient>
      </View>

      {/* Streak Card */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={['#4F46E5', '#9333EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBg}>
              <Flame size={scale(18)} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text style={styles.cardLabel}>Birthdays Wished</Text>
          </View>
          <View style={styles.streakRow}>
            <Text style={styles.cardValue}>{streakDays}</Text>
          </View>
          <Text style={styles.cardSubtext}>Total birthdays you have celebrated so far</Text>
          {/* Decoration */}
          <View style={styles.decorationRight}>
            <TrendingUp size={scale(40)} color="rgba(255,255,255,0.15)" />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: scale(24),
  },
  cardWrapper: {
    flex: 1,
    borderRadius: scale(22),
    overflow: 'hidden',
    ...Shadows.card,
  },
  card: {
    padding: scale(16),
    minHeight: scale(130),
    borderRadius: scale(22),
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: scale(10),
  },
  iconBg: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: scale(11),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  cardValue: {
    fontSize: scale(28),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardSubtext: {
    fontSize: scale(11),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: scale(4),
  },
  decoration: {
    position: 'absolute',
    bottom: scale(8),
    right: scale(8),
  },
  decorationRight: {
    position: 'absolute',
    bottom: scale(12),
    right: scale(12),
  },
});
