import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email format');

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[\d\s+\-()]+$/, 'Invalid phone format');

export const passwordSchema = z
  .string()
  .min(8, 'Minimum 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

export const signUpSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    nickname: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).default('other'),
    country: z.string().min(1, 'Country is required'),
    timezone: z.string().default('UTC'),
    preferredLanguage: z.string().default('english'),
    password: passwordSchema,
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((v) => v, { message: 'You must accept the Terms' }),
    privacyAccepted: z.boolean().refine((v) => v, { message: 'You must accept the Privacy Policy' }),
  })
  .refine((d) => d.email || d.phone, { message: 'Email or phone is required', path: ['email'] })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().optional(),
  pin: z.string().optional(),
});

export const pinSchema = (length: 4 | 6) =>
  z.string().length(length, `PIN must be ${length} digits`).regex(/^\d+$/, 'PIN must be numeric');

export const recoveryCodeSchema = z.string().length(9, 'Recovery code must be 9 digits');

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
