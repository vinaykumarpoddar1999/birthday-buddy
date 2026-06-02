import { router } from 'expo-router';
import { Apple, ArrowLeft, Calendar, Mail, Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deviceCalendarService } from '@/services/calendar/device-calendar.service';
import { profileService } from '@/services/profile/profile.service';
import { useFeedback } from '@/shared/hooks/useFeedback';

import { useProfileStore } from '../store/profile.store';
import type { CalendarSyncSettings } from '../types';

type ProviderKey = keyof CalendarSyncSettings;

const PROVIDERS: { key: ProviderKey; title: string; desc: string; icon: typeof Calendar; color: string; bg: string }[] = [
  { key: 'google', title: 'Google Calendar', desc: 'Writes to your phone calendar app', icon: Calendar, color: '#4285F4', bg: '#DBEAFE' },
  { key: 'apple', title: 'Apple Calendar', desc: 'Writes to your phone calendar app', icon: Apple, color: '#111827', bg: '#F3F4F6' },
  { key: 'outlook', title: 'Outlook Calendar', desc: 'Writes to your phone calendar app', icon: Mail, color: '#0078D4', bg: '#DBEAFE' },
];

export const CalendarSyncScreen = () => {
  const calendarSync = useProfileStore((s) => s.calendarSync);
  const updateCalendarSync = useProfileStore((s) => s.updateCalendarSync);
  const { toast, showError, showPermission } = useFeedback();
  const [syncingDevice, setSyncingDevice] = useState(false);
  const [syncingProvider, setSyncingProvider] = useState<ProviderKey | null>(null);

  const showPermissionError = () => {
    showPermission(
      'Permission Required',
      'Allow calendar access in your device settings to sync birthdays.',
      () => void Linking.openSettings(),
    );
  };

  const runDeviceSync = async (): Promise<boolean> => {
    const granted = await deviceCalendarService.requestPermissions();
    if (!granted) {
      showPermissionError();
      return false;
    }

    const result = await deviceCalendarService.syncAllBirthdays({ force: true });
    if (result.error === 'permission_denied') {
      showPermissionError();
      return false;
    }
    if (result.error === 'no_birthdays') {
      showError('No Birthdays', 'Add people with birthdays before syncing to your calendar.');
      return false;
    }
    if (result.error === 'no_calendar') {
      showError('Unavailable', 'Calendar sync is not available on this platform.');
      return false;
    }
    if (result.synced === 0) {
      if (result.skipped > 0 && result.failed === 0) {
        showError(
          'No Valid Birthdays',
          `${result.skipped} contact(s) skipped because they have no valid birthday date.`,
        );
      } else {
        showError(
          'Sync Failed',
          'Could not write birthdays to your calendar. Check permissions and try again.',
        );
      }
      return false;
    }

    const skippedNote =
      result.skipped > 0 ? ` (${result.skipped} skipped — no valid birthday)` : '';
    toast(
      `Synced ${result.synced} birthday${result.synced === 1 ? '' : 's'} to BirthdayBuddy calendar${skippedNote}`,
      'success',
    );
    return true;
  };

  const persistAndSync = async (nextSync: CalendarSyncSettings): Promise<boolean> => {
    await profileService.saveCalendarSync(nextSync);
    updateCalendarSync(nextSync);
    return runDeviceSync();
  };

  const toggleProvider = (key: ProviderKey, enabled: boolean) => {
    const nextSync: CalendarSyncSettings = {
      ...calendarSync,
      [key]: {
        ...calendarSync[key],
        enabled,
      },
    };
    updateCalendarSync({ [key]: nextSync[key] });

    if (enabled) {
      setSyncingProvider(key);
      void persistAndSync(nextSync)
        .then((ok) => {
          if (ok) {
            updateCalendarSync({
              [key]: {
                ...calendarSync[key],
                enabled: true,
                lastSyncAt: new Date().toISOString(),
              },
            });
          } else {
            updateCalendarSync({
              [key]: {
                ...calendarSync[key],
                enabled: false,
              },
            });
          }
        })
        .finally(() => setSyncingProvider(null));
    } else {
      void profileService.saveCalendarSync(nextSync);
      toast(`${PROVIDERS.find((p) => p.key === key)?.title} disabled`, 'success');
    }
  };

  const handleDeviceSync = async () => {
    if (syncingDevice) return;
    setSyncingDevice(true);
    try {
      const now = new Date().toISOString();
      const enabledSync: CalendarSyncSettings = {
        google: { enabled: true, lastSyncAt: now },
        apple: { enabled: true, lastSyncAt: now },
        outlook: { enabled: true, lastSyncAt: now },
      };
      const ok = await persistAndSync(enabledSync);
      if (ok) {
        updateCalendarSync(enabledSync);
      }
    } catch (error) {
      showError('Sync Failed', error instanceof Error ? error.message : 'Could not sync to device calendar.');
    } finally {
      setSyncingDevice(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Calendar Sync</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">
          Sync birthdays to a dedicated BirthdayBuddy calendar on your device. Toggles below enable automatic sync when you add or edit people.
        </Text>

        <Pressable
          className="bg-primary rounded-2xl py-4 mb-4 flex-row items-center justify-center gap-2"
          onPress={() => void handleDeviceSync()}
          disabled={syncingDevice}
          accessibilityRole="button">
          {syncingDevice ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Smartphone size={18} color="#FFFFFF" />
          )}
          <Text className="text-[15px] font-bold text-white">Sync to Device Calendar</Text>
        </Pressable>

        <Text className="text-[12px] font-semibold text-foreground-secondary uppercase tracking-wide mb-2">
          Device Calendar
        </Text>

        <View className="bg-surface rounded-2xl px-4 border border-border/60">
          {PROVIDERS.map((item, i) => (
            <View key={item.key}>
              {i > 0 && <View className="h-[0.5px] bg-border/60 ml-12" />}
              <View className="flex-row items-center py-3.5">
                <View className="h-9 w-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: item.bg }}>
                  <item.icon size={18} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-medium text-foreground">{item.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5">{item.desc}</Text>
                  {calendarSync[item.key].lastSyncAt && calendarSync[item.key].enabled && (
                    <Text className="text-[10px] text-primary mt-0.5">
                      Last sync: {new Date(calendarSync[item.key].lastSyncAt!).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                {syncingProvider === item.key ? (
                  <ActivityIndicator color="#7C3AED" />
                ) : (
                  <Switch
                    value={calendarSync[item.key].enabled}
                    onValueChange={(v) => toggleProvider(item.key, v)}
                    trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                    thumbColor="#FFFFFF"
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
