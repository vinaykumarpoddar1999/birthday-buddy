import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, FileText, Lock, Shield } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { biometricService } from '@/services/auth/biometric.service';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { useAuth } from '@features/auth';

import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '../store/profile.store';

export const PrivacySecurityScreen = () => {
  const privacy = useProfileStore((s) => s.privacySettings);
  const updatePrivacy = useProfileStore((s) => s.updatePrivacySettings);
  const { user, changePassword, updateSecurityPreferences, securityPreferences, isAuthenticated } =
    useAuth();
  const { showSuccess, showError, toast } = useFeedback();
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [lockLabel, setLockLabel] = useState('Device passcode or biometrics');

  const systemLockEnabled = isAuthenticated
    ? (securityPreferences?.appLockEnabled ?? false)
    : privacy.systemLockEnabled;

  useEffect(() => {
    void (async () => {
      const caps = await biometricService.getCapabilities();
      setLockLabel(biometricService.getSystemLockLabel(caps.supportedTypes));
    })();
  }, []);

  const applySystemLock = useCallback(
    async (value: boolean) => {
      if (isAuthenticated) {
        await updateSecurityPreferences({
          appLockEnabled: value,
          devicePasscodeEnabled: value,
          biometricEnabled: value,
          faceIdEnabled: false,
          fingerprintEnabled: false,
          lockOnBackground: value,
          lockOnRestart: value,
          lockAfterInactivity: value,
          autoLockTimer: value ? 'immediate' : securityPreferences?.autoLockTimer ?? '5',
        });
      } else {
        updatePrivacy({ systemLockEnabled: value });
      }
      toast(`System lock ${value ? 'enabled' : 'disabled'}`, 'success');
    },
    [
      isAuthenticated,
      securityPreferences?.autoLockTimer,
      toast,
      updatePrivacy,
      updateSecurityPreferences,
    ],
  );

  const handleSystemLockToggle = useCallback(
    async (value: boolean) => {
      if (value) {
        const caps = await biometricService.getCapabilities();
        if (!caps.hasHardware || !caps.isEnrolled) {
          showError(
            'System lock unavailable',
            'Set up Face ID, fingerprint, or a device PIN in your phone settings first.',
          );
          return;
        }
        const result = await biometricService.authenticate('Verify to enable system lock');
        if (!result.success) {
          toast('Authentication failed', 'error');
          return;
        }
      }
      await applySystemLock(value);
      if (value && !isAuthenticated) {
        useAuthStore.getState().setLocked(true);
      }
    },
    [applySystemLock, isAuthenticated, showError, toast],
  );

  const handlePasswordChange = async () => {
    if (!user) {
      showError('Sign In Required', 'Create an account or sign in to change your password.');
      return;
    }
    if (newPassword.length < 8) {
      showError('Invalid Password', 'Password must be at least 8 characters.');
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      showSuccess('Password Updated', 'Your password has been changed successfully.');
    } catch {
      showError('Update Failed', 'Current password is incorrect or new password is too weak.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Privacy & Security</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2 mt-4">
          App Protection
        </Text>
        <View className="bg-surface rounded-2xl px-4 border border-primary/15 mt-1 overflow-hidden">
          <LinearGradient
            colors={['#7C3AED33', '#EC489922']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 4 }}
          />
          <View className="flex-row items-center py-4">
            <View className="h-10 w-10 rounded-xl items-center justify-center mr-3 bg-[#EDE9FE]">
              <Shield size={20} color="#7C3AED" />
            </View>
            <View className="flex-1 mr-2">
              <Text className="text-[16px] font-bold text-foreground">System lock</Text>
              <Text className="text-[12px] text-foreground-secondary mt-1 leading-5">{lockLabel}</Text>
              <Text className="text-[11px] text-primary mt-1">
                Requires authentication when opening the app
              </Text>
            </View>
            <Switch
              value={systemLockEnabled}
              onValueChange={(v) => void handleSystemLockToggle(v)}
              trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {isAuthenticated ? (
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
        ) : null}

        <View className="mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Legal</Text>
          <View className="bg-surface rounded-2xl border border-border/60">
            <Pressable
              className="flex-row items-center py-3.5 px-4"
              onPress={() => router.push('/privacy-policy')}
              accessibilityRole="button">
              <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DCFCE7]">
                <Shield size={18} color="#22C55E" />
              </View>
              <Text className="text-[15px] font-medium text-foreground flex-1">Privacy Policy</Text>
            </Pressable>
            <View className="h-[0.5px] bg-border/60 mx-4" />
            <Pressable
              className="flex-row items-center py-3.5 px-4"
              onPress={() => router.push('/terms-conditions')}
              accessibilityRole="button">
              <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DBEAFE]">
                <FileText size={18} color="#3B82F6" />
              </View>
              <Text className="text-[15px] font-medium text-foreground flex-1">Terms & Conditions</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal transparent animationType="slide" visible={passwordModal} onRequestClose={() => setPasswordModal(false)}>
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setPasswordModal(false)}>
          <Pressable className="bg-surface rounded-t-3xl p-6" onPress={(e) => e.stopPropagation()}>
            <View className="flex-row items-center gap-2 mb-4">
              <Lock size={20} color="#7C3AED" />
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
              placeholder="New password (min 8 chars)"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              className="bg-background border border-border rounded-xl px-4 py-3 mb-4 text-[15px] text-foreground"
            />
            <Pressable
              className="bg-primary rounded-2xl py-4 items-center"
              onPress={handlePasswordChange}
              accessibilityRole="button">
              <Text className="text-[15px] font-bold text-white">Update Password</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
