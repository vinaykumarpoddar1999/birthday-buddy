import { router } from 'expo-router';
import { Ellipsis, MessageCircle, Phone } from 'lucide-react-native';
import { Linking, Pressable, Text, View } from 'react-native';

import { feedback } from '@/shared/feedback';
import { usePersonMutations } from '@features/people/hooks/usePeople';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { Contact } from '../types';
import { RelationshipBadge } from './RelationshipBadge';

type ContactCardProps = {
  item: Contact;
};

export function ContactCard({ item }: ContactCardProps) {
  const { deletePerson } = usePersonMutations();

  const handleCall = () => {
    if (item.phone) {
      Linking.openURL(`tel:${item.phone.replace(/\s/g, '')}`).catch(() =>
        feedback.error('Cannot call', 'Phone call not supported on this device.'),
      );
    } else {
      feedback.error('No phone number', `${item.name} doesn't have a phone number.`);
    }
  };

  const handleMessage = () => {
    if (item.phone) {
      Linking.openURL(`sms:${item.phone.replace(/\s/g, '')}`).catch(() =>
        feedback.error('Cannot message', 'SMS not supported on this device.'),
      );
    } else {
      feedback.error('No phone number', `${item.name} doesn't have a phone number.`);
    }
  };

  const handleMore = () => {
    feedback.actionSheet({
      title: item.name,
      options: [
        {
          label: 'View Details',
          onPress: () => router.push({ pathname: '/person-details', params: { personId: item.id } }),
        },
        {
          label: 'Edit',
          onPress: () => router.push({ pathname: '/add-person', params: { personId: item.id } }),
        },
        {
          label: 'Generate Wish',
          onPress: () => router.push({ pathname: '/ai-wish', params: { personId: item.id } }),
        },
        {
          label: 'Create Card',
          onPress: () => router.push({ pathname: '/card-studio', params: { personId: item.id } }),
        },
        {
          label: 'Delete',
          destructive: true,
          onPress: () =>
            feedback.deleteConfirm({
              title: 'Delete Contact',
              message: `Remove ${item.name}?`,
              onConfirm: () => deletePerson(item.id),
            }),
        },
      ],
    });
  };

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/person-details', params: { personId: item.id } })}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name} details`}>
      <View className="bg-surface rounded-2xl border border-border px-4 py-3.5 mb-3 shadow-sm">
        <View className="flex-row items-center gap-3">
          <ProfileAvatar
            size="sm"
            profileImage={item.avatarUri}
            name={item.name}
            gender={item.gender}
            label={`${item.name} avatar`}
          />
          <View className="flex-1 min-w-0">
            <Text className="text-[15px] font-semibold text-foreground" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center gap-2 mt-0.5">
              <RelationshipBadge relationship={item.relationship} />
              <Text className="text-[11px] text-foreground-secondary">{item.birthdayLabel}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                handleCall();
              }}
              className="h-9 w-9 rounded-full bg-primary/10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Call">
              <Phone size={16} color="#7C3AED" />
            </Pressable>
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                handleMessage();
              }}
              className="h-9 w-9 rounded-full bg-primary/10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Message">
              <MessageCircle size={16} color="#7C3AED" />
            </Pressable>
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                handleMore();
              }}
              className="h-9 w-9 rounded-full bg-border/30 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="More options">
              <Ellipsis size={16} color="#6B7280" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
