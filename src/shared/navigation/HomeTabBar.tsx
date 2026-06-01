import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import {
  Calendar,
  Contact,
  Grid2x2,
  Home,
  Plus,
  Users,
} from 'lucide-react-native';

import { queryClient } from '@/lib/react-query';
import { peopleQueryKeys } from '@features/people/hooks/usePeople';
import { importContactsFromDevice } from '@/services/contacts/contacts-import.service';
import { feedback } from '@/shared/feedback';

const tabs = [
  { name: 'index', label: 'Home', Icon: Home, center: false },
  { name: 'calendar', label: 'Calendar', Icon: Calendar, center: false },
  { name: 'add', label: 'Import', Icon: Contact, center: true },
  { name: 'contacts', label: 'People', Icon: Users, center: false },
  { name: 'profile', label: 'More', Icon: Grid2x2, center: false },
] as const;

type TabBarProps = {
  state: { index: number; routes: { name: string; key: string }[] };
  navigation: { navigate: (name: string) => void };
};

export function HomeTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const [importing, setImporting] = useState(false);

  const handleImportContacts = useCallback(async () => {
    if (importing) return;
    setImporting(true);
    try {
      const result = await importContactsFromDevice();
      await queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all });
      if (result.imported === 0) {
        feedback.warning(
          'No New Contacts',
          result.skipped > 0
            ? 'Contacts without birthdays or already in your list were skipped.'
            : 'No contacts with birthdays were found on this device.',
        );
      } else {
        feedback.success(
          'Contacts Imported',
          `Added ${result.imported} people${result.skipped > 0 ? ` · ${result.skipped} skipped` : ''}.`,
        );
      }
    } catch (error) {
      feedback.error(
        'Import Failed',
        error instanceof Error ? error.message : 'Could not import contacts.',
      );
    } finally {
      setImporting(false);
    }
  }, [importing]);

  return (
    <View
      className="bg-surface border-t border-border/80"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        shadowColor: '#111827',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
      }}>
      <View className="flex-row items-end justify-around px-1 pt-2">
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((r: { name: string }) => r.name === tab.name);
          if (routeIndex < 0) return null;

          const isFocused = state.index === routeIndex;
          const color = isFocused ? '#7C3AED' : '#9CA3AF';

          if (tab.center) {
            return (
              <Pressable
                key={tab.name}
                accessibilityRole="button"
                accessibilityLabel="Import contacts"
                onPress={() => void handleImportContacts()}
                disabled={importing}
                className="items-center -mt-7 px-2">
                <View
                  className="h-[56px] w-[56px] rounded-full bg-teal-500 items-center justify-center border-[5px] border-background"
                  style={{
                    shadowColor: '#14B8A6',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 8,
                  }}>
                  {importing ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Contact size={26} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                </View>
                <Text className="text-[10px] mt-1 font-semibold text-teal-600">Import</Text>
              </Pressable>
            );
          }

          const Icon = tab.Icon;
          const useFilledIcon =
            isFocused && (tab.name === 'index' || tab.name === 'calendar' || tab.name === 'contacts');
          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => navigation.navigate(tab.name)}
              className="items-center py-1 min-w-[60px] min-h-[44px] justify-center">
              <Icon
                size={22}
                color={color}
                strokeWidth={isFocused ? 2.5 : 2}
                fill={useFilledIcon ? color : 'transparent'}
              />
              <Text className="text-[10px] mt-1 font-semibold" style={{ color }}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
