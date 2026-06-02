import { router } from 'expo-router';
import { ArrowLeft, Check, Cloud, Download, HardDrive, Trash2, Upload } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { syncBackupScheduler } from '@/services/backup/backup-scheduler.service';
import { backupService, type BackupHistoryEntry } from '@/services/backup/backup.service';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { getSaveSuccessMessage } from '@/utils/file-download';

import { useProfileStore } from '../store/profile.store';

export const BackupRestoreScreen = () => {
  const backup = useProfileStore((s) => s.backupSettings);
  const update = useProfileStore((s) => s.updateBackupSettings);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<BackupHistoryEntry[]>([]);
  const { showSuccess, showError, showConfirm, showDeleteConfirm } = useFeedback();

  const loadHistory = useCallback(async () => {
    const items = await backupService.listBackupHistory();
    setHistory(items);
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    void syncBackupScheduler(backup.autoBackup);
  }, [backup.autoBackup]);

  const handleBackup = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    update({ backupStatus: 'backing_up' });
    try {
      const result = await backupService.downloadJsonBackup();
      update({
        backupStatus: 'completed',
        lastBackupDate: new Date().toISOString(),
      });
      await loadHistory();
      showSuccess('Backup Complete', getSaveSuccessMessage(result));
    } catch (error) {
      update({ backupStatus: 'failed' });
      showError('Backup Failed', error instanceof Error ? error.message : 'Could not create backup.');
    } finally {
      setBusy(false);
    }
  }, [busy, update, loadHistory, showSuccess, showError]);

  const handleRestore = useCallback(() => {
    showConfirm({
      title: 'Restore Data',
      message: 'This will replace all current data with the backup. Continue?',
      destructive: true,
      confirmLabel: 'Restore',
      onConfirm: () => {
        void (async () => {
          setBusy(true);
          update({ backupStatus: 'restoring' });
          try {
            await backupService.restoreFromPicker();
            update({ backupStatus: 'completed', lastBackupDate: new Date().toISOString() });
            await loadHistory();
            showSuccess('Restore Complete', 'Your data has been restored successfully.');
          } catch (error) {
            update({ backupStatus: 'failed' });
            if (error instanceof Error && error.message !== 'Restore cancelled.') {
              showError('Restore Failed', error.message);
            }
          } finally {
            setBusy(false);
          }
        })();
      },
    });
  }, [showConfirm, showSuccess, showError, update, loadHistory]);

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
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

        <View className="flex-row gap-3 mt-4">
          <Pressable
            className="flex-1 bg-primary rounded-2xl py-4 items-center flex-row justify-center gap-2"
            onPress={() => void handleBackup()}
            disabled={busy}
            accessibilityRole="button">
            {busy && backup.backupStatus === 'backing_up' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Upload size={18} color="#FFFFFF" />
            )}
            <Text className="text-[15px] font-bold text-white">Backup Now</Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-surface rounded-2xl py-4 items-center flex-row justify-center gap-2 border border-border"
            onPress={handleRestore}
            disabled={busy}
            accessibilityRole="button">
            <Download size={18} color="#7C3AED" />
            <Text className="text-[15px] font-bold text-primary">Restore</Text>
          </Pressable>
        </View>

        <Pressable
          className="mt-3 bg-surface rounded-2xl py-3.5 items-center border border-border/60"
          onPress={() => router.push('/import-data')}
          accessibilityRole="button">
          <Text className="text-[14px] font-semibold text-primary">Import Data with Preview →</Text>
        </Pressable>

        <View className="bg-surface rounded-2xl px-4 border border-border/60 mt-6">
          <View className="flex-row items-center py-3.5">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DBEAFE]">
              <Cloud size={18} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Cloud Backup</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Coming with sync</Text>
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
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Export JSON to device</Text>
            </View>
            <Switch value={backup.localBackup} onValueChange={(v) => update({ localBackup: v })} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#FFFFFF" />
          </View>
          <View className="h-[0.5px] bg-border/60 ml-12" />
          <View className="flex-row items-center py-3.5">
            <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-[#DCFCE7]">
              <Check size={18} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Auto Backup</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Weekly automatic backup</Text>
            </View>
            <Switch
              value={backup.autoBackup}
              onValueChange={(v) => {
                update({ autoBackup: v });
                void syncBackupScheduler(v);
              }}
              trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {history.length > 0 && (
          <View className="mt-6">
            <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Backup History</Text>
            {history.map((item) => (
              <View key={item.id} className="bg-surface rounded-xl p-3.5 mb-2 border border-border/60 flex-row items-center">
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-foreground">{item.fileName}</Text>
                  <Text className="text-[11px] text-foreground-secondary mt-0.5">
                    {formatDate(item.createdAt)} · {formatSize(item.fileSize)} · {item.backupType.toUpperCase()}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    showDeleteConfirm({
                      title: 'Delete Backup Record',
                      message: 'Remove this backup from history?',
                      onConfirm: () => void backupService.deleteBackupHistory(item.id).then(loadHistory),
                    })
                  }
                  accessibilityRole="button">
                  <Trash2 size={16} color="#9CA3AF" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row items-center mt-4 px-1 gap-2">
          <Check size={14} color="#22C55E" />
          <Text className="text-[12px] text-foreground-secondary flex-1">
            All people, wishes, cards, and settings are stored in SQLite on this device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
