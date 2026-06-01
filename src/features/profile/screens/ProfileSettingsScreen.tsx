import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  Clock,
  Cloud,
  Crown,
  DollarSign,
  Download,
  Flame,
  Globe,
  HelpCircle,
  Info,
  MessageSquare,
  Moon,
  Monitor,
  Palette,
  Share2,
  Shield,
  Smartphone,
  Star,
  Sun,
  Trash2,
  User,
  Vibrate,
  type LucideIcon,
} from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Share, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';

const GIRL_AVATAR = require('../../../../assets/images/girl.png');

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£',
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
    className="flex-row items-center py-3.5 px-1"
    onPress={onPress}
    disabled={!onPress && !rightElement}
    accessibilityRole="button"
    accessibilityLabel={title}>
    <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 shrink-0" style={{ backgroundColor: iconBg }}>
      <Icon size={18} color={iconColor} />
    </View>
    <View className="flex-1 shrink mr-2 min-w-0">
      <Text
        className={`text-[15px] font-medium ${destructive ? 'text-error' : 'text-foreground'}`}
        numberOfLines={1}>
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
  <Pressable
    className="items-center mr-3 min-w-[68px]"
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}>
    <View className="h-14 w-14 rounded-2xl items-center justify-center mb-1.5" style={{ backgroundColor: bg }}>
      <Icon size={22} color={color} />
    </View>
    <Text className="text-[11px] font-medium text-foreground-secondary text-center" numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

