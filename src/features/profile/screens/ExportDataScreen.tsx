import { router } from 'expo-router';
import { ArrowLeft, Download, MessageSquare, Palette, Settings, Users } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { useQuery } from '@tanstack/react-query';

import { usePeople } from '@features/people/hooks/usePeople';
import { wishHistoryQueryKey } from '@features/ai-wishes/hooks/useWishHistory';
import { backupService } from '@/services/backup/backup.service';
import type { ExportModule } from '@/database/backup';
import { cardService } from '@/services/card/card.service';
import { wishService } from '@/services/wish/wish.service';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { getSaveSuccessMessage } from '@/utils/file-download';

type ExportCardProps = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  count: number;
  description: string;
  module: ExportModule;
  exporting: string | null;
  onExport: (module: ExportModule, format: 'json' | 'csv') => void;
};

const ExportCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  count,
  description,
  module,
  exporting,
  onExport,
}: ExportCardProps) => (
  <View className="bg-surface rounded-2xl p-4 border border-border/60 mb-3">
    <View className="flex-row items-center">
      <View className="h-11 w-11 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: iconBg }}>
        <Icon size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-foreground">{title}</Text>
        <Text className="text-[12px] text-foreground-secondary mt-0.5">{description}</Text>
      </View>
      <View className="bg-primary/10 rounded-full px-2.5 py-0.5 mr-2">
        <Text className="text-[11px] font-bold text-primary">{count} items</Text>
      </View>
    </View>
    <View className="flex-row gap-2 mt-3">
      <Pressable
        className="flex-1 bg-primary/10 rounded-xl py-2.5 flex-row items-center justify-center gap-1.5"
        onPress={() => onExport(module, 'json')}
        disabled={exporting !== null}
        accessibilityRole="button">
        {exporting === `${module}-json` ? (
          <ActivityIndicator size="small" color="#7C3AED" />
        ) : (
          <Download size={14} color="#7C3AED" />
        )}
        <Text className="text-[13px] font-bold text-primary">JSON</Text>
      </Pressable>
      {module === 'people' && (
        <Pressable
          className="flex-1 bg-surface border border-border rounded-xl py-2.5 flex-row items-center justify-center gap-1.5"
          onPress={() => onExport(module, 'csv')}
          disabled={exporting !== null}
          accessibilityRole="button">
          <Text className="text-[13px] font-bold text-foreground-secondary">CSV</Text>
        </Pressable>
      )}
    </View>
  </View>
);

export const ExportDataScreen = () => {
  const { data: people = [] } = usePeople();
  const peopleCount = people.length;
  const { data: wishes = [] } = useQuery({
    queryKey: wishHistoryQueryKey,
    queryFn: () => wishService.listAllRecent(500),
  });
  const { data: cardCount = 0 } = useQuery({
    queryKey: ['saved-cards-count'],
    queryFn: () => cardService.countSaved(),
  });
  const wishCount = wishes.length;
  const [exporting, setExporting] = useState<string | null>(null);
  const { showSuccess, showError } = useFeedback();

  const handleExport = useCallback(
    async (module: ExportModule, format: 'json' | 'csv') => {
      const key = `${module}-${format}`;
      setExporting(key);
      try {
        const result = await backupService.downloadModuleExport(module, format);
        showSuccess('Export Complete', getSaveSuccessMessage(result));
      } catch (error) {
        showError('Export Failed', error instanceof Error ? error.message : 'Could not export data.');
      } finally {
        setExporting(null);
      }
    },
    [showSuccess, showError],
  );

  const handleExportAll = async () => {
    setExporting('all-json');
    try {
      const result = await backupService.downloadJsonBackup();
      showSuccess('Export All', getSaveSuccessMessage(result));
    } catch (error) {
      showError('Export Failed', error instanceof Error ? error.message : 'Could not export data.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Export Data</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">
          Export your data in JSON or CSV format. Files are saved directly to your device.
        </Text>

        <ExportCard icon={Users} iconBg="#EDE9FE" iconColor="#7C3AED" title="People Data" count={peopleCount} description="All contacts and birthdays" module="people" exporting={exporting} onExport={handleExport} />
        <ExportCard icon={MessageSquare} iconBg="#DBEAFE" iconColor="#3B82F6" title="Wish History" count={wishCount} description="Generated wishes and favorites" module="wishes" exporting={exporting} onExport={handleExport} />
        <ExportCard icon={Settings} iconBg="#FEF3C7" iconColor="#F59E0B" title="Settings" count={1} description="App preferences and configuration" module="settings" exporting={exporting} onExport={handleExport} />
        <ExportCard icon={Palette} iconBg="#FCE7F3" iconColor="#EC4899" title="Cards" count={cardCount} description="Saved cards and drafts" module="cards" exporting={exporting} onExport={handleExport} />

        <Pressable
          className="bg-primary rounded-2xl py-4 mt-3 items-center flex-row justify-center gap-2"
          onPress={() => void handleExportAll()}
          disabled={exporting !== null}
          accessibilityRole="button">
          {exporting === 'all-json' ? <ActivityIndicator color="#FFFFFF" /> : <Download size={18} color="#FFFFFF" />}
          <Text className="text-[15px] font-bold text-white">Export All Data</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
