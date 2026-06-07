import { router } from 'expo-router';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Cake,
  ChevronRight,
  Settings,
  User,
  Users,
  Wand2,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePeople } from '@features/people/hooks/usePeople';
import { useQuery } from '@tanstack/react-query';
import { wishService } from '@/services/wish/wish.service';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { usePrivacyDisplay } from '@/shared/hooks/usePrivacyDisplay';

import { useProfileStore } from '../store/profile.store';

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  value,
  label,
}: {
  icon: typeof Users;
  iconColor: string;
  iconBg: string;
  value: number;
  label: string;
}) {
  return (
    <View className="flex-1 bg-surface rounded-2xl p-4 border border-border/60">
      <View className="h-10 w-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: iconBg }}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text className="text-[26px] font-bold text-foreground">{value}</Text>
      <Text className="text-[12px] text-foreground-secondary mt-0.5">{label}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const profile = useProfileStore((s) => s.profile);
  const { maskName } = usePrivacyDisplay();
  const { data: people = [] } = usePeople();
  const { data: wishCount = 0 } = useQuery({
    queryKey: ['wish-history-count'],
    queryFn: async () => {
      const history = await wishService.listAllRecent(500);
      return history.length;
    },
  });

  const joinedLabel = profile.joinedAt
    ? `Member since ${format(new Date(profile.joinedAt), 'MMM yyyy')}`
    : 'Welcome aboard';

  const birthdayLabel = profile.birthday
    ? format(new Date(profile.birthday), 'MMMM d')
    : 'Birthday not set';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pt-3 pb-4 border-b border-border/50 bg-surface">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="mr-3 h-10 w-10 rounded-full bg-background border border-border items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <ArrowLeft size={20} color="#111827" />
          </Pressable>
          <Text className="text-title text-foreground font-bold flex-1">Profile</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/settings')}
            className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Open settings">
            <Settings size={20} color="#7C3AED" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32 pt-6" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} className="items-center">
          <View className="rounded-full p-1 bg-surface border-2 border-primary/20 shadow-sm">
            <ProfileAvatar
              size="xl"
              profileImage={profile.profileImage}
              name={profile.fullName}
              gender={profile.gender}
            />
          </View>
          <Text className="text-[24px] font-bold text-foreground mt-5 text-center">
            {maskName(profile.fullName || 'Your Profile')}
          </Text>
          <Text className="text-[13px] text-foreground-secondary mt-1">{joinedLabel}</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(500)}
          className="bg-surface rounded-2xl border border-border/60 p-4 mt-6">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
              <Cake size={18} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[12px] text-foreground-secondary font-medium">Birthday</Text>
              <Text className="text-[15px] font-semibold text-foreground mt-0.5">{birthdayLabel}</Text>
            </View>
            {profile.gender ? (
              <View className="rounded-full bg-background px-3 py-1.5 border border-border/60">
                <Text className="text-[12px] font-semibold text-foreground-secondary capitalize">
                  {profile.gender}
                </Text>
              </View>
            ) : null}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(500)} className="flex-row gap-3 mt-4">
          <StatCard icon={Users} iconColor="#7C3AED" iconBg="#EDE9FE" value={people.length} label="People" />
          <StatCard icon={Wand2} iconColor="#EC4899" iconBg="#FCE7F3" value={wishCount} label="Wishes" />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(180).duration(500)}
          className="bg-surface rounded-2xl border border-border/60 mt-5 overflow-hidden">
          <Pressable
            className="flex-row items-center py-4 px-4"
            onPress={() => router.push('/edit-profile')}
            accessibilityRole="button"
            accessibilityLabel="Edit profile">
            <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <User size={18} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Edit Profile</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Update photo and details</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
          <View className="h-[0.5px] bg-border/60 mx-4" />
          <Pressable
            className="flex-row items-center py-4 px-4"
            onPress={() => router.push('/personal-info')}
            accessibilityRole="button"
            accessibilityLabel="Personal information">
            <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <Cake size={18} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Personal Information</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Name, birthday, and gender</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
          <View className="h-[0.5px] bg-border/60 mx-4" />
          <Pressable
            className="flex-row items-center py-4 px-4"
            onPress={() => router.push('/(tabs)/settings')}
            accessibilityRole="button"
            accessibilityLabel="Open settings">
            <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <Settings size={18} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Settings</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Reminders, backup, and more</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
