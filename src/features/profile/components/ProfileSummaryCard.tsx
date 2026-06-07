import { router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { useProfileImagePicker } from '@/shared/hooks/useProfileImagePicker';
import { usePrivacyDisplay } from '@/shared/hooks/usePrivacyDisplay';

import { useProfileStore } from '../store/profile.store';

type ProfileSummaryCardProps = {
  variant?: 'default' | 'settings';
  editProfileLabel?: string;
  onEditProfilePress?: () => void;
};

export function ProfileSummaryCard({
  variant = 'default',
  editProfileLabel = 'View Profile →',
  onEditProfilePress,
}: ProfileSummaryCardProps) {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const profileCompletion = useProfileStore((s) => s.profileCompletion);
  const { maskName, maskEmail, shouldMask } = usePrivacyDisplay();
  const { showImagePicker } = useProfileImagePicker((uri) => updateProfile({ profileImage: uri }));

  const handleEditProfile = onEditProfilePress ?? (() => router.push('/edit-profile'));
  const isSettings = variant === 'settings';

  return (
    <View
      className={`rounded-2xl overflow-hidden ${isSettings ? '' : 'bg-surface border border-border/60 shadow-card'}`}>
      {isSettings ? (
        <LinearGradient
          colors={['#FFFFFF', '#FAF5FF', '#FDF2F8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(124, 58, 237, 0.15)',
          }}>
          <CardContent
            profile={profile}
            shouldMask={shouldMask}
            maskName={maskName}
            maskEmail={maskEmail}
            profileCompletion={profileCompletion}
            showImagePicker={showImagePicker}
            handleEditProfile={handleEditProfile}
            editProfileLabel={editProfileLabel}
            avatarSize="lg"
          />
        </LinearGradient>
      ) : (
        <View className="p-4">
          <CardContent
            profile={profile}
            shouldMask={shouldMask}
            maskName={maskName}
            maskEmail={maskEmail}
            profileCompletion={profileCompletion}
            showImagePicker={showImagePicker}
            handleEditProfile={handleEditProfile}
            editProfileLabel={editProfileLabel}
            avatarSize="lg"
          />
        </View>
      )}
    </View>
  );
}

type CardContentProps = {
  profile: ReturnType<typeof useProfileStore.getState>['profile'];
  shouldMask: boolean;
  maskName: (name: string) => string;
  maskEmail: (email: string) => string;
  profileCompletion: number;
  showImagePicker: () => void;
  handleEditProfile: () => void;
  editProfileLabel: string;
  avatarSize: 'lg' | 'xl';
};

function CardContent({
  profile,
  shouldMask,
  maskName,
  maskEmail,
  profileCompletion,
  showImagePicker,
  handleEditProfile,
  editProfileLabel,
  avatarSize,
}: CardContentProps) {
  return (
    <>
      <View className="flex-row items-center">
        <Pressable onPress={showImagePicker} accessibilityRole="button" accessibilityLabel="Change profile photo">
          <View className="relative">
            <View className="rounded-full border-2 border-primary/30 p-0.5">
              <ProfileAvatar
                size={avatarSize}
                profileImage={shouldMask ? null : profile.profileImage}
                name={profile.fullName}
                gender={profile.gender}
              />
            </View>
            <View className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary items-center justify-center border-2 border-surface">
              <Camera size={12} color="#FFFFFF" />
            </View>
          </View>
        </Pressable>
        <View className="flex-1 ml-4 min-w-0">
          <Text className="text-title text-foreground font-bold shrink" numberOfLines={1}>
            {maskName(profile.fullName || 'Your Profile')}
          </Text>
          <Text className="text-caption text-foreground-secondary mt-0.5" numberOfLines={1}>
            {maskEmail(profile.email || 'Add your email')}
          </Text>
          <Pressable onPress={handleEditProfile} className="mt-2" accessibilityRole="button" accessibilityLabel="Edit profile">
            <Text className="text-[11px] font-bold text-primary">{editProfileLabel}</Text>
          </Pressable>
        </View>
      </View>
      <View className="mt-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[11px] text-foreground-secondary">Profile completion</Text>
          <Text className="text-[11px] font-bold text-primary">{profileCompletion}%</Text>
        </View>
        <View className="h-2 bg-border/40 rounded-full overflow-hidden">
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${profileCompletion}%`, height: '100%', borderRadius: 999 }}
          />
        </View>
      </View>
    </>
  );
}
