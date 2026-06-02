import { router } from 'expo-router';
import { Camera, Crown, Flame } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { useProfileImagePicker } from '@/shared/hooks/useProfileImagePicker';
import { useAuth } from '@features/auth';

import { useProfileStore } from '../store/profile.store';

type ProfileSummaryCardProps = {
  editProfileLabel?: string;
  onEditProfilePress?: () => void;
};

export function ProfileSummaryCard({
  editProfileLabel = 'View Profile →',
  onEditProfilePress,
}: ProfileSummaryCardProps) {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const profileCompletion = useProfileStore((s) => s.profileCompletion);
  const { isAuthenticated, isGuest } = useAuth();
  const { showImagePicker } = useProfileImagePicker((uri) => updateProfile({ profileImage: uri }));

  const handleEditProfile = onEditProfilePress ?? (() => router.push('/edit-profile'));

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border/60 shadow-card">
      <View className="flex-row items-center">
        <Pressable onPress={showImagePicker} accessibilityRole="button" accessibilityLabel="Change profile photo">
          <View className="relative">
            <ProfileAvatar size="lg" profileImage={profile.profileImage} gender={profile.gender} />
            <View className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary items-center justify-center border-2 border-surface">
              <Camera size={12} color="#FFFFFF" />
            </View>
          </View>
        </Pressable>
        <View className="flex-1 ml-4 min-w-0">
          <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1">
            <Text className="text-title text-foreground font-bold shrink" numberOfLines={1}>
              {profile.fullName || 'Your Profile'}
            </Text>
            {profile.isPremium && (
              <View className="flex-row items-center bg-primary/10 rounded-full px-2 py-0.5 shrink-0 gap-0.5">
                <Crown size={10} color="#7C3AED" />
                <Text className="text-[10px] font-bold text-primary">Premium</Text>
              </View>
            )}
          </View>
          <Text className="text-caption text-foreground-secondary mt-0.5" numberOfLines={1}>
            {isAuthenticated
              ? profile.email || 'Add your email'
              : isGuest
                ? 'Guest mode — sign in to sync your profile'
                : profile.email || 'Add your email'}
          </Text>
          <View className="flex-row items-center mt-1.5 gap-3 flex-wrap">
            <View className="flex-row items-center gap-1">
              <Flame size={12} color="#F59E0B" />
              <Text className="text-[11px] font-semibold text-foreground-secondary">{profile.streak} Day Streak</Text>
            </View>
            <Pressable onPress={handleEditProfile} accessibilityRole="button" accessibilityLabel="Edit profile">
              <Text className="text-[11px] font-bold text-primary">{editProfileLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View className="mt-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[11px] text-foreground-secondary">Profile completion</Text>
          <Text className="text-[11px] font-bold text-primary">{profileCompletion}%</Text>
        </View>
        <View className="h-1.5 bg-border/40 rounded-full overflow-hidden">
          <View className="h-full bg-primary rounded-full" style={{ width: `${profileCompletion}%` }} />
        </View>
      </View>
    </View>
  );
}
