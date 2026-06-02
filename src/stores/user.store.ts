import { create } from 'zustand';

import { DEFAULT_USER_PROFILE, profileService } from '@/services/profile/profile.service';
import type { UserProfile } from '@features/profile/types';

export const calcProfileCompletion = (profile: UserProfile): number => {
  const fields = [
    profile.profileImage,
    profile.fullName,
    profile.birthday,
    profile.preferences,
    profile.email,
    profile.phone,
    profile.gender !== 'other' ? profile.gender : '',
    profile.location,
    profile.bio,
    profile.timezone,
    profile.country,
  ];
  const filled = fields.filter((f) => f && String(f).length > 0).length;
  return Math.round((filled / fields.length) * 100);
};

interface UserStoreState {
  profile: UserProfile;
  profileCompletion: number;
  updateProfile: (updates: Partial<UserProfile>) => UserProfile;
  hydrate: (profile: UserProfile) => void;
  reset: () => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  profile: DEFAULT_USER_PROFILE,
  profileCompletion: calcProfileCompletion(DEFAULT_USER_PROFILE),

  updateProfile: (updates) => {
    let nextProfile = DEFAULT_USER_PROFILE;
    set((s) => {
      nextProfile = { ...s.profile, ...updates };
      return { profile: nextProfile, profileCompletion: calcProfileCompletion(nextProfile) };
    });
    return nextProfile;
  },

  hydrate: (profile) => {
    set({ profile, profileCompletion: calcProfileCompletion(profile) });
  },

  reset: () => {
    set({ profile: DEFAULT_USER_PROFILE, profileCompletion: calcProfileCompletion(DEFAULT_USER_PROFILE) });
  },
}));

export async function persistUserProfile(profile: UserProfile): Promise<void> {
  const bundle = await profileService.load();
  await profileService.saveBundle({ ...bundle, profile });
}
