import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  EXPO_PUBLIC_OPENAI_API_KEY: z.string().optional(),
  EXPO_PUBLIC_POSTHOG_API_KEY: z.string().optional(),
  EXPO_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

const raw = {
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
};

const parsed = envSchema.safeParse(raw);

if (!parsed.success) {
  if (__DEV__) {
    console.warn(
      '[env] Missing EXPO_PUBLIC_SUPABASE_* — copy .env.example to .env. Using dev placeholders.',
    );
  } else {
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`,
    );
  }
}

const devFallback: Env = {
  EXPO_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
  EXPO_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
};

export const env: Env = parsed.success ? parsed.data : devFallback;

export const isSupabaseConfigured =
  !env.EXPO_PUBLIC_SUPABASE_URL.includes('your-project') &&
  !env.EXPO_PUBLIC_SUPABASE_ANON_KEY.includes('your-anon-key') &&
  !env.EXPO_PUBLIC_SUPABASE_URL.includes('placeholder');
