import { Share } from 'react-native';

import { analytics, ANALYTICS_EVENTS } from '@services/analytics';

export type ShareContentInput = {
  title: string;
  message: string;
  url?: string;
};

export async function shareContent(input: ShareContentInput) {
  const result = await Share.share({
    title: input.title,
    message: input.url ? `${input.message}\n${input.url}` : input.message,
    url: input.url,
  });

  if (result.action === Share.sharedAction) {
    analytics.track(ANALYTICS_EVENTS.CARD_SHARED, { title: input.title });
  }

  return result;
}
