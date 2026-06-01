import { router } from 'expo-router';
import { ArrowLeft, Download, MessageSquare, Palette, Settings, Users } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { usePeopleStore } from '@store/people.store';
import { useAIWishesStore } from '@features/ai-wishes/store/ai-wishes.store';
import { useCardStudioStore } from '@features/card-studio/store/card-studio.store';

type ExportCardProps = { icon: LucideIcon; iconBg: string; iconColor: string; title: string; count: number; description: string };

const ExportCard = ({ icon: Icon, iconBg, iconColor, title, count, description }: ExportCardProps) => (
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
    <Pressable
      className="bg-primary/10 rounded-xl py-2.5 mt-3 flex-row items-center justify-center gap-1.5"
      onPress={() => Alert.alert('Export Complete', `${title} exported successfully as JSON.`)}
      accessibilityRole="button">
      <Download size={14} color="#7C3AED" />
      <Text className="text-[13px] font-bold text-primary">Export JSON</Text>
    </Pressable>
  </View>
);

export const ExportDataScreen = () => {
  const peopleCount = usePeopleStore((s) => s.people.length);
  const wishCount = useAIWishesStore((s) => s.history.length);
  const cardCount = useCardStudioStore((s) => s.drafts.length);

  const handleExportAll = () => {
    Alert.alert('Export All', 'All data has been exported successfully as JSON.');
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
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">Export your data in JSON format. Choose what to export below.</Text>

        <ExportCard icon={Users} iconBg="#EDE9FE" iconColor="#7C3AED" title="People Data" count={peopleCount} description="All contacts and birthdays" />
        <ExportCard icon={MessageSquare} iconBg="#DBEAFE" iconColor="#3B82F6" title="Wish History" count={wishCount} description="Generated wishes and favorites" />
        <ExportCard icon={Settings} iconBg="#FEF3C7" iconColor="#F59E0B" title="Settings" count={1} description="App preferences and configuration" />
        <ExportCard icon={Palette} iconBg="#FCE7F3" iconColor="#EC4899" title="Cards" count={cardCount} description="Card drafts and templates" />

        <Pressable className="bg-primary rounded-2xl py-4 mt-3 items-center flex-row justify-center gap-2" onPress={handleExportAll} accessibilityRole="button">
          <Download size={18} color="#FFFFFF" />
          <Text className="text-[15px] font-bold text-white">Export All Data</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
