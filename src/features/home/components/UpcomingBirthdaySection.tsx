import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Cake,
  ChevronRight,
  Calendar,
  Gift,
  MessageCircle,
  MapPin,
  Sparkles,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Colors, Shadows, scale } from '../constants/design-tokens';
import { getAvatarSource } from '@/shared/utils/avatar';
import type { Person } from '@/types/entities';
import {
  getDaysUntilBirthday,
  getAgeAtNextBirthday,
  formatBirthdayShort,
  formatRelationship,
} from '@features/people/utils/birthday-utils';
import { getBirthdayCardTheme } from '@features/people/utils/birthday-card-theme';

const MESSAGES = [
  'Make her day extra special! 💜',
  'Celebrate the moments! 🎉',
  'A special day for a special person 💜',
  'Wishing joy and happiness! ✨',
  'Time to celebrate! 🎂',
];

type UpcomingBirthdaySectionProps = {
  people: Person[];
};

function BirthdayCard({ person, index }: { person: Person; index: number }) {
  const theme = getBirthdayCardTheme(index);
  const daysLeft = getDaysUntilBirthday(person.birthDate);
  const age = getAgeAtNextBirthday(person.birthDate);
  const dateLabel = formatBirthdayShort(person.birthDate);
  const message = MESSAGES[index % MESSAGES.length];

  const avatarSource = person.avatarUri
    ? { uri: person.avatarUri }
    : getAvatarSource(person.gender === 'female' ? 'female' : 'male');

  const handlePress = () => {
    router.push({ pathname: '/person-details', params: { personId: person.id } });
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={`View ${person.fullName} details`}>
      <View style={[styles.card, { shadowColor: theme.accent }]}>
        <LinearGradient
          colors={[theme.gradient[0], theme.gradient[1], '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}>
          <View style={styles.cardRow}>
            {/* Left Avatar */}
            <View style={styles.avatarSection}>
              <View style={[styles.avatarGlow, { borderColor: theme.accent }]}>
                <Image
                  source={avatarSource}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              </View>
              <View style={[styles.avatarDecor, { backgroundColor: theme.accent }]}>
                <Sparkles size={scale(8)} color="#FFFFFF" />
              </View>
            </View>

            {/* Center Content */}
            <View style={styles.centerContent}>
              <View style={styles.nameRow}>
                <Text style={styles.cardName} numberOfLines={1}>{person.fullName}</Text>
                <Sparkles size={scale(14)} color={theme.accent} style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.cardRelation}>
                {formatRelationship(person.relationship)} · Turns {age}
              </Text>
              <View style={styles.chipsRow}>
                <View style={[styles.chip, { backgroundColor: `${theme.accent}15` }]}>
                  <Calendar size={scale(11)} color={theme.accent} />
                  <Text style={[styles.chipText, { color: theme.accent }]}>{dateLabel}</Text>
                </View>
                <View style={[styles.chip, { backgroundColor: `${theme.accent}15` }]}>
                  <MapPin size={scale(11)} color={theme.accent} />
                  <Text style={[styles.chipText, { color: theme.accent }]}>Just You</Text>
                </View>
              </View>
              <Text style={styles.cardMessage} numberOfLines={1}>{message}</Text>

              {/* Quick Action Buttons */}
              <View style={styles.quickActions}>
                <Pressable
                  style={styles.quickBtn}
                  onPress={() => router.push({ pathname: '/ai-wish', params: { personId: person.id } })}
                  accessibilityRole="button">
                  <MessageCircle size={scale(14)} color={theme.accent} />
                </Pressable>
                <Pressable
                  style={styles.quickBtn}
                  onPress={() => router.push({ pathname: '/card-studio', params: { personId: person.id } })}
                  accessibilityRole="button">
                  <Gift size={scale(14)} color={theme.accent} />
                </Pressable>
                <Pressable
                  style={styles.quickBtn}
                  onPress={() => router.push({ pathname: '/surprise-link-studio', params: { personId: person.id } })}
                  accessibilityRole="button">
                  <Sparkles size={scale(14)} color={theme.accent} />
                </Pressable>
              </View>
            </View>

            {/* Right Days Panel */}
            <View style={[styles.daysPanel, { backgroundColor: `${theme.accent}10` }]}>
              <Cake size={scale(20)} color={theme.accent} strokeWidth={2} />
              <Text style={[styles.daysNumber, { color: theme.accent }]}>{daysLeft}</Text>
              <Text style={[styles.daysLabel, { color: theme.accent }]}>Days Left</Text>
              <ChevronRight size={scale(16)} color={theme.accent} style={{ marginTop: scale(4) }} />
            </View>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

export function UpcomingBirthdaySection({ people }: UpcomingBirthdaySectionProps) {
  if (people.length === 0) return null;

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Upcoming Birthdays</Text>
          <Text style={styles.partyEmoji}> </Text>
          <Cake size={scale(20)} color="#8B5CF6" />
        </View>
        <Pressable
          style={styles.viewCalendar}
          onPress={() => router.push('/(tabs)/calendar')}
          accessibilityRole="button">
          <Text style={styles.viewCalendarText}>View Calendar</Text>
          <ChevronRight size={scale(16)} color="#7C3AED" />
        </Pressable>
      </View>

      {/* Birthday Cards */}
      {people.slice(0, 4).map((person, index) => (
        <BirthdayCard key={person.id} person={person} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: scale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: '800',
    color: Colors.foreground,
    letterSpacing: -0.3,
  },
  partyEmoji: {
    fontSize: scale(20),
  },
  viewCalendar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCalendarText: {
    fontSize: scale(13),
    fontWeight: '600',
    color: '#7C3AED',
  },
  card: {
    marginBottom: scale(14),
    borderRadius: scale(22),
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cardGradient: {
    padding: scale(14),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginRight: scale(12),
  },
  avatarGlow: {
    width: scale(68),
    height: scale(68),
    borderRadius: scale(34),
    borderWidth: 2.5,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(34),
  },
  avatarDecor: {
    position: 'absolute',
    bottom: -scale(2),
    right: -scale(2),
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    paddingRight: scale(8),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(2),
  },
  cardName: {
    fontSize: scale(16),
    fontWeight: '800',
    color: Colors.foreground,
  },
  cardRelation: {
    fontSize: scale(11),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    marginBottom: scale(6),
  },
  chipsRow: {
    flexDirection: 'row',
    gap: scale(6),
    marginBottom: scale(6),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(10),
  },
  chipText: {
    fontSize: scale(10),
    fontWeight: '600',
  },
  cardMessage: {
    fontSize: scale(11),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    marginBottom: scale(8),
  },
  quickActions: {
    flexDirection: 'row',
    gap: scale(8),
  },
  quickBtn: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  daysPanel: {
    width: scale(72),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(16),
  },
  daysNumber: {
    fontSize: scale(24),
    fontWeight: '800',
    marginTop: scale(4),
  },
  daysLabel: {
    fontSize: scale(9),
    fontWeight: '600',
    marginTop: scale(2),
  },
});
