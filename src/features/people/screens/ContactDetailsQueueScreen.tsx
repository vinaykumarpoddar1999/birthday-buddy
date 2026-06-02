import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { PageSkeleton } from '@shared/ui';

export function ContactDetailsQueueScreen() {
  const { personIds } = useLocalSearchParams<{ personIds?: string }>();
  const ids = (personIds ?? '').split(',').filter(Boolean);

  useEffect(() => {
    if (ids.length === 0) {
      router.back();
      return;
    }

    router.replace({
      pathname: '/add-person',
      params: {
        personId: ids[0],
        queueIds: personIds,
        queueIndex: '0',
      },
    });
  }, [ids, personIds]);

  return <PageSkeleton />;
}
