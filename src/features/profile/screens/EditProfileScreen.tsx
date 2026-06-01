import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowLeft, Camera, Crown } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';

const GIRL_AVATAR = require('../../../../assets/images/girl.png');
const BOY_AVATAR = require('../../../../assets/images/boy.png');

const GENDERS = ['male', 'female', 'other'] as const;

export const EditProfileScreen = () => {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const profileCompletion = useProfileStore((s) => s.profileCompletion);

  const [name, setName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [gender, setGender] = useState(profile.gender);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);

  const handleSave = () => {
    updateProfile({ fullName: name, email, phone, gender, birthday, location, bio });
    Alert.alert('Profile Updated', 'Your changes have been saved.');
    router.back();
  };

  const avatarSource = gender === 'male' ? BOY_AVATAR : GIRL_AVATAR;

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
        {/* Avatar */}
        <View className="items-center my-5">
          <View className="relative">
            <Image source={avatarSource} style={{ width: 96, height: 96, borderRadius: 48 }} contentFit="cover" />
            <Pressable className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary items-center justify-center border-2 border-surface" accessibilityRole="button">
              <Camera size={14} color="#FFFFFF" />
            </Pressable>
          </View>
          <View className="flex-row items-center mt-3 gap-2">
            <View className="h-1.5 w-20 bg-border/40 rounded-full overflow-hidden">
              <View className="h-full bg-primary rounded-full" style={{ width: `${profileCompletion}%` }} />
            </View>
            <Text className="text-[11px] font-bold text-primary">{profileCompletion}% complete</Text>
          </View>
        </View>

        {/* Premium Badge */}
        {profile.isPremium && (
          <View className="bg-primary/5 rounded-xl p-3 flex-row items-center justify-center gap-2 mb-5 border border-primary/20">
            <Crown size={16} color="#7C3AED" />
            <Text className="text-[13px] font-bold text-primary">Premium Member</Text>
            <Text className="text-[11px] text-foreground-secondary">· Joined {new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text>
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
          <FieldInput label="Location" value={location} onChangeText={setLocation} placeholder="City, Country" />
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
