import { View } from 'react-native';

import { ListSkeleton } from '@shared/ui';

/** Skeleton for Surprise History list while experiences load. */
export function StudioHistorySkeleton() {
  return (
    <View className="px-5 pt-2">
      <ListSkeleton rows={4} />
    </View>
  );
}