export const ProfileSettingsScreen = () => {
  const profile = useProfileStore((s) => s.profile);
  const language = useProfileStore((s) => s.language);
  const currency = useProfileStore((s) => s.currency);
  const theme = useProfileStore((s) => s.theme);
  const hapticFeedback = useProfileStore((s) => s.hapticFeedback);
  const reminderSettings = useProfileStore((s) => s.reminderSettings);
  const profileCompletion = useProfileStore((s) => s.profileCompletion);
  const setHapticFeedback = useProfileStore((s) => s.setHapticFeedback);
  const updateReminderSettings = useProfileStore((s) => s.updateReminderSettings);

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const languageLabel = useMemo(() => {
    const map: Record<string, string> = { english: 'English', hindi: 'Hindi', bengali: 'Bengali', spanish: 'Spanish', french: 'French', german: 'German' };
    return map[language] || 'English';
  }, [language]);

  const themeIcons = useMemo(() => {
    const items = [
      { key: 'light', Icon: Sun, label: 'Light' },
      { key: 'dark', Icon: Moon, label: 'Dark' },
      { key: 'system', Icon: Monitor, label: 'System' },
    ];
    return items;
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({ message: 'Check out BirthdayBuddy - the smartest way to remember birthdays!\n\nhttps://birthdaybuddy.app' });
    } catch {
      // share dismissed
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View className="bg-primary/5 px-5 pt-4 pb-6">
          <Text className="text-heading text-foreground font-bold mb-1">Settings</Text>
          <Text className="text-caption text-foreground-secondary mb-5">Customize your experience</Text>

          <View className="bg-surface rounded-2xl p-4 border border-border/60 shadow-card">
            <View className="flex-row items-center">
              <View className="relative">
                <Image source={GIRL_AVATAR} style={{ width: 64, height: 64, borderRadius: 32 }} contentFit="cover" />
                <View className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary items-center justify-center border-2 border-surface">
                  <Camera size={12} color="#FFFFFF" />
                </View>
              </View>
              <View className="flex-1 ml-4 min-w-0">
                <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1">
                  <Text className="text-title text-foreground font-bold shrink" numberOfLines={1}>
                    {profile.fullName}
                  </Text>
                  {profile.isPremium && (
                    <View className="flex-row items-center bg-primary/10 rounded-full px-2 py-0.5 shrink-0 gap-0.5">
                      <Crown size={10} color="#7C3AED" />
                      <Text className="text-[10px] font-bold text-primary">Premium</Text>
                    </View>
                  )}
                </View>
                <Text className="text-caption text-foreground-secondary mt-0.5" numberOfLines={1}>
                  {profile.email}
                </Text>
                <View className="flex-row items-center mt-1.5 gap-3 flex-wrap">
                  <View className="flex-row items-center gap-1">
                    <Flame size={12} color="#F59E0B" />
                    <Text className="text-[11px] font-semibold text-foreground-secondary">{profile.streak} Day Streak</Text>
                  </View>
                  <Pressable onPress={() => router.push('/edit-profile')} accessibilityRole="button">
                    <Text className="text-[11px] font-bold text-primary">View Profile →</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            {/* Profile completion */}
            <View className="mt-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[11px] text-foreground-secondary">Profile completion</Text>
                <Text className="text-[11px] font-bold text-primary">{profileCompletion}%</Text>
              </View>
              <View className="h-1.5 bg-border/40 rounded-full overflow-hidden">
                <View className="h-full bg-primary rounded-full" style={{ width: `${profileCompletion}%` }} />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mt-5 mb-2">
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="pr-4">
            <QuickAction icon={User} label="Profile" color="#7C3AED" bg="#EDE9FE" onPress={() => router.push('/edit-profile')} />
            <QuickAction icon={Bell} label="Notifications" color="#EF4444" bg="#FEE2E2" onPress={() => router.push('/notifications')} />
            <QuickAction icon={Clock} label="Reminders" color="#F59E0B" bg="#FEF3C7" onPress={() => router.push('/reminder-time')} />
            <QuickAction icon={Calendar} label="Calendar Sync" color="#3B82F6" bg="#DBEAFE" onPress={() => router.push('/(tabs)/calendar')} />
            <QuickAction icon={Cloud} label="Backup" color="#22C55E" bg="#DCFCE7" onPress={() => router.push('/backup-restore')} />
            <QuickAction icon={Palette} label="Appearance" color="#EC4899" bg="#FCE7F3" onPress={() => router.push('/theme-select')} />
          </ScrollView>
        </View>

        {/* ACCOUNT & DATA */}
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
            <SettingsRow icon={Trash2} iconBg="#FEE2E2" iconColor="#EF4444" title="Delete Account" description="Permanently delete your account and all data" onPress={() => router.push('/delete-account')} destructive />
          </View>
        </View>

        {/* REMINDERS & NOTIFICATIONS */}
        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Reminders & Notifications</Text>
          <View className="bg-surface rounded-2xl px-4 border border-border/60">
            <SettingsRow icon={Bell} iconBg="#EDE9FE" iconColor="#7C3AED" title="Notification Preferences" description="Choose what and when to be notified" onPress={() => router.push('/notification-prefs')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Clock} iconBg="#DBEAFE" iconColor="#3B82F6" title="Reminder Time" value={formatTime(reminderSettings.defaultTime)} onPress={() => router.push('/reminder-time')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Moon} iconBg="#F3E8FF" iconColor="#8B5CF6" title="Quiet Hours" value={`${formatTime(reminderSettings.quietHoursStart)} – ${formatTime(reminderSettings.quietHoursEnd)}`} onPress={() => router.push('/quiet-hours')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow
              icon={Bell} iconBg="#FEF3C7" iconColor="#F59E0B" title="Birthday Alarm"
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

        {/* APP & PREFERENCES */}
        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">App & Preferences</Text>
          <View className="bg-surface rounded-2xl px-4 border border-border/60">
            <SettingsRow icon={Globe} iconBg="#DBEAFE" iconColor="#3B82F6" title="Language" value={languageLabel} onPress={() => router.push('/language-select')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={DollarSign} iconBg="#DCFCE7" iconColor="#22C55E" title="Currency" value={`${currency} (${CURRENCY_SYMBOLS[currency]})`} onPress={() => router.push('/currency-select')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow
              icon={Sun} iconBg="#FEF3C7" iconColor="#F59E0B" title="Theme"
              showChevron={false}
              onPress={() => router.push('/theme-select')}
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
              icon={Vibrate} iconBg="#EDE9FE" iconColor="#7C3AED" title="Haptic Feedback"
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

        {/* SUPPORT & MORE */}
        <View className="px-5 mt-6">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-1">Support & More</Text>
          <View className="bg-surface rounded-2xl px-4 border border-border/60">
            <SettingsRow icon={HelpCircle} iconBg="#DBEAFE" iconColor="#3B82F6" title="Help & FAQ" description="Get help and find answers" onPress={() => router.push('/help-faq')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={MessageSquare} iconBg="#DCFCE7" iconColor="#22C55E" title="Send Feedback" description="Share feedback or report bugs" onPress={() => router.push('/send-feedback')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Star} iconBg="#FEF3C7" iconColor="#F59E0B" title="Rate Us" description="If you love the app, please rate us" onPress={() => router.push('/rate-us')} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Share2} iconBg="#FCE7F3" iconColor="#EC4899" title="Share WishDay" description="Share this app with friends and family" onPress={handleShare} showChevron={false} />
            <View className="h-[0.5px] bg-border/60 ml-12" />
            <SettingsRow icon={Info} iconBg="#EDE9FE" iconColor="#7C3AED" title="About BirthdayBuddy" value="Version 1.0.0" onPress={() => router.push('/about')} />
          </View>
        </View>

        {/* Version */}
        <View className="items-center mt-6 mb-4">
          <Text className="text-[11px] text-foreground-secondary/60">BirthdayBuddy v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
