import { Text, View } from 'react-native';
import { UsersRound } from 'lucide-react-native';

import { ContactCard } from './ContactCard';
import type { Contact } from '../types';

type ContactListProps = {
  contacts: Contact[];
};

export function ContactList({ contacts }: ContactListProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center">
          <Text className="text-title text-foreground font-bold mr-1.5">All Contacts</Text>
          <UsersRound size={14} color="#7C3AED" />
        </View>
        <Text className="text-caption text-primary font-semibold">A - Z</Text>
      </View>

      {contacts.map((item) => (
        <ContactCard key={item.id} item={item} />
      ))}
    </View>
  );
}
