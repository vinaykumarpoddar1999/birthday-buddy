import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_OPENAI_API_KEY: z.string().optional(),
  EXPO_PUBLIC_POSTHOG_API_KEY: z.string().optional(),
  EXPO_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

const raw = {
  EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
};

const parsed = envSchema.safeParse(raw);

if (!parsed.success && !__DEV__) {
  console.warn('[env] Optional analytics keys not configured.');
}

export const env: Env = parsed.success
  ? parsed.data
  : {
      EXPO_PUBLIC_OPENAI_API_KEY: undefined,
      EXPO_PUBLIC_POSTHOG_API_KEY: undefined,
      EXPO_PUBLIC_POSTHOG_HOST: undefined,
    };
