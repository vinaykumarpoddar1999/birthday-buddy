import { Text, View } from 'react-native';

import type { RelationshipType } from '../types';

const theme: Record<RelationshipType, { bg: string; text: string; label: string }> = {
  friend: { bg: 'bg-sky-50', text: 'text-sky-600', label: 'Friend' },
  family: { bg: 'bg-pink-50', text: 'text-pink-600', label: 'Family' },
  colleague: { bg: 'bg-violet-50', text: 'text-violet-600', label: 'Colleague' },
  partner: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Partner' },
  relative: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Relative' },
};

export function RelationshipBadge({ relationship }: { relationship: RelationshipType }) {
  const t = theme[relationship];
  return (
    <View className={`rounded-full px-2.5 py-1 self-start ${t.bg}`}>
      <Text className={`text-[10px] font-semibold ${t.text}`}>{t.label}</Text>
    </View>
  );
}
