export const APP_NAME = 'BirthdayBuddy';

export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  cards: 'cards',
  memories: 'memories',
} as const;

export const REMINDER_OFFSETS_DAYS = [7, 3, 1, 0] as const;

export const SUBSCRIPTION_PLANS = {
  free: 'free',
  premium_monthly: 'premium_monthly',
  premium_yearly: 'premium_yearly',
} as const;

export const ANALYTICS_EVENTS = {
  BIRTHDAY_ADDED: 'Birthday Added',
  WISH_GENERATED: 'Wish Generated',
  REMINDER_TRIGGERED: 'Reminder Triggered',
  CARD_SHARED: 'Card Shared',
  PREMIUM_PURCHASED: 'Premium Purchased',
  REFERRAL_SENT: 'Referral Sent',
} as const;
