import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Cake,
  Calendar,
  ChevronRight,
  Gift,
  Heart,
  MapPin,
  Sparkles,
  Users,
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
} from '@features/people/utils/birthday-utils';

type HeroBirthdayCardProps = {
  person: Person;
};

export function HeroBirthdayCard({ person }: HeroBirthdayCardProps) {
  const daysLeft = getDaysUntilBirthday(person.birthDate);
  const age = getAgeAtNextBirthday(person.birthDate);
  const dateLabel = formatBirthdayShort(person.birthDate);

  const avatarSource = person.avatarUri
    ? { uri: person.avatarUri }
    : getAvatarSource(person.gender === 'female' ? 'female' : 'male');

  const handlePress = () => {
    router.push({ pathname: '/person-details', params: { personId: person.id } });
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={`View ${person.fullName} birthday details`}>
      <View style={[styles.cardContainer, Shadows.hero]}>
        <LinearGradient
          colors={['#6A11FF', '#8B5CF6', '#C026D3', '#FF4D9D']}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
          style={styles.gradient}>
          {/* Decorative sparkles */}
          <View style={styles.sparkle1}>
            <Sparkles size={scale(16)} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={styles.sparkle2}>
            <Sparkles size={scale(12)} color="rgba(255,255,255,0.2)" />
          </View>
          <View style={styles.sparkle3}>
            <Sparkles size={scale(10)} color="rgba(255,255,255,0.25)" />
          </View>

          {/* Top Status Row */}
          <View style={styles.topRow}>
            <View style={styles.upNextBadge}>
              <Text style={styles.upNextText}>UP NEXT</Text>
            </View>
            <View style={styles.daysRow}>
              <Cake size={scale(16)} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.daysText}>{daysLeft} Days Left</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.leftContent}>
              {/* Person Name */}
              <View style={styles.nameRow}>
                <Text style={styles.personName} numberOfLines={1}>
                  {person.fullName}
                </Text>
                <Sparkles size={scale(18)} color="#FCD34D" style={{ marginLeft: 6 }} />
              </View>

              {/* Relationship */}
              <Text style={styles.relationship}>
                {person.relationship || 'Friend'} · Turns {age} on {dateLabel.split(',')[0]}
              </Text>

              {/* Tags */}
              <View style={styles.tagsRow}>
                <View style={styles.tag}>
                  <Calendar size={scale(13)} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.tagText}>{dateLabel}</Text>
                </View>
                <View style={styles.tag}>
                  <Users size={scale(13)} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.tagText}>Just You</Text>
                </View>
              </View>

              {/* Message */}
              <View style={styles.messageRow}>
                <Text style={styles.messageText}>Make her day extra special!</Text>
                <Heart size={scale(16)} color="#E879F9" fill="#E879F9" style={{ marginLeft: 6 }} />
              </View>
            </View>

            {/* Right Profile Photo */}
            <View style={styles.rightProfile}>
              <View style={styles.profileImageWrapper}>
                <Image
                  source={avatarSource}
                  style={styles.profileImage}
                  contentFit="cover"
                />
              </View>
              {/* Gift Button */}
              <Pressable
                style={styles.giftButton}
                onPress={() => router.push({ pathname: '/coming-soon', params: { feature: 'gift-ideas' } })}
                accessibilityRole="button"
                accessibilityLabel="Send gift">
                <Gift size={scale(22)} color="#F97316" strokeWidth={2.2} />
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
    borderRadius: scale(28),
    overflow: 'hidden',
  },
  gradient: {
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    paddingBottom: scale(24),
    minHeight: scale(280),
    position: 'relative',
  },
  sparkle1: {
    position: 'absolute',
    top: scale(60),
    left: scale(14),
  },
  sparkle2: {
    position: 'absolute',
    top: scale(40),
    right: scale(100),
  },
  sparkle3: {
    position: 'absolute',
    bottom: scale(60),
    left: scale(60),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  upNextBadge: {
    backgroundColor: '#FFFFFF',
    height: scale(30),
    paddingHorizontal: scale(12),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  upNextText: {
    fontSize: scale(11),
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  daysText: {
    fontSize: scale(14),
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
    paddingRight: scale(12),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(6),
  },
  personName: {
    fontSize: scale(34),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  relationship: {
    fontSize: scale(14),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: scale(14),
  },
  tagsRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: scale(16),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    height: scale(34),
    paddingHorizontal: scale(12),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: scale(17),
  },
  tagText: {
    fontSize: scale(12),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rightProfile: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImageWrapper: {
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
    borderWidth: scale(5),
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    shadowColor: '#FF4D9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(70),
  },
  giftButton: {
    position: 'absolute',
    bottom: -scale(6),
    right: -scale(4),
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
  },
});
