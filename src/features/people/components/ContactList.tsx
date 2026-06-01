import { Text, View } from 'react-native';
import { Search } from 'lucide-react-native';

import { EmptyState } from '@shared/ui/EmptyState';

import { ContactCard } from './ContactCard';
import type { Contact } from '../types';

type ContactListProps = {
  contacts: Contact[];
};

export function ContactList({ contacts }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No people found"
        subtitle="Try a different search or category"
      />
    );
  }

  return (
    <View>
      <Text className="text-title font-bold text-foreground mb-4">All Contacts</Text>
      {contacts.map((item) => (
        <ContactCard key={item.id} item={item} />
      ))}
    </View>
  );
}
