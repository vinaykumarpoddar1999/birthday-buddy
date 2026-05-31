import { Text, View } from 'react-native';

import type { RelationshipType } from '../types';

type RelationshipBadgeProps = {
  relationship: RelationshipType;
};

const relationshipTheme: Record<RelationshipType, { bg: string; text: string; label: string }> = {
  friend: { bg: 'bg-sky-100', text: 'text-sky-600', label: 'Friend' },
  family: { bg: 'bg-pink-100', text: 'text-pink-600', label: 'Family' },
  colleague: { bg: 'bg-violet-100', text: 'text-violet-600', label: 'Colleague' },
  partner: { bg: 'bg-rose-100', text: 'text-rose-600', label: 'Partner' },
  relative: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Relative' },
};

export function RelationshipBadge({ relationship }: RelationshipBadgeProps) {
  const theme = relationshipTheme[relationship];

  return (
    <View className={`rounded-full px-2 py-1 ${theme.bg}`}>
      <Text className={`text-[10px] font-semibold ${theme.text}`}>{theme.label}</Text>
    </View>
  );
}
