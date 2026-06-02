import { router } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFeedback } from '@/shared/hooks/useFeedback';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { useProfileImagePicker } from '@/shared/hooks/useProfileImagePicker';

import { z } from 'zod';

import { useProfileStore } from '../store/profile.store';
import { COUNTRY_OPTIONS, profileSchema, TIMEZONE_OPTIONS } from '../validation/profile.schema';

const GENDERS = ['male', 'female', 'other'] as const;

export const PersonalInfoScreen = () => {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [name, setName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [gender, setGender] = useState(profile.gender);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [country, setCountry] = useState(profile.country);
  const [profileImage, setProfileImage] = useState(profile.profileImage);
  const { toast, showError } = useFeedback();
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
        relationshipStatus: profile.relationshipStatus,
        relationship: profile.relationship,
        timezone,
        country,
        preferences: profile.preferences,
      });
      updateProfile({ ...validated, profileImage });
      toast('Your profile has been updated', 'success');
      router.back();
    } catch (error) {
      if (error instanceof z.ZodError) {
        showError('Validation Error', error.issues[0]?.message ?? 'Please check your input.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Personal Information</Text>
        <Pressable onPress={handleSave} accessibilityRole="button">
          <Text className="text-body font-bold text-primary">Save</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="items-center my-5">
          <Pressable onPress={showImagePicker} accessibilityRole="button" accessibilityLabel="Change photo">
            <View className="relative">
              <ProfileAvatar size="xl" profileImage={profileImage} gender={gender} />
              <View className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary items-center justify-center border-2 border-surface">
                <Camera size={14} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>
        </View>

        <View className="gap-4">
          <FieldInput label="Full Name" value={name} onChangeText={setName} placeholder="Enter your name" />
          <FieldInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" />
          <FieldInput label="Phone" value={phone} onChangeText={setPhone} placeholder="Enter phone" keyboardType="phone-pad" />

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
          <FieldInput label="Location" value={location} onChangeText={setLocation} placeholder="City, Country" />

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Country</Text>
            <View className="flex-row flex-wrap gap-2">
              {COUNTRY_OPTIONS.slice(0, 6).map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCountry(c)}
                  className={`px-3 py-2 rounded-xl border ${country === c ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                  accessibilityRole="button">
                  <Text className={`text-[12px] font-semibold ${country === c ? 'text-primary' : 'text-foreground-secondary'}`}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-[13px] font-medium text-foreground-secondary mb-2">Timezone</Text>
            <View className="flex-row flex-wrap gap-2">
              {TIMEZONE_OPTIONS.slice(0, 6).map((tz) => (
                <Pressable
                  key={tz}
                  onPress={() => setTimezone(tz)}
                  className={`px-3 py-2 rounded-xl border ${timezone === tz ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                  accessibilityRole="button">
                  <Text className={`text-[11px] font-semibold ${timezone === tz ? 'text-primary' : 'text-foreground-secondary'}`}>{tz.replace(/_/g, ' ')}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <FieldInput label="Bio" value={bio} onChangeText={setBio} placeholder="Tell us about yourself..." multiline numberOfLines={3} />
        </View>
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
