import { ANALYTICS_EVENTS } from '@/constants/app';
import { env } from '@config/env';

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

type EventProperties = Record<string, string | number | boolean | undefined>;

class AnalyticsService {
  private enabled = true;

  identify(userId: string, traits?: EventProperties): void {
    if (!this.enabled) return;
    // PostHog / Firebase: wire provider here
    if (__DEV__) {
      console.log('[Analytics] identify', userId, traits);
    }
  }

  track(event: AnalyticsEvent | string, properties?: EventProperties): void {
    if (!this.enabled) return;
    if (__DEV__) {
      console.log('[Analytics] track', event, properties, {
        posthog: Boolean(env.EXPO_PUBLIC_POSTHOG_API_KEY),
      });
    }
  }

  screen(name: string, properties?: EventProperties): void {
    if (!this.enabled) return;
    if (__DEV__) {
      console.log('[Analytics] screen', name, properties);
    }
  }

  reset(): void {
    if (__DEV__) {
      console.log('[Analytics] reset');
    }
  }
}

export const analytics = new AnalyticsService();

export { ANALYTICS_EVENTS };
