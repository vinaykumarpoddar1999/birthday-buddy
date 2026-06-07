import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { ArrowLeft, Contact, Search } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { EmptyState, ErrorState } from '@shared/ui';
import { ContactLoadingView } from '@/shared/ui/loaders/ContactLoadingView';
import { listDeviceContacts, preparePickedContact } from '@/services/contacts/contacts-import.service';
import { openContactDetailsFlow } from '@/shared/navigation/quick-add-actions';
import type { DeviceContactPreview } from '@/stores/contacts.store';

function formatBirthdayLabel(birthDate: string | null): string {
  if (!birthDate) return 'Birthday not set';
  try {
    return format(parseISO(birthDate), 'MMM d');
  } catch {
    return birthDate;
  }
}

export function ContactPickerScreen() {
  const [contacts, setContacts] = useState<DeviceContactPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setPermissionDenied(false);
    try {
      const list = await listDeviceContacts();
      setContacts(list);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load contacts.';
      if (message.toLowerCase().includes('permission')) {
        setPermissionDenied(true);
      } else {
        setLoadError(message);
      }
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        (c.phone?.toLowerCase().includes(q) ?? false),
    );
  }, [contacts, searchText]);

  const handleSelect = useCallback(async (contact: DeviceContactPreview) => {
    setSelectingId(contact.id);
    try {
      const picked = await preparePickedContact(contact);
      await openContactDetailsFlow(picked);
    } finally {
      setSelectingId(null);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pt-2 pb-3 flex-row items-center border-b border-border/60">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full items-center justify-center bg-surface border border-border/80 mr-3"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#7C3AED" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[18px] font-bold text-foreground">Select Contact</Text>
          <Text className="text-[12px] text-foreground-secondary mt-0.5">
            Tap a contact to add their details
          </Text>
        </View>
      </View>

      <View className="px-5 py-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 py-2.5">
          <Search size={16} color="#9CA3AF" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search contacts..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-[14px] text-foreground"
            accessibilityLabel="Search contacts"
          />
        </View>
      </View>

      {loading ? (
        <ContactLoadingView />
      ) : permissionDenied ? (
        <EmptyState
          icon={Contact}
          title="Contacts access needed"
          subtitle="Allow contacts permission to pick someone from your phone."
          primaryAction={{
            label: 'Open Settings',
            onPress: () => void Linking.openSettings(),
          }}
          secondaryAction={{ label: 'Try Again', onPress: () => void loadContacts() }}
          className="mx-5"
        />
      ) : loadError ? (
        <ErrorState kind="unknown" message={loadError} onRetry={() => void loadContacts()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Contact}
          title="No contacts found"
          subtitle="Try a different search or add a person manually."
          primaryAction={{ label: 'Add Manually', onPress: () => router.replace('/add-person') }}
          className="mx-5"
        />
      ) : (
        <FlatList
          className="flex-1 px-5"
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerClassName="pb-8"
          initialNumToRender={20}
          maxToRenderPerBatch={25}
          windowSize={10}
          renderItem={({ item: contact }) => (
            <Pressable
              onPress={() => void handleSelect(contact)}
              disabled={selectingId !== null}
              className="flex-row items-center bg-surface border border-border/60 rounded-xl p-3 mb-2 active:bg-primary/5"
              accessibilityRole="button"
              accessibilityLabel={`Select ${contact.fullName}`}>
              <ProfileAvatar
                size="md"
                profileImage={contact.avatarUri}
                name={contact.fullName}
                borderClassName="border border-primary/15 mr-3"
                label={`${contact.fullName} avatar`}
              />
              <View className="flex-1 min-w-0">
                <Text className="text-[15px] font-semibold text-foreground" numberOfLines={1}>
                  {contact.fullName}
                </Text>
                <Text className="text-[12px] text-foreground-secondary mt-0.5" numberOfLines={1}>
                  {contact.phone ?? 'No phone'} · {formatBirthdayLabel(contact.birthDate)}
                </Text>
              </View>
              {selectingId === contact.id ? (
                <ActivityIndicator size="small" color="#7C3AED" />
              ) : null}
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
