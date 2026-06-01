import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { ArrowLeft, Eye, Fingerprint, Lock, Smartphone, Timer } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFeedback } from '@/shared/hooks/useFeedback';

import { useProfileStore } from '../store/profile.store';

export const PrivacySecurityScreen = () => {
  const privacy = useProfileStore((s) => s.privacySettings);
  const update = useProfileStore((s) => s.updatePrivacySettings);
  const { showSuccess, showError, toast } = useFeedback();
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const toggles = [
    { key: 'faceId' as const, title: 'Face ID', desc: 'Unlock with Face ID', icon: Fingerprint, color: '#7C3AED', bg: '#EDE9FE' },
    { key: 'biometricLock' as const, title: 'Biometric Lock', desc: 'Require biometric to open app', icon: Fingerprint, color: '#3B82F6', bg: '#DBEAFE' },
    { key: 'appLock' as const, title: 'App Lock', desc: 'Lock app when in background', icon: Lock, color: '#F59E0B', bg: '#FEF3C7' },
    { key: 'hidePersonalData' as const, title: 'Hide Sensitive Data', desc: 'Mask sensitive info on screen', icon: Eye, color: '#EF4444', bg: '#FEE2E2' },
    { key: 'privateMode' as const, title: 'Private Mode', desc: 'Hide profile details from previews', icon: Eye, color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  const handleBiometricToggle = async (key: 'faceId' | 'biometricLock', value: boolean) => {
    if (value) {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!compatible || !enrolled) {
        showError('Biometrics Unavailable', 'Set up Face ID or fingerprint on your device first.');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity',
      });
      if (!result.success) {
        toast('Authentication failed', 'error');
        return;
      }
    }
    update({ [key]: value });
    toast(`${key === 'faceId' ? 'Face ID' : 'Biometric lock'} ${value ? 'enabled' : 'disabled'}`, 'success');
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
      showError('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    setPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    showSuccess('Password Updated', 'Your password has been changed successfully.');
  };

  const lockTimers = [1, 5, 15, 30];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Privacy & Security</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="bg-surface rounded-2xl px-4 border border-border/60 mt-4">
          {toggles.map((item, i) => (
            <View key={item.key}>
              {i > 0 && <View className="h-[0.5px] bg-border/60 ml-12" />}
              <View className="flex-row items-center py-3.5">
                <View className="h-9 w-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: item.bg }}>
                  <item.icon size={18} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-medium text-foreground">{item.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5">{item.desc}</Text>
                </View>
                <Switch
                  value={privacy[item.key]}
                  onValueChange={(v) => {
                    if (item.key === 'faceId' || item.key === 'biometricLock') {
                      void handleBiometricToggle(item.key, v);
                    } else {
                      update({ [item.key]: v });
                    }
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>

        <View className="mt-4">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Auto Lock Timer</Text>
          <View className="flex-row flex-wrap gap-2">
            {lockTimers.map((mins) => (
              <Pressable
                key={mins}
                onPress={() => update({ autoLockMinutes: mins })}
                className={`px-4 py-2 rounded-xl border ${privacy.autoLockMinutes === mins ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                accessibilityRole="button">
                <Text className={`text-[13px] font-semibold ${privacy.autoLockMinutes === mins ? 'text-primary' : 'text-foreground-secondary'}`}>
                  {mins} min
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          className="bg-surface rounded-2xl px-4 py-4 border border-border/60 mt-4 flex-row items-center"
          onPress={() => setPasswordModal(true)}
          accessibilityRole="button">
          <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DCFCE7]">
            <Lock size={18} color="#22C55E" />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-medium text-foreground">Change Password</Text>
            <Text className="text-[12px] text-foreground-secondary mt-0.5">Update your account password</Text>
          </View>
        </Pressable>

        <View className="mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Active Sessions</Text>
          <View className="bg-surface rounded-2xl px-4 py-4 border border-border/60">
            <View className="flex-row items-center">
              <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DCFCE7]">
                <Smartphone size={18} color="#22C55E" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-medium text-foreground">This Device</Text>
                <Text className="text-[12px] text-foreground-secondary mt-0.5">Local offline session · Active now</Text>
              </View>
              <View className="bg-success/20 rounded-full px-2 py-0.5">
                <Text className="text-[10px] font-bold text-success">Current</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal transparent animationType="slide" visible={passwordModal} onRequestClose={() => setPasswordModal(false)}>
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setPasswordModal(false)}>
          <Pressable className="bg-surface rounded-t-3xl p-6" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center gap-2 mb-4">
              <Timer size={20} color="#7C3AED" />
              <Text className="text-[18px] font-bold text-foreground">Change Password</Text>
            </View>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current password"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              className="bg-background border border-border rounded-xl px-4 py-3 mb-3 text-[15px] text-foreground"
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New password (min 6 chars)"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              className="bg-background border border-border rounded-xl px-4 py-3 mb-4 text-[15px] text-foreground"
            />
            <Pressable className="bg-primary rounded-2xl py-4 items-center" onPress={handlePasswordChange} accessibilityRole="button">
              <Text className="text-[15px] font-bold text-white">Update Password</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
