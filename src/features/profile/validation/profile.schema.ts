import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
    .or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  bio: z.string().max(500).optional().or(z.literal('')),
  relationshipStatus: z.string().max(50).optional().or(z.literal('')),
  relationship: z.string().max(50).optional().or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
  country: z.string().max(100).optional().or(z.literal('')),
  preferences: z.string().max(300).optional().or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileEditSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(100),
  gender: z.enum(['male', 'female', 'other']),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
    .or(z.literal('')),
});

export type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export const RELATIONSHIP_TYPE_OPTIONS = [
  'Friend',
  'Best Friend',
  'Brother',
  'Sister',
  'Mother',
  'Father',
  'Wife',
  'Husband',
  'Girlfriend',
  'Boyfriend',
  'Colleague',
  'Boss',
  'Client',
  'Teacher',
] as const;

export const TIMEZONE_OPTIONS =
  typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl
    ? (Intl as unknown as { supportedValuesOf: (key: string) => string[] }).supportedValuesOf('timeZone')
    : ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo'];

export const COUNTRY_OPTIONS = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Brazil',
  'Singapore',
  'Other',
];
