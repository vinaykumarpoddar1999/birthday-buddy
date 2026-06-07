import { router } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Bell, Camera, Contact, Image as ImageIcon, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@features/auth';
import { CelebrationBackground } from '@features/auth/components/CelebrationBackground';
import { Button } from '@shared/ui';
import { PermissionCard } from '../components';

type PermissionKey = 'notifications' | 'camera' | 'photos' | 'contacts';

export function PermissionSetupScreen() {
  const { completeOnboarding } = useAuth();
  const [granted, setGranted] = useState<Record<PermissionKey, boolean>>({
    notifications: false,
    camera: false,
    photos: false,
    contacts: false,
  });

  const markGranted = (key: PermissionKey) => {
    setGranted((prev) => ({ ...prev, [key]: true }));
  };

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') markGranted('notifications');
  };

  const requestCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') markGranted('camera');
  };

  const requestPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') markGranted('photos');
  };

  const requestContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') markGranted('contacts');
  };

  const handleContinue = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1">
      <CelebrationBackground />
      <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-6" contentContainerClassName="pb-10 pt-8" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
            <Shield size={26} color="#7C3AED" />
          </View>
          <Text className="text-[28px] font-bold text-foreground text-center mb-2">Enable Permissions</Text>
          <Text className="text-base text-foreground-secondary leading-6 text-center px-2">
            Unlock the full experience with optional permissions. You can change these anytime in device settings.
          </Text>
        </View>

        <PermissionCard
          icon={Bell}
          title="Notifications"
          description="Get timely birthday reminders and alerts so you never miss a celebration."
          granted={granted.notifications}
          onRequest={requestNotifications}
          color="#7C3AED"
          bg="#EDE9FE"
        />
        <PermissionCard
          icon={Camera}
          title="Camera"
          description="Take photos for profile pictures and personalized birthday cards."
          granted={granted.camera}
          onRequest={requestCamera}
          color="#EC4899"
          bg="#FCE7F3"
        />
        <PermissionCard
          icon={ImageIcon}
          title="Photos"
          description="Access your photo library to add images to cards and your profile."
          granted={granted.photos}
          onRequest={requestPhotos}
          color="#3B82F6"
          bg="#DBEAFE"
        />
        <PermissionCard
          icon={Contact}
          title="Contacts"
          description="Import contacts to quickly add birthdays from your address book."
          granted={granted.contacts}
          onRequest={requestContacts}
          color="#22C55E"
          bg="#DCFCE7"
        />

        <View className="mt-6">
          <Button label="Continue to App" size="lg" onPress={() => void handleContinue()} />
        </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
}
