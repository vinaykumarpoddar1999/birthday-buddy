import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Settings, User, Users, Wand2 } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePeople } from '@features/people/hooks/usePeople';
import { useQuery } from '@tanstack/react-query';
import { wishService } from '@/services/wish/wish.service';

import { ProfileSummaryCard } from '../components/ProfileSummaryCard';

export function ProfileScreen() {
  const { data: people = [] } = usePeople();
  const { data: wishCount = 0 } = useQuery({
    queryKey: ['wish-history-count'],
    queryFn: async () => {
      const history = await wishService.listAllRecent(500);
      return history.length;
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Profile</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/settings')}
          className="h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Open settings">
          <Settings size={20} color="#7C3AED" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <ProfileSummaryCard editProfileLabel="Edit Profile →" />

        <View className="flex-row gap-3 mt-5">
          <View className="flex-1 bg-surface rounded-2xl p-4 border border-border/60 items-center">
            <Users size={22} color="#7C3AED" />
            <Text className="text-[22px] font-bold text-foreground mt-2">{people.length}</Text>
            <Text className="text-[12px] text-foreground-secondary">People</Text>
          </View>
          <View className="flex-1 bg-surface rounded-2xl p-4 border border-border/60 items-center">
            <Wand2 size={22} color="#EC4899" />
            <Text className="text-[22px] font-bold text-foreground mt-2">{wishCount}</Text>
            <Text className="text-[12px] text-foreground-secondary">Wishes</Text>
          </View>
        </View>

        <View className="bg-surface rounded-2xl border border-border/60 mt-5 overflow-hidden">
          <Pressable
            className="flex-row items-center py-4 px-4"
            onPress={() => router.push('/edit-profile')}
            accessibilityRole="button"
            accessibilityLabel="Edit profile">
            <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <User size={18} color="#7C3AED" />
            </View>
            <Text className="text-[15px] font-medium text-foreground flex-1">Edit Profile</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
          <View className="h-[0.5px] bg-border/60 mx-4" />
          <Pressable
            className="flex-row items-center py-4 px-4"
            onPress={() => router.push('/(tabs)/settings')}
            accessibilityRole="button"
            accessibilityLabel="Open settings">
            <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <Settings size={18} color="#7C3AED" />
            </View>
            <Text className="text-[15px] font-medium text-foreground flex-1">Settings</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
