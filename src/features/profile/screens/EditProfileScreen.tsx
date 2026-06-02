import { router } from 'expo-router';
import { ArrowLeft, Camera, Crown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFeedback } from '@/shared/hooks/useFeedback';
import { useProfileImagePicker } from '@/shared/hooks/useProfileImagePicker';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';

import { z } from 'zod';

import { useProfileStore } from '../store/profile.store';
import { COUNTRY_OPTIONS, profileSchema, RELATIONSHIP_TYPE_OPTIONS, TIMEZONE_OPTIONS } from '../validation/profile.schema';

const GENDERS = ['male', 'female', 'other'] as const;
const RELATIONSHIP_OPTIONS = ['Single', 'In a relationship', 'Married', 'Prefer not to say'];

export const EditProfileScreen = () => {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const profileCompletion = useProfileStore((s) => s.profileCompletion);
  const { toast, showError } = useFeedback();

  const [name, setName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [gender, setGender] = useState(profile.gender);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);
  const [relationshipStatus, setRelationshipStatus] = useState(profile.relationshipStatus);
  const [relationship, setRelationship] = useState(profile.relationship);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [country, setCountry] = useState(profile.country);
  const [preferences, setPreferences] = useState(profile.preferences);
  const [profileImage, setProfileImage] = useState(profile.profileImage);

  const { showImagePicker } = useProfileImagePicker((uri) => setProfileImage(uri));

  const handleSave = () => {
    try {
      const validated = profileSchema.parse({
        fullName: name,
        email,
        phone,
        gender,
        birthday,
        location,
        bio,
        relationshipStatus,
        relationship,
        timezone,
        country,
        preferences,
      });
      updateProfile({ ...validated, profileImage });
      toast('Profile updated successfully', 'success');
      router.back();
    } catch (error) {
      if (error instanceof z.ZodError) {
        showError('Validation Error', error.issues[0]?.message ?? 'Please check your input.');
      } else {
        showError('Save Failed', 'Could not save profile. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Edit Profile</Text>
        <Pressable onPress={handleSave} accessibilityRole="button">
          <Text className="text-body font-bold text-primary">Save</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="items-center my-5">
          <Pressable onPress={showImagePicker} accessibilityRole="button" accessibilityLabel="Change profile photo">
            <View className="relative">
              <ProfileAvatar size="xl" profileImage={profileImage} gender={gender} />
              <View className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary items-center justify-center border-2 border-surface">
                <Camera size={14} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>
          <View className="flex-row items-center mt-3 gap-2">
            <View className="h-1.5 w-20 bg-border/40 rounded-full overflow-hidden">
              <View className="h-full bg-primary rounded-full" style={{ width: `${profileCompletion}%` }} />
            </View>
            <Text className="text-[11px] font-bold text-primary">{profileCompletion}% complete</Text>
          </View>
        </View>

        {profile.isPremium && (
          <View className="bg-primary/5 rounded-xl p-3 flex-row items-center justify-center gap-2 mb-5 border border-primary/20">
            <Crown size={16} color="#7C3AED" />
            <Text className="text-[13px] font-bold text-primary">Premium Member</Text>
            <Text className="text-[11px] text-foreground-secondary">
              · Joined {new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </Text>
          </View>
        )}

        <View className="gap-4">
          <FieldInput label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />
          <FieldInput label="Email" value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
          <FieldInput label="Phone" value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Gender</Text>
            <View className="flex-row gap-2">
              {GENDERS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-xl items-center border ${gender === g ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                  accessibilityRole="button">
                  <Text className={`text-[13px] font-semibold capitalize ${gender === g ? 'text-primary' : 'text-foreground-secondary'}`}>{g}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <FieldInput label="Birthday" value={birthday} onChangeText={setBirthday} placeholder="YYYY-MM-DD" />
          <FieldInput label="Address / Location" value={location} onChangeText={setLocation} placeholder="City, Country" />

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Country</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1">
              <View className="flex-row gap-2">
                {COUNTRY_OPTIONS.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCountry(c)}
                    className={`px-3 py-2 rounded-xl border ${country === c ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                    accessibilityRole="button">
                    <Text className={`text-[12px] font-semibold ${country === c ? 'text-primary' : 'text-foreground-secondary'}`}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Timezone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1">
              <View className="flex-row gap-2">
                {TIMEZONE_OPTIONS.slice(0, 12).map((tz) => (
                  <Pressable
                    key={tz}
                    onPress={() => setTimezone(tz)}
                    className={`px-3 py-2 rounded-xl border ${timezone === tz ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                    accessibilityRole="button">
                    <Text className={`text-[11px] font-semibold ${timezone === tz ? 'text-primary' : 'text-foreground-secondary'}`}>{tz.replace(/_/g, ' ')}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Relationship</Text>
            <View className="flex-row flex-wrap gap-2">
              {RELATIONSHIP_TYPE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setRelationship(opt)}
                  className={`px-3 py-2 rounded-xl border ${relationship === opt ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                  accessibilityRole="button">
                  <Text className={`text-[12px] font-semibold ${relationship === opt ? 'text-primary' : 'text-foreground-secondary'}`}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Relationship Status</Text>
            <View className="flex-row flex-wrap gap-2">
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setRelationshipStatus(opt)}
                  className={`px-3 py-2 rounded-xl border ${relationshipStatus === opt ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                  accessibilityRole="button">
                  <Text className={`text-[12px] font-semibold ${relationshipStatus === opt ? 'text-primary' : 'text-foreground-secondary'}`}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <FieldInput label="Preferences" value={preferences} onChangeText={setPreferences} placeholder="Gift preferences, interests..." />
          <FieldInput label="Bio" value={bio} onChangeText={setBio} placeholder="Tell us about yourself..." multiline numberOfLines={3} />
        </View>

        <Pressable className="bg-primary rounded-2xl py-4 mt-6 items-center" onPress={handleSave} accessibilityRole="button">
          <Text className="text-[15px] font-bold text-white">Save Changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

type FieldInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
};

const FieldInput = ({ label, value, onChangeText, placeholder, keyboardType, multiline, numberOfLines }: FieldInputProps) => (
  <View>
    <Text className="text-[13px] font-medium text-foreground-secondary mb-1.5">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      className={`bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-foreground ${multiline ? 'min-h-[80px]' : ''}`}
      style={multiline ? { textAlignVertical: 'top' } : undefined}
    />
  </View>
);
