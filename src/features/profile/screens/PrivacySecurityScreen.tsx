import { router } from 'expo-router';
import { ArrowLeft, Eye, Fingerprint, Lock, Smartphone } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';

export const PrivacySecurityScreen = () => {
  const privacy = useProfileStore((s) => s.privacySettings);
  const update = useProfileStore((s) => s.updatePrivacySettings);

  const toggles = [
    { key: 'faceId' as const, title: 'Face ID', desc: 'Unlock with Face ID', icon: Fingerprint, color: '#7C3AED', bg: '#EDE9FE' },
    { key: 'biometricLock' as const, title: 'Biometric Lock', desc: 'Require biometric to open app', icon: Fingerprint, color: '#3B82F6', bg: '#DBEAFE' },
    { key: 'appLock' as const, title: 'App Lock', desc: 'Lock app when in background', icon: Lock, color: '#F59E0B', bg: '#FEF3C7' },
    { key: 'hidePersonalData' as const, title: 'Hide Personal Data', desc: 'Mask sensitive info on screen', icon: Eye, color: '#EF4444', bg: '#FEE2E2' },
  ];

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
                  onValueChange={(v) => update({ [item.key]: v })}
                  trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>

        <Pressable
          className="bg-surface rounded-2xl px-4 py-4 border border-border/60 mt-4 flex-row items-center"
          onPress={() => Alert.alert('Password Changed', 'Your password has been changed successfully.')}
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
                <Text className="text-[15px] font-medium text-foreground">iPhone 15 Pro</Text>
                <Text className="text-[12px] text-foreground-secondary mt-0.5">Mumbai, India · Active now</Text>
              </View>
              <View className="bg-success/20 rounded-full px-2 py-0.5">
                <Text className="text-[10px] font-bold text-success">Current</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
