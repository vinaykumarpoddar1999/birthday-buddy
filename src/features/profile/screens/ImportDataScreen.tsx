import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { ArrowLeft, FileJson, Upload, Users } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { backupService } from '@/services/backup/backup.service';
import { useFeedback } from '@/shared/hooks/useFeedback';

export const ImportDataScreen = () => {
  const [preview, setPreview] = useState<{ people: number; wishes: number; cards: number; settings: number } | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const { showConfirm, showSuccess, showError } = useFeedback();

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/json', '*/*'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    setFileUri(asset.uri);
    setFileName(asset.name);
    try {
      const stats = await backupService.previewImport(asset.uri);
      setPreview(stats);
    } catch {
      setPreview(null);
      showError('Invalid File', 'Could not read backup file. Ensure it is a valid BirthdayBuddy JSON backup.');
    }
  };

  const handleImport = () => {
    if (!fileUri) return;
    showConfirm({
      title: 'Confirm Import',
      message: `Import ${preview?.people ?? 0} people, ${preview?.wishes ?? 0} wishes, and ${preview?.cards ?? 0} cards? This replaces current data.`,
      destructive: true,
      confirmLabel: 'Import',
      onConfirm: () => {
        void (async () => {
          setBusy(true);
          try {
            await backupService.importFromUri(fileUri);
            showSuccess('Import Complete', 'Your data has been imported successfully.');
            router.back();
          } catch (error) {
            showError('Import Failed', error instanceof Error ? error.message : 'Could not import data.');
          } finally {
            setBusy(false);
          }
        })();
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Import Data</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">
          Import a JSON backup file. Preview the contents before confirming.
        </Text>

        <Pressable
          className="bg-surface rounded-2xl p-6 border border-dashed border-primary/40 items-center"
          onPress={() => void pickFile()}
          accessibilityRole="button">
          <Upload size={32} color="#7C3AED" />
          <Text className="text-[15px] font-bold text-primary mt-3">Choose Backup File</Text>
          <Text className="text-[12px] text-foreground-secondary mt-1">JSON format supported</Text>
        </Pressable>

        {fileName ? (
          <View className="bg-primary/5 rounded-xl p-3 mt-4 flex-row items-center gap-2">
            <FileJson size={18} color="#7C3AED" />
            <Text className="text-[13px] font-medium text-foreground flex-1" numberOfLines={1}>{fileName}</Text>
          </View>
        ) : null}

        {preview && (
          <View className="mt-5">
            <Text className="text-[14px] font-bold text-foreground mb-3">Import Preview</Text>
            <View className="bg-surface rounded-2xl p-4 border border-border/60 gap-3">
              <PreviewRow icon={Users} label="People" count={preview.people} />
              <PreviewRow icon={FileJson} label="Wishes" count={preview.wishes} />
              <PreviewRow icon={FileJson} label="Cards" count={preview.cards} />
              <PreviewRow icon={FileJson} label="Settings" count={preview.settings} />
            </View>
          </View>
        )}

        <Pressable
          className={`rounded-2xl py-4 mt-6 items-center flex-row justify-center gap-2 ${preview && fileUri ? 'bg-primary' : 'bg-primary/30'}`}
          onPress={handleImport}
          disabled={!preview || !fileUri || busy}
          accessibilityRole="button">
          {busy ? <ActivityIndicator color="#FFFFFF" /> : null}
          <Text className="text-[15px] font-bold text-white">Confirm Import</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

function PreviewRow({ icon: Icon, label, count }: { icon: typeof Users; label: string; count: number }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Icon size={16} color="#7C3AED" />
        <Text className="text-[14px] text-foreground">{label}</Text>
      </View>
      <Text className="text-[14px] font-bold text-primary">{count}</Text>
    </View>
  );
}
