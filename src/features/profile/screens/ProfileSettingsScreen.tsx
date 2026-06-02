import { router } from 'expo-router';
import { ArrowLeft, Bell, ChevronRight, Clock, Cloud, DollarSign, Download, Globe, HelpCircle, Info, Link2, LogOut, MessageSquare, Moon, Monitor, Palette, Share2, Shield, Smartphone, Star, Sun, Trash2, Upload, User, Vibrate, Wand2, type LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Share, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFeedback } from '@/shared/hooks/useFeedback';
import { useAuth } from '@features/auth';

import { ProfileSummaryCard } from '../components/ProfileSummaryCard';
import { useProfileStore } from '../store/profile.store';

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$',
};

type SettingsRowProps = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
};

const SettingsRow = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  value,
  onPress,
  rightElement,
  showChevron = true,
  destructive = false,
}: SettingsRowProps) => (
  <Pressable
    className="flex-row items-center py-3 px-1"
    onPress={onPress}
    disabled={!onPress && !rightElement}
    accessibilityRole="button"
    accessibilityLabel={title}>
    <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 shrink-0" style={{ backgroundColor: iconBg }}>
      <Icon size={18} color={iconColor} />
    </View>
    <View className="flex-1 shrink mr-2 min-w-0">
      <Text className={`text-[15px] font-medium ${destructive ? 'text-error' : 'text-foreground'}`} numberOfLines={1}>
        {title}
      </Text>
      {description ? (
        <Text className="text-[12px] text-foreground-secondary mt-0.5 leading-4" numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </View>
    {rightElement ?? (
      value ? (
        <Text className="text-[13px] text-foreground-secondary mr-1 shrink-0" numberOfLines={1}>
          {value}
        </Text>
      ) : null
    )}
    {showChevron && !rightElement && onPress ? <ChevronRight size={18} color="#9CA3AF" /> : null}
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

export const ProfileSettingsScreen = () => {
  const language = useProfileStore((s) => s.language);
  const currency = useProfileStore((s) => s.currency);
  const theme = useProfileStore((s) => s.theme);
  const hapticFeedback = useProfileStore((s) => s.hapticFeedback);
  const reminderSettings = useProfileStore((s) => s.reminderSettings);
  const setHapticFeedback = useProfileStore((s) => s.setHapticFeedback);
  const updateReminderSettings = useProfileStore((s) => s.updateReminderSettings);

  const { signOut, isAuthenticated, isGuest } = useAuth();
  const { showConfirm } = useFeedback();

  const handleLogout = () => {
    showConfirm({
      title: 'Sign Out',
      message: 'You will continue as a guest. Sign in again anytime to restore your account data.',
      confirmLabel: 'Sign Out',
      onConfirm: () => {
        void signOut().then(() => router.replace('/(tabs)'));
      },
    });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const languageLabel = useMemo(() => {
    const map: Record<string, string> = {
      english: 'English', hindi: 'Hindi', bengali: 'Bengali', spanish: 'Spanish',
      french: 'French', german: 'German', arabic: 'Arabic', japanese: 'Japanese',
    };
    return map[language] || 'English';
  }, [language]);

  const themeIcons = [
    { key: 'light', Icon: Sun },
    { key: 'dark', Icon: Moon },
    { key: 'system', Icon: Monitor },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out BirthdayBuddy - the smartest way to remember birthdays!\n\nhttps://birthdaybuddy.app',
      });
    } catch {
      /* dismissed */
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 px-5 pt-4 pb-6">
          <Text className="text-heading text-foreground font-bold mb-1">Settings</Text>
          <Text className="text-caption text-foreground-secondary mb-5">Customize your experience</Text>

          <ProfileSummaryCard />
        </View>

        <View className="px-5 mt-5 mb-2">
          <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false} contentContainerClassName="pr-4">
            <QuickAction icon={User} label="Profile" color="#7C3AED" bg="#EDE9FE" onPress={() => router.push('/edit-profile')} />
            <QuickAction icon={Bell} label="Notifications" color="#EF4444" bg="#FEE2E2" onPress={() => router.push('/notifications')} />
            <QuickAction icon={Clock} label="Reminders" color="#F59E0B" bg="#FEF3C7" onPress={() => router.push('/reminder-settings')} />
            <QuickAction icon={Cloud} label="Calendar Sync" color="#3B82F6" bg="#DBEAFE" onPress={() => router.push('/calendar-sync')} />
            <QuickAction icon={Download} label="Backup" color="#22C55E" bg="#DCFCE7" onPress={() => router.push('/backup-restore')} />
            <QuickAction icon={Palette} label="Appearance" color="#EC4899" bg="#FCE7F3" onPress={() => router.push('/appearance-settings')} />
          </ScrollView>
        </View>

        <View className="px-5 mt-5">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Account & Data</Text>
          <View className="bg-surface rounded-2xl px-4 border border-border/60">
            <SettingsRow icon={User} iconBg="#EDE9FE" iconColor="#7C3AED" title="Personal Information" description="Update name, email, mobile number" onPress={() => router.push('/personal-info')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Shield} iconBg="#DBEAFE" iconColor="#3B82F6" title="Privacy & Security" description="Manage privacy, PIN, Face ID" onPress={() => router.push('/privacy-security')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Cloud} iconBg="#DCFCE7" iconColor="#22C55E" title="Backup & Restore" description="Backup/restore data" onPress={() => router.push('/backup-restore')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Download} iconBg="#FEF3C7" iconColor="#F59E0B" title="Export Data" description="Export as CSV or JSON" onPress={() => router.push('/export-data')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Upload} iconBg="#CFFAFE" iconColor="#06B6D4" title="Import Data" description="Import JSON backup with preview" onPress={() => router.push('/import-data')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Clock} iconBg="#EDE9FE" iconColor="#7C3AED" title="Activity History" description="View your recent app activity" onPress={() => router.push('/activity-history')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Wand2} iconBg="#FCE7F3" iconColor="#EC4899" title="Wish History" description="Browse generated wishes" onPress={() => router.push('/wish-history')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Palette} iconBg="#EDE9FE" iconColor="#7C3AED" title="Card History" description="Created, shared, and favorite cards" onPress={() => router.push('/card-history')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Link2} iconBg="#F5F3FF" iconColor="#7C3AED" title="Surprise History" description="Interactive experiences you created" onPress={() => router.push('/surprise-history')} />
            {isAuthenticated ? (
              <>
                <View className="h-[0.5px] bg-border/60 ml-12" />
                <SettingsRow icon={LogOut} iconBg="#FEF3C7" iconColor="#F59E0B" title="Sign Out" description="Sign out and continue as guest" onPress={handleLogout} />
                <View className="h-[0.5px] bg-border/60 ml-12" />
                <SettingsRow icon={Trash2} iconBg="#FEE2E2" iconColor="#EF4444" title="Delete Account" description="Permanently delete your account and all data" onPress={() => router.push('/delete-account')} destructive />
              </>
            ) : (
              <>
                <View className="h-[0.5px] bg-border/60 ml-12" />
                <SettingsRow icon={LogOut} iconBg="#EDE9FE" iconColor="#7C3AED" title="Sign In" description="Access your saved profile and data" onPress={() => router.push('/(auth)/login')} />
                <View className="h-[0.5px] bg-border/60 ml-12" />
                <SettingsRow icon={User} iconBg="#DCFCE7" iconColor="#22C55E" title="Create Account" description="Save your profile and sync across sessions" onPress={() => router.push('/(auth)/register')} />
              </>
            )}
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Reminders & Notifications</Text>
          <View className="bg-surface rounded-2xl px-4 border border-border/60">
            <SettingsRow icon={Bell} iconBg="#EDE9FE" iconColor="#7C3AED" title="Notification Preferences" description="Choose what and when to be notified" onPress={() => router.push('/notification-prefs')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Clock} iconBg="#DBEAFE" iconColor="#3B82F6" title="Reminder Settings" value={formatTime(reminderSettings.defaultTime)} onPress={() => router.push('/reminder-settings')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Moon} iconBg="#F3E8FF" iconColor="#8B5CF6" title="Quiet Hours" value={`${formatTime(reminderSettings.quietHoursStart)} – ${formatTime(reminderSettings.quietHoursEnd)}`} onPress={() => router.push('/quiet-hours')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow
              icon={Bell}
              iconBg="#FEF3C7"
              iconColor="#F59E0B"
              title="Birthday Alarm"
              description="Full screen alarm on birthday morning"
              showChevron={false}
              rightElement={
                <Switch
                  value={reminderSettings.birthdayAlarm}
                  onValueChange={(v) => updateReminderSettings({ birthdayAlarm: v })}
                  trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">App & Preferences</Text>
          <View className="bg-surface rounded-2xl px-4 border border-border/60">
            <SettingsRow icon={Globe} iconBg="#DBEAFE" iconColor="#3B82F6" title="Language" value={languageLabel} onPress={() => router.push('/language-select')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={DollarSign} iconBg="#DCFCE7" iconColor="#22C55E" title="Currency" value={`${currency} (${CURRENCY_SYMBOLS[currency]})`} onPress={() => router.push('/currency-select')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow
              icon={Sun}
              iconBg="#FEF3C7"
              iconColor="#F59E0B"
              title="Theme"
              showChevron={false}
              onPress={() => router.push('/appearance-settings')}
              rightElement={
                <View className="flex-row items-center gap-1 shrink-0">
                  {themeIcons.map((t) => (
                    <View
                      key={t.key}
                      className={`h-8 w-8 rounded-lg items-center justify-center ${theme === t.key ? 'bg-primary/15 border border-primary/30' : 'bg-border/30'}`}>
                      <t.Icon size={15} color={theme === t.key ? '#7C3AED' : '#9CA3AF'} />
                    </View>
                  ))}
                </View>
              }
            />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Smartphone} iconBg="#FCE7F3" iconColor="#EC4899" title="App Icon" description="Change your app icon" onPress={() => router.push('/app-icon-select')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow
              icon={Vibrate}
              iconBg="#EDE9FE"
              iconColor="#7C3AED"
              title="Haptic Feedback"
              description="Vibration for interactions"
              showChevron={false}
              rightElement={
                <Switch
                  value={hapticFeedback}
                  onValueChange={setHapticFeedback}
                  trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Support & More</Text>
          <View className="bg-surface rounded-2xl px-4 border border-border/60">
            <SettingsRow icon={HelpCircle} iconBg="#DBEAFE" iconColor="#3B82F6" title="Help & FAQ" description="Get help and find answers" onPress={() => router.push('/help-faq')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={HelpCircle} iconBg="#EDE9FE" iconColor="#7C3AED" title="Help Center" description="Contact support, report issues" onPress={() => router.push('/help-center')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={MessageSquare} iconBg="#DCFCE7" iconColor="#22C55E" title="Send Feedback" description="Share feedback or report bugs" onPress={() => router.push('/send-feedback')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Star} iconBg="#FEF3C7" iconColor="#F59E0B" title="Rate Us" description="If you love the app, please rate us" onPress={() => router.push('/rate-us')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Share2} iconBg="#FCE7F3" iconColor="#EC4899" title="Share BirthdayBuddy" description="Share this app with friends and family" onPress={handleShare} showChevron={false} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Info} iconBg="#EDE9FE" iconColor="#7C3AED" title="About BirthdayBuddy" value="Version 1.0.0" onPress={() => router.push('/about')} />
          </View>
        </View>

        <View className="items-center mt-6 mb-4">
          <Text className="text-[11px] text-foreground-secondary/60">BirthdayBuddy v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
