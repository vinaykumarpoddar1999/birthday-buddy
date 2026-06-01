import { Alert, Linking, Pressable, Text, View } from 'react-native';
import { Ellipsis, MessageCircle, Phone } from 'lucide-react-native';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import { usePeopleStore } from '@store/people.store';
import { RelationshipBadge } from './RelationshipBadge';
import type { Contact } from '../types';

type ContactCardProps = {
  item: Contact;
};

export function ContactCard({ item }: ContactCardProps) {
  const deletePerson = usePeopleStore((s) => s.deletePerson);

  const handleCall = () => {
    if (item.phone) {
      Linking.openURL(`tel:${item.phone.replace(/\s/g, '')}`).catch(() =>
        Alert.alert('Cannot call', 'Phone call not supported on this device.'),
      );
    } else {
      Alert.alert('No phone number', `${item.name} doesn't have a phone number.`);
    }
  };

  const handleMessage = () => {
    if (item.phone) {
      Linking.openURL(`sms:${item.phone.replace(/\s/g, '')}`).catch(() =>
        Alert.alert('Cannot message', 'SMS not supported on this device.'),
      );
    } else {
      Alert.alert('No phone number', `${item.name} doesn't have a phone number.`);
    }
  };

  const handleMore = () => {
    Alert.alert(item.name, 'What would you like to do?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Delete Contact', `Remove ${item.name}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deletePerson(item.id) },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View className="bg-surface rounded-2xl border border-border px-4 py-3.5 mb-3 shadow-sm">
      <View className="flex-row items-center gap-3">
        <ProfilePlaceholder
          size="header"
          variant={item.gender === 'female' ? 'female' : 'user'}
          label={item.name}
        />

        <View className="flex-1 min-w-0 mr-2">
          <Text className="text-[15px] text-foreground font-semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-caption text-foreground-muted mt-1" numberOfLines={1}>
            {item.birthdayLabel} · Age {item.age}
          </Text>
          <View className="mt-2">
            <RelationshipBadge relationship={item.relationship} />
          </View>
        </View>

        <View className="flex-row gap-2 shrink-0">
          <Pressable
            onPress={handleCall}
            className="h-9 w-9 rounded-xl bg-green-50 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Call">
            <Phone size={14} color="#22C55E" />
          </Pressable>
          <Pressable
            onPress={handleMessage}
            className="h-9 w-9 rounded-xl bg-blue-50 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Message">
            <MessageCircle size={14} color="#3B82F6" />
          </Pressable>
          <Pressable
            onPress={handleMore}
            className="h-9 w-9 rounded-xl bg-gray-50 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="More options">
            <Ellipsis size={14} color="#6B7280" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
