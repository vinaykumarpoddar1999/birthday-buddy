import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Cake,
  Calendar,
  Gift,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Sparkles,
  User,
} from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { EmptyState, PageSkeleton } from '@shared/ui';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { usePerson } from '@features/people/hooks/usePeople';
import { getPersonEventLabel } from '../utils/event-label';
import {
  formatBirthdayShort,
  formatRelationship,
  getAge,
  getAgeAtNextBirthday,
  getDaysUntilBirthday,
  safeFormatBirthdayLong,
} from '@features/people/utils/birthday-utils';
import {
  birthdayCardStyles,
  getBirthdayCardTheme,
  getThemeIndexForRelationship,
} from '@features/people/utils/birthday-card-theme';
import { Colors, scale } from '@features/home/constants/design-tokens';

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <View className="flex-row items-start py-2.5 border-b border-border/40">
      <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center mr-3">
        <Icon size={16} color="#7C3AED" />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-[11px] text-foreground-secondary font-semibold uppercase tracking-wide">
          {label}
        </Text>
        <Text className="text-[14px] text-foreground font-medium mt-0.5">{value}</Text>
      </View>
    </View>
  );
}

export function PersonDetailsScreen() {
  const { personId: personIdParam } = useLocalSearchParams<{ personId: string | string[] }>();
  const personId = Array.isArray(personIdParam) ? personIdParam[0] : personIdParam;
  const { data: person, isLoading, isError } = usePerson(personId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <PageSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !person) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <EmptyState
          icon={User}
          title="Person not found"
          subtitle="This contact may have been removed."
          primaryAction={{ label: 'Go Back', onPress: () => router.back() }}
        />
      </SafeAreaView>
    );
  }

  const themeIndex = getThemeIndexForRelationship(person.relationship);
  const theme = getBirthdayCardTheme(themeIndex);
  const daysLeft = getDaysUntilBirthday(person.birthDate);
  const age = getAge(person.birthDate);
  const nextAge = getAgeAtNextBirthday(person.birthDate);
  const dateLabel = formatBirthdayShort(person.birthDate);
  const eventLabel = getPersonEventLabel(person);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: '/add-person', params: { personId: person.id } })}
          className="h-10 px-4 rounded-full bg-primary/10 flex-row items-center gap-1.5"
          accessibilityRole="button"
          accessibilityLabel="Edit person">
          <Pencil size={16} color="#7C3AED" />
          <Text className="text-[13px] font-bold text-primary">Edit</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-32"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { shadowColor: theme.accent }]}>
          <LinearGradient
            colors={[theme.gradient[0], theme.gradient[1], '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={birthdayCardStyles.cardGradient}>
            <View style={birthdayCardStyles.cardRow}>
              <View style={styles.avatarSection}>
                <View style={[birthdayCardStyles.avatarGlow, { borderColor: theme.accent }]}>
                  <ProfileAvatar
                    dimension={scale(64)}
                    profileImage={person.avatarUri}
                    name={person.fullName}
                    gender={person.gender}
                    label={`${person.fullName} avatar`}
                  />
                </View>
                <View style={[styles.avatarDecor, { backgroundColor: theme.accent }]}>
                  <Sparkles size={scale(8)} color="#FFFFFF" />
                </View>
              </View>

              <View style={birthdayCardStyles.centerContent}>
                <View style={styles.nameRow}>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {person.fullName}
                  </Text>
                  <Sparkles size={scale(14)} color={theme.accent} style={{ marginLeft: 4 }} />
                </View>
                {person.nickname ? (
                  <Text style={styles.nickname} numberOfLines={1}>
                    "{person.nickname}"
                  </Text>
                ) : null}
                <Text style={styles.cardRelation}>
                  {formatRelationship(person.relationship)} · Turns {nextAge}
                </Text>
                <View style={styles.chipsRow}>
                  <View style={[styles.chip, { backgroundColor: `${theme.accent}15` }]}>
                    <Calendar size={scale(11)} color={theme.accent} />
                    <Text style={[styles.chipText, { color: theme.accent }]}>{dateLabel}</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: `${theme.accent}15` }]}>
                    <MapPin size={scale(11)} color={theme.accent} />
                    <Text style={[styles.chipText, { color: theme.accent }]}>{eventLabel}</Text>
                  </View>
                </View>

                <View style={styles.quickActions}>
                  <Pressable
                    style={birthdayCardStyles.quickBtn}
                    onPress={() => router.push({ pathname: '/ai-wish', params: { personId: person.id } })}
                    accessibilityRole="button"
                    accessibilityLabel="Send wish">
                    <MessageCircle size={scale(14)} color={theme.accent} />
                  </Pressable>
                  <Pressable
                    style={birthdayCardStyles.quickBtn}
                    onPress={() => router.push({ pathname: '/card-studio', params: { personId: person.id } })}
                    accessibilityRole="button"
                    accessibilityLabel="Create card">
                    <Gift size={scale(14)} color={theme.accent} />
                  </Pressable>
                </View>
              </View>

              <View style={[birthdayCardStyles.daysPanel, { backgroundColor: `${theme.accent}10` }]}>
                <Cake size={scale(20)} color={theme.accent} strokeWidth={2} />
                <Text style={[birthdayCardStyles.daysNumber, { color: theme.accent }]}>{daysLeft}</Text>
                <Text style={[birthdayCardStyles.daysLabel, { color: theme.accent }]}>Days Left</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="bg-surface rounded-2xl border border-border/60 p-4 mb-4">
          <Text className="text-[13px] font-bold text-foreground mb-2">Profile</Text>
          <DetailRow icon={Cake} label="Birthday" value={safeFormatBirthdayLong(person.birthDate)} />
          <DetailRow icon={User} label="Age" value={`${age} years old · Turns ${nextAge} next`} />
          <DetailRow icon={Bell} label="Event" value={eventLabel} />
          <DetailRow
            icon={Bell}
            label="Reminder"
            value={
              person.reminderDaysBefore === 0
                ? `On the day at ${person.reminderTime}`
                : `${person.reminderDaysBefore} day(s) before at ${person.reminderTime}`
            }
          />
        </View>

        {(person.phone || person.email) && (
          <View className="bg-surface rounded-2xl border border-border/60 p-4 mb-4">
            <Text className="text-[13px] font-bold text-foreground mb-2">Contact Information</Text>
            <DetailRow icon={Phone} label="Phone" value={person.phone ?? ''} />
            <DetailRow icon={Mail} label="Email" value={person.email ?? ''} />
          </View>
        )}

        {(person.favoriteColor || person.favoriteCake || (person.hobbies?.length ?? 0) > 0) && (
          <View className="bg-surface rounded-2xl border border-border/60 p-4 mb-4">
            <Text className="text-[13px] font-bold text-foreground mb-2">Preferences</Text>
            <DetailRow icon={MapPin} label="Favorite Color" value={person.favoriteColor ?? ''} />
            <DetailRow icon={Cake} label="Favorite Cake" value={person.favoriteCake ?? ''} />
            {person.hobbies && person.hobbies.length > 0 && (
              <View className="pt-2">
                <Text className="text-[11px] text-foreground-secondary font-semibold uppercase tracking-wide mb-2">
                  Hobbies
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {person.hobbies.map((hobby) => (
                    <View key={hobby} className="bg-primary/10 rounded-full px-3 py-1">
                      <Text className="text-[12px] font-semibold text-primary">{hobby}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {person.notes ? (
          <View className="bg-surface rounded-2xl border border-border/60 p-4">
            <Text className="text-[13px] font-bold text-foreground mb-2">Notes</Text>
            <Text className="text-[14px] text-foreground-secondary leading-6">{person.notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: scale(16),
    borderRadius: scale(22),
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  avatarSection: {
    position: 'relative',
    marginRight: scale(12),
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(2),
  },
  cardName: {
    fontSize: scale(16),
    fontWeight: '800',
    color: Colors.foreground,
    flexShrink: 1,
  },
  nickname: {
    fontSize: scale(11),
    fontWeight: '500',
    color: Colors.foregroundSecondary,
    marginBottom: scale(2),
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
    marginBottom: scale(8),
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
  quickActions: {
    flexDirection: 'row',
    gap: scale(8),
  },
});
