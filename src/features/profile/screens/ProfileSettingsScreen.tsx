import { router, type Href } from 'expo-router';
import * as Linking from 'expo-linking';
import {
  Bell,
  ChevronRight,
  Clock,
  Download,
  FileText,
  HelpCircle,
  Info,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EXTERNAL_LINKS } from '@/constants/links';
import { ROUTES } from '@/constants/routes';
import { TabScreenHeader } from '@shared/ui/TabScreenHeader';

import { ProfileSummaryCard } from '../components/ProfileSummaryCard';
import { useProfileStore } from '../store/profile.store';
import { summarizeReminderSettings } from '../utils/reminder-settings.utils';

type SettingsRowProps = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
};

const SettingsRow = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  value,
  onPress,
  showChevron = true,
}: SettingsRowProps) => (
  <Pressable
    className="flex-row items-center py-3 px-1"
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole="button"
    accessibilityLabel={title}>
    <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 shrink-0" style={{ backgroundColor: iconBg }}>
      <Icon size={18} color={iconColor} />
    </View>
    <View className="flex-1 shrink mr-2 min-w-0">
      <Text className="text-[15px] font-medium text-foreground" numberOfLines={1}>
        {title}
      </Text>
      {description ? (
        <Text className="text-[12px] text-foreground-secondary mt-0.5 leading-4" numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </View>
    {value ? (
      <Text className="text-[13px] text-foreground-secondary mr-1 shrink-0" numberOfLines={1}>
        {value}
      </Text>
    ) : null}
    {showChevron && onPress ? <ChevronRight size={18} color="#9CA3AF" /> : null}
  </Pressable>
);

type QuickActionProps = { icon: LucideIcon; label: string; color: string; bg: string; onPress: () => void };

const QuickAction = ({ icon: Icon, label, color, bg, onPress }: QuickActionProps) => (
  <Pressable className="items-center mr-3 min-w-[68px]" onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
    <View className="h-14 w-14 rounded-2xl items-center justify-center mb-1.5" style={{ backgroundColor: bg }}>
      <Icon size={22} color={color} />
    </View>
    <Text className="text-[11px] font-medium text-foreground-secondary text-center" numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

const openExternalLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
};

export const ProfileSettingsScreen = () => {
  const reminderSettings = useProfileStore((s) => s.reminderSettings);
  const reminderValue = summarizeReminderSettings(reminderSettings);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 px-5 pt-4 pb-6">
          <TabScreenHeader title="Settings" icon={Settings} />
          <ProfileSummaryCard variant="settings" />
        </View>

        <View className="px-5 mt-5 mb-2">
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerClassName="pr-4">
            <QuickAction icon={User} label="Profile" color="#7C3AED" bg="#EDE9FE" onPress={() => router.push('/edit-profile')} />
            <QuickAction icon={Bell} label="Notifications" color="#EF4444" bg="#FEE2E2" onPress={() => router.push(ROUTES.notificationSettings as Href)} />
            <QuickAction icon={Clock} label="Reminders" color="#F59E0B" bg="#FEF3C7" onPress={() => router.push('/reminder-settings')} />
            <QuickAction icon={Download} label="Backup" color="#22C55E" bg="#DCFCE7" onPress={() => router.push('/backup-restore')} />
          </ScrollView>
        </View>

        <View className="px-5 mt-5">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Account & Data</Text>
          <View className="bg-surface rounded-2xl px-4">
            <SettingsRow icon={User} iconBg="#EDE9FE" iconColor="#7C3AED" title="Edit Profile" description="Update name, photo, and personal details" onPress={() => router.push('/edit-profile')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Download} iconBg="#DCFCE7" iconColor="#22C55E" title="Backup & Restore" description="Backup, restore, and import data" onPress={() => router.push('/backup-restore')} />
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Reminders</Text>
          <View className="bg-surface rounded-2xl px-4">
            <SettingsRow icon={Clock} iconBg="#DBEAFE" iconColor="#3B82F6" title="Reminder Settings" description="Manage timing and notification schedules" value={reminderValue} onPress={() => router.push('/reminder-settings')} />
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Help & Legal</Text>
          <View className="bg-surface rounded-2xl px-4">
            <SettingsRow icon={HelpCircle} iconBg="#DBEAFE" iconColor="#3B82F6" title="FAQ" description="Answers to common questions" onPress={() => router.push('/help-faq')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow
              icon={Shield}
              iconBg="#DCFCE7"
              iconColor="#22C55E"
              title="Privacy Policy"
              description="How we handle your data"
              onPress={() => void openExternalLink(EXTERNAL_LINKS.privacyPolicy)}
            />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow
              icon={FileText}
              iconBg="#DBEAFE"
              iconColor="#3B82F6"
              title="Terms & Conditions"
              description="User agreement and app usage terms"
              onPress={() => void openExternalLink(EXTERNAL_LINKS.termsAndConditions)}
            />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Info} iconBg="#EDE9FE" iconColor="#7C3AED" title="About" value="Version 1.0.0" onPress={() => router.push('/about')} />
          </View>
        </View>

        <View className="items-center mt-8 mb-4">
          <Text className="text-[11px] text-foreground-secondary/60">BirthdayBuddy v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
