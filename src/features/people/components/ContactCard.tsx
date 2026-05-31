import { Alert, Text, View } from 'react-native';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import { usePeopleStore } from '@store/people.store';
import { ActionIconButton } from './ActionIconButton';
import { RelationshipBadge } from './RelationshipBadge';
import type { Contact } from '../types';

type ContactCardProps = {
  item: Contact;
};

export function ContactCard({ item }: ContactCardProps) {
  const deletePerson = usePeopleStore((s) => s.deletePerson);

  const handleMore = () => {
    Alert.alert(item.name, 'What would you like to do?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Delete Contact', `Remove ${item.name} from your list?`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deletePerson(item.id),
            },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View className="flex-row items-center rounded-2xl bg-surface border border-border/80 px-3 py-2.5 mb-2.5">
      <ProfilePlaceholder
        size="header"
        variant={item.gender === 'female' ? 'female' : 'user'}
        label={item.name}
        className="mr-3"
      />

      <View className="flex-1 pr-2">
        <Text className="text-body text-foreground font-semibold">{item.name}</Text>
        <Text className="text-caption text-foreground-secondary mt-0.5">{item.phone}</Text>
        <View className="mt-1">
          <RelationshipBadge relationship={item.relationship} />
        </View>
      </View>

      <View className="items-end">
        <Text className="text-caption text-primary font-semibold mb-1.5">{item.birthdayLabel}</Text>
        <View className="flex-row items-center gap-1">
          <ActionIconButton action="call" onPress={() => {}} />
          <ActionIconButton action="message" onPress={() => {}} />
          <ActionIconButton action="more" onPress={handleMore} />
        </View>
      </View>
    </View>
  );
}
