import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Cake, Calendar, Gift, Heart, MapPin, Sparkles } from 'lucide-react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { Colors, Shadows, scale } from '../constants/design-tokens';
import { getAvatarSource } from '@/shared/utils/avatar';
import type { Person } from '@/types/entities';
import {
  getDaysUntilBirthday,
  getAgeAtNextBirthday,
  formatBirthdayShort,
} from '@features/people/utils/birthday-utils';

type HeroBirthdayCardProps = {
  person: Person;
};

function getCelebrationMessage(person: Person): string {
  const pronoun = person.gender === 'male' ? 'his' : person.gender === 'female' ? 'her' : 'their';
  return `Make ${pronoun} day extra special!`;
}

export function HeroBirthdayCard({ person }: HeroBirthdayCardProps) {
  const daysLeft = getDaysUntilBirthday(person.birthDate);
  const age = getAgeAtNextBirthday(person.birthDate);
  const dateLabel = formatBirthdayShort(person.birthDate);
  const dateShort = dateLabel.split(',')[0];

  const avatarSource = person.avatarUri
    ? { uri: person.avatarUri }
    : getAvatarSource(person.gender === 'female' ? 'female' : 'male');

  const handlePress = () => {
    router.push({ pathname: '/person-details', params: { personId: person.id } });
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`View ${person.fullName} birthday details`}>
      <View style={[styles.cardContainer, Shadows.hero]}>
        <LinearGradient
          colors={['#6A11FF', '#8B5CF6', '#C026D3', '#FF4D9D']}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
          style={styles.gradient}>
          <View style={styles.sparkle1}>
            <Sparkles size={scale(12)} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={styles.sparkle2}>
            <Sparkles size={scale(10)} color="rgba(255,255,255,0.2)" />
          </View>

          <View style={styles.topRow}>
            <View style={styles.upNextBadge}>
              <Text style={styles.upNextText}>UP NEXT</Text>
            </View>
            <View style={styles.daysRow}>
              <Cake size={scale(14)} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.daysText}>{daysLeft} Days Left</Text>
            </View>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.leftContent}>
              <View style={styles.nameRow}>
                <Text style={styles.personName} numberOfLines={1}>
                  {person.fullName}
                </Text>
                <Sparkles size={scale(14)} color="#FCD34D" style={{ marginLeft: 4 }} />
              </View>

              <Text style={styles.relationship} numberOfLines={1}>
                {person.relationship || 'Friend'} · Turns {age} on {dateShort}
              </Text>

              <View style={styles.tagsRow}>
                <View style={styles.tag}>
                  <Calendar size={scale(11)} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.tagText}>{dateLabel}</Text>
                </View>
              </View>

              <View style={styles.messageRow}>
                <Text style={styles.messageText} numberOfLines={1}>
                  {getCelebrationMessage(person)}
                </Text>
                <Heart size={scale(14)} color="#E879F9" fill="#E879F9" style={{ marginLeft: 4 }} />
              </View>
            </View>

            <View style={styles.rightProfile}>
              <View style={styles.profileImageWrapper}>
                <Image source={avatarSource} style={styles.profileImage} contentFit="cover" />
              </View>
              <Pressable
                style={styles.giftButton}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push({ pathname: '/coming-soon', params: { feature: 'gift-ideas' } });
                }}
                accessibilityRole="button"
                accessibilityLabel="Send gift">
                <Gift size={scale(18)} color="#F97316" strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(22),
  },
  gradient: {
    paddingHorizontal: scale(16),
    paddingTop: scale(14),
    paddingBottom: scale(36),
    minHeight: scale(210),
    position: 'relative',
    borderRadius: scale(22),
    overflow: 'hidden',
  },
  sparkle1: {
    position: 'absolute',
    top: scale(50),
    left: scale(10),
  },
  sparkle2: {
    position: 'absolute',
    top: scale(36),
    right: scale(90),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  upNextBadge: {
    backgroundColor: '#FFFFFF',
    height: scale(24),
    paddingHorizontal: scale(10),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  upNextText: {
    fontSize: scale(9),
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
  },
  daysText: {
    fontSize: scale(12),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    flex: 1,
    paddingRight: scale(8),
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  personName: {
    fontSize: scale(24),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  relationship: {
    fontSize: scale(11),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: scale(10),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(6),
    marginBottom: scale(10),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
    height: scale(28),
    paddingHorizontal: scale(10),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: scale(14),
  },
  tagText: {
    fontSize: scale(10),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: scale(12),
    fontWeight: '600',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  rightProfile: {
    alignItems: 'center',
    position: 'relative',
    width: scale(100),
  },
  profileImageWrapper: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: scale(3),
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    shadowColor: '#FF4D9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  giftButton: {
    position: 'absolute',
    bottom: scale(0),
    right: scale(-2),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
});
