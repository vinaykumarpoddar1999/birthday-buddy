import { router } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Notifications from 'expo-notifications';
import { Bell, Camera, Contact, Fingerprint, Image as ImageIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { AuthScreenLayout, PermissionCard } from '../components';

type PermissionKey = 'notifications' | 'camera' | 'photos' | 'contacts' | 'biometrics';

export function PermissionSetupScreen() {
  const { updateSecurityPreferences } = useAuth();
  const [granted, setGranted] = useState<Record<PermissionKey, boolean>>({
    notifications: false,
    camera: false,
    photos: false,
    contacts: false,
    biometrics: false,
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

  const requestBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) markGranted('biometrics');
  };

  const handleContinue = async () => {
    await updateSecurityPreferences({
      permissionsGranted: granted as Record<string, boolean>,
      securitySetupCompleted: true,
    });
    router.replace('/(tabs)');
  };

  return (
    <AuthScreenLayout
      title="App Permissions"
      subtitle="Grant permissions to unlock the full BirthdayBuddy experience. You can change these anytime in Settings.">
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
      <PermissionCard
        icon={Fingerprint}
        title="System Lock (Optional)"
        description="You can enable Face ID, fingerprint, or device PIN later in Privacy & Security."
        granted={granted.biometrics}
        onRequest={requestBiometrics}
      />
      <View className="mt-4">
        <Button label="Continue to App" size="lg" onPress={handleContinue} />
      </View>
    </AuthScreenLayout>
  );
}
