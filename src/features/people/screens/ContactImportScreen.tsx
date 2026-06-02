import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Contact,
  Download,
  Users,
} from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { peopleQueryKeys } from '@features/people/hooks/usePeople';
import {
  importSelectedContacts,
  listDeviceContacts,
} from '@/services/contacts/contacts-import.service';
import { useContactsStore } from '@/stores/contacts.store';
import { feedback } from '@/shared/feedback';
import { EmptyState, ErrorState, ProfilePlaceholder } from '@shared/ui';

function formatBirthdayLabel(birthDate: string | null): string {
  if (!birthDate) return 'No birthday';
  try {
    return format(parseISO(birthDate), 'MMM d');
  } catch {
    return birthDate;
  }
}

export function ContactImportScreen() {
  const queryClient = useQueryClient();
  const deviceContacts = useContactsStore((s) => s.deviceContacts);
  const importing = useContactsStore((s) => s.importing);
  const setDeviceContacts = useContactsStore((s) => s.setDeviceContacts);
  const toggleContactSelection = useContactsStore((s) => s.toggleContactSelection);
  const selectAll = useContactsStore((s) => s.selectAll);
  const deselectAll = useContactsStore((s) => s.deselectAll);
  const setImporting = useContactsStore((s) => s.setImporting);
  const setImportSessionActive = useContactsStore((s) => s.setImportSessionActive);
  const reset = useContactsStore((s) => s.reset);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setPermissionDenied(false);
    setImportSessionActive(true);

    try {
      const contacts = await listDeviceContacts();
      setDeviceContacts(contacts);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load contacts.';
      if (message.toLowerCase().includes('permission')) {
        setPermissionDenied(true);
      } else {
        setLoadError(message);
      }
      setDeviceContacts([]);
    } finally {
      setLoading(false);
    }
  }, [setDeviceContacts, setImportSessionActive]);

  useEffect(() => {
    void loadContacts();
    return () => reset();
  }, [loadContacts, reset]);

  const selectedCount = useMemo(
    () => deviceContacts.filter((c) => c.selected && c.birthDate).length,
    [deviceContacts],
  );

  const importableCount = useMemo(
    () => deviceContacts.filter((c) => c.birthDate && !c.isDuplicate).length,
    [deviceContacts],
  );

  const duplicateCount = useMemo(
    () => deviceContacts.filter((c) => c.isDuplicate).length,
    [deviceContacts],
  );

  const handleImport = useCallback(
    async (ids: string[]) => {
      if (importing || ids.length === 0) return;
      setImporting(true);
      try {
        const result = await importSelectedContacts(ids);
        await queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all });
        if (result.imported === 0) {
          feedback.warning(
            'No Contacts Imported',
            result.skipped > 0
              ? 'Selected contacts were skipped because they are duplicates or missing birthdays.'
              : 'No contacts were imported.',
          );
        } else {
          feedback.success(
            'Contacts Imported',
            `Added ${result.imported} people${result.skipped > 0 ? ` · ${result.skipped} skipped` : ''}.`,
          );
          router.back();
        }
      } catch (error) {
        feedback.error(
          'Import Failed',
          error instanceof Error ? error.message : 'Could not import contacts.',
        );
      } finally {
        setImporting(false);
      }
    },
    [importing, queryClient, setImporting],
  );

  const handleImportSelected = () => {
    const ids = deviceContacts.filter((c) => c.selected && c.birthDate).map((c) => c.id);
    void handleImport(ids);
  };

  const handleImportAll = () => {
    selectAll();
    const ids = deviceContacts.filter((c) => c.birthDate && !c.isDuplicate).map((c) => c.id);
    void handleImport(ids);
  };

  const openSettings = () => {
    Linking.openSettings().catch(() =>
      feedback.error('Settings Unavailable', 'Open Settings manually to allow contacts access.'),
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <Header onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text className="text-[14px] text-foreground-secondary mt-3">Loading device contacts…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permissionDenied) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <Header onBack={() => router.back()} />
        <View className="flex-1 px-5">
          <EmptyState
            icon={Contact}
            title="Contacts access needed"
            subtitle="Allow Birthday Buddy to read your contacts so you can pick who to import."
            primaryAction={{ label: 'Open Settings', onPress: openSettings }}
            secondaryAction={{ label: 'Try Again', onPress: () => void loadContacts() }}
            className="mt-8 bg-surface border border-border rounded-2xl"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <Header onBack={() => router.back()} />
        <ErrorState kind="unknown" message={loadError} onRetry={() => void loadContacts()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Header onBack={() => router.back()} />

      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">
          Select contacts with birthdays to add to your people list. Duplicates are marked and skipped by default.
        </Text>

        <View className="flex-row gap-2 mb-4">
          <StatPill icon={Users} label={`${importableCount} importable`} />
          <StatPill icon={AlertTriangle} label={`${duplicateCount} duplicates`} tone="warning" />
          <StatPill icon={Check} label={`${selectedCount} selected`} tone="primary" />
        </View>

        <View className="flex-row gap-2 mb-4">
          <Pressable
            className="flex-1 bg-surface border border-border rounded-xl py-2.5 items-center"
            onPress={selectAll}
            accessibilityRole="button"
            accessibilityLabel="Select all importable contacts">
            <Text className="text-[13px] font-bold text-foreground">Select All</Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-surface border border-border rounded-xl py-2.5 items-center"
            onPress={deselectAll}
            accessibilityRole="button"
            accessibilityLabel="Deselect all contacts">
            <Text className="text-[13px] font-bold text-foreground-secondary">Deselect All</Text>
          </Pressable>
        </View>

        {deviceContacts.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No contacts found"
            subtitle="Your address book appears empty, or no contacts have names."
            primaryAction={{ label: 'Refresh', onPress: () => void loadContacts() }}
            className="bg-surface border border-border rounded-2xl"
          />
        ) : (
          <View className="bg-surface rounded-2xl border border-border/60 overflow-hidden">
            {deviceContacts.map((contact, index) => {
              const canSelect = Boolean(contact.birthDate);
              const checked = contact.selected && canSelect;

              return (
                <View key={contact.id}>
                  {index > 0 ? <View className="h-[0.5px] bg-border/60 ml-14" /> : null}
                  <Pressable
                    className={`flex-row items-center px-4 py-3.5 ${!canSelect ? 'opacity-50' : ''}`}
                    onPress={() => canSelect && toggleContactSelection(contact.id)}
                    disabled={!canSelect}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked, disabled: !canSelect }}
                    accessibilityLabel={`${contact.fullName}, ${formatBirthdayLabel(contact.birthDate)}`}>
                    <View
                      className={`h-5 w-5 rounded border mr-3 items-center justify-center ${
                        checked ? 'bg-primary border-primary' : 'border-border'
                      }`}>
                      {checked ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
                    </View>

                    <ProfilePlaceholder size="sm" variant="user" />

                    <View className="flex-1 ml-3 min-w-0">
                      <Text className="text-[15px] font-semibold text-foreground" numberOfLines={1}>
                        {contact.fullName}
                      </Text>
                      <Text className="text-[12px] text-foreground-secondary mt-0.5">
                        {formatBirthdayLabel(contact.birthDate)}
                        {contact.phone ? ` · ${contact.phone}` : ''}
                      </Text>
                    </View>

                    {contact.isDuplicate ? (
                      <View className="bg-warning/10 border border-warning/20 rounded-full px-2.5 py-1">
                        <Text className="text-[10px] font-bold text-warning">Duplicate</Text>
                      </View>
                    ) : null}
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        <Pressable
          className={`rounded-2xl py-4 mt-5 items-center flex-row justify-center gap-2 ${
            selectedCount > 0 && !importing ? 'bg-primary' : 'bg-primary/30'
          }`}
          onPress={handleImportSelected}
          disabled={selectedCount === 0 || importing}
          accessibilityRole="button">
          {importing ? <ActivityIndicator color="#FFFFFF" /> : <Download size={18} color="#FFFFFF" />}
          <Text className="text-[15px] font-bold text-white">
            Import Selected{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </Text>
        </Pressable>

        {importableCount > 0 ? (
          <Pressable
            className="rounded-2xl py-4 mt-3 items-center border border-primary/30 bg-primary/5"
            onPress={handleImportAll}
            disabled={importing}
            accessibilityRole="button">
            <Text className="text-[15px] font-bold text-primary">Import All ({importableCount})</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-row items-center px-5 py-3">
      <Pressable
        onPress={onBack}
        className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <ArrowLeft size={20} color="#111827" />
      </Pressable>
      <Text className="text-title text-foreground font-bold">Import Contacts</Text>
    </View>
  );
}

function StatPill({
  icon: Icon,
  label,
  tone = 'neutral',
}: {
  icon: typeof Users;
  label: string;
  tone?: 'neutral' | 'warning' | 'primary';
}) {
  const toneClass =
    tone === 'warning'
      ? 'bg-warning/10 border-warning/20'
      : tone === 'primary'
        ? 'bg-primary/10 border-primary/20'
        : 'bg-surface border-border/60';

  const textClass =
    tone === 'warning' ? 'text-warning' : tone === 'primary' ? 'text-primary' : 'text-foreground-secondary';

  return (
    <View className={`flex-1 rounded-xl border px-2 py-2 items-center ${toneClass}`}>
      <Icon size={14} color={tone === 'warning' ? '#F59E0B' : tone === 'primary' ? '#7C3AED' : '#6B7280'} />
      <Text className={`text-[10px] font-semibold mt-1 text-center ${textClass}`}>{label}</Text>
    </View>
  );
}
