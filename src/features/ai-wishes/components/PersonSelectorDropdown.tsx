import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ChevronDown, Search, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { Person } from '@/types/entities';
import { getAge } from '@features/people/utils/birthday-utils';

type Props = {
  people: Person[];
  selectedPersonId: string | null;
  onSelect: (personId: string) => void;
};

export function PersonSelectorDropdown({ people, selectedPersonId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = people.find((p) => p.id === selectedPersonId) ?? people[0] ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => p.fullName.toLowerCase().includes(q));
  }, [people, query]);

  const handleSelect = (personId: string) => {
    onSelect(personId);
    setOpen(false);
    setQuery('');
  };

  if (!selected) return null;

  return (
    <Animated.View entering={FadeInDown.duration(400)} className="mx-5 my-4">
      <Text className="text-[12px] font-semibold text-foreground-secondary mb-2 ml-1">
        Who is this wish for?
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="bg-surface rounded-2xl px-4 py-3.5 flex-row items-center"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 2,
        }}
        accessibilityRole="button"
        accessibilityLabel="Select person for wish">
        <ProfileAvatar
          size="md"
          profileImage={selected.avatarUri}
          name={selected.fullName}
          gender={selected.gender}
          borderClassName="border border-primary/10"
          label={`${selected.fullName} avatar`}
        />
        <View className="flex-1 ml-3 min-w-0">
          <Text className="text-[16px] font-bold text-foreground" numberOfLines={1}>
            {selected.fullName}
          </Text>
          <Text className="text-[12px] text-foreground-secondary mt-0.5 capitalize">
            {selected.relationship} · {getAge(selected.birthDate)} years
          </Text>
        </View>
        <ChevronDown size={18} color="#9CA3AF" />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-background rounded-t-3xl max-h-[75%]">
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
              <Text className="text-[18px] font-bold text-foreground">Choose a person</Text>
              <Pressable
                onPress={() => setOpen(false)}
                className="h-8 w-8 rounded-full bg-surface items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Close person picker">
                <X size={16} color="#6B7280" />
              </Pressable>
            </View>

            <View className="px-5 mb-3">
              <View className="flex-row items-center bg-surface rounded-xl px-3">
                <Search size={16} color="#9CA3AF" />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search by name..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 py-2.5 px-2 text-[15px] text-foreground"
                  accessibilityLabel="Search people"
                />
              </View>
            </View>

            <ScrollView className="px-5 pb-8" keyboardShouldPersistTaps="handled">
              {filtered.map((person) => {
                const isSelected = person.id === selected.id;
                return (
                  <Pressable
                    key={person.id}
                    onPress={() => handleSelect(person.id)}
                    className={`flex-row items-center py-3 px-2 rounded-xl mb-1 ${isSelected ? 'bg-primary/10' : ''}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${person.fullName}`}>
                    <ProfileAvatar
                      size="sm"
                      profileImage={person.avatarUri}
                      name={person.fullName}
                      gender={person.gender}
                    />
                    <View className="flex-1 ml-3">
                      <Text className="text-[15px] font-semibold text-foreground">{person.fullName}</Text>
                      <Text className="text-[12px] text-foreground-secondary capitalize">
                        {person.relationship}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}
