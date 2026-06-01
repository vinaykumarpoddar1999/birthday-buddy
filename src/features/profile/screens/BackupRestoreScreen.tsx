import { router } from 'expo-router';
import { ArrowLeft, Check, Cloud, Download, HardDrive, Upload } from 'lucide-react-native';
import { useCallback } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';

export const BackupRestoreScreen = () => {
  const backup = useProfileStore((s) => s.backupSettings);
  const update = useProfileStore((s) => s.updateBackupSettings);

  const handleBackup = useCallback(() => {
    update({ backupStatus: 'backing_up' });
    setTimeout(() => {
      update({ backupStatus: 'completed', lastBackupDate: new Date().toISOString() });
      Alert.alert('Backup Complete', 'Your data has been backed up successfully.');
    }, 2000);
  }, [update]);

  const handleRestore = useCallback(() => {
    Alert.alert('Restore Data', 'This will replace your current data with the last backup. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore',
        style: 'destructive',
        onPress: () => {
          update({ backupStatus: 'restoring' });
          setTimeout(() => {
            update({ backupStatus: 'completed' });
            Alert.alert('Restored', 'Your data has been restored successfully.');
          }, 2000);
        },
      },
    ]);
  }, [update]);

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusConfig = {
    idle: { label: 'Ready', color: '#22C55E', bg: '#DCFCE7' },
    backing_up: { label: 'Backing up...', color: '#3B82F6', bg: '#DBEAFE' },
    restoring: { label: 'Restoring...', color: '#F59E0B', bg: '#FEF3C7' },
    completed: { label: 'Completed', color: '#22C55E', bg: '#DCFCE7' },
    failed: { label: 'Failed', color: '#EF4444', bg: '#FEE2E2' },
  };

  const status = statusConfig[backup.backupStatus];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Backup & Restore</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View className="bg-surface rounded-2xl p-4 border border-border/60 mt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[13px] text-foreground-secondary">Last Backup</Text>
              <Text className="text-[15px] font-semibold text-foreground mt-0.5">{formatDate(backup.lastBackupDate)}</Text>
            </View>
            <View className="rounded-full px-3 py-1" style={{ backgroundColor: status.bg }}>
              <Text className="text-[11px] font-bold" style={{ color: status.color }}>{status.label}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-4">
          <Pressable
            className="flex-1 bg-primary rounded-2xl py-4 items-center flex-row justify-center gap-2"
            onPress={handleBackup}
            disabled={backup.backupStatus === 'backing_up'}
            accessibilityRole="button">
            <Upload size={18} color="#FFFFFF" />
            <Text className="text-[15px] font-bold text-white">Backup Now</Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-surface rounded-2xl py-4 items-center flex-row justify-center gap-2 border border-border"
            onPress={handleRestore}
            disabled={backup.backupStatus === 'restoring'}
            accessibilityRole="button">
            <Download size={18} color="#7C3AED" />
            <Text className="text-[15px] font-bold text-primary">Restore</Text>
          </Pressable>
        </View>

        {/* Toggles */}
        <View className="bg-surface rounded-2xl px-4 border border-border/60 mt-6">
          <View className="flex-row items-center py-3.5">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DBEAFE]">
              <Cloud size={18} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Cloud Backup</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Auto-backup to cloud</Text>
            </View>
            <Switch value={backup.cloudBackup} onValueChange={(v) => update({ cloudBackup: v })} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#FFFFFF" />
          </View>
          <View className="h-[0.5px] bg-border/60 ml-12" />
          <View className="flex-row items-center py-3.5">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#FEF3C7]">
              <HardDrive size={18} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Local Backup</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Save backup to device</Text>
            </View>
            <Switch value={backup.localBackup} onValueChange={(v) => update({ localBackup: v })} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#FFFFFF" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
