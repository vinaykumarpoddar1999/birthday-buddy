export type AuthMethod =
  | 'email_password'
  | 'phone_password'
  | 'pin_4'
  | 'pin_6'
  | 'fingerprint'
  | 'face_id'
  | 'biometric'
  | 'device_passcode'
  | 'app_lock'
  | 'combined';

export type AutoLockTimer = 'immediate' | '1' | '5' | '15' | '30' | '60' | 'never';

export type AccountStatus = 'active' | 'locked' | 'pending_deletion' | 'deleted';

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  nickname: string;
  profilePhoto: string | null;
  dateOfBirth: string;
  gender: string;
  country: string;
  timezone: string;
  preferredLanguage: string;
  accountStatus: AccountStatus;
  lastLoginAt: string | null;
};

export type SecurityPreferences = {
  primaryAuthMethod: AuthMethod;
  enabledMethods: AuthMethod[];
  biometricEnabled: boolean;
  faceIdEnabled: boolean;
  fingerprintEnabled: boolean;
  devicePasscodeEnabled: boolean;
  appLockEnabled: boolean;
  pinEnabled: boolean;
  pinLength: 0 | 4 | 6;
  rememberDevice: boolean;
  autoLockTimer: AutoLockTimer;
  lockOnBackground: boolean;
  lockOnRestart: boolean;
  lockAfterInactivity: boolean;
  combinedAuthRequired: boolean;
  combinedAuthMethods: AuthMethod[];
  permissionsGranted: Record<string, boolean>;
  onboardingCompleted: boolean;
  securitySetupCompleted: boolean;
};

export type AuthSession = {
  id: string;
  userId: string;
  deviceId: string;
  authMethod: AuthMethod;
  isActive: boolean;
  lastValidatedAt: string;
  lastActivityAt: string;
  expiresAt: string | null;
};

export type LoginHistoryEntry = {
  id: string;
  userId: string;
  loginAt: string;
  logoutAt: string | null;
  deviceId: string;
  deviceName: string;
  authMethod: AuthMethod;
  success: boolean;
  failureReason: string | null;
};

export type TrustedDevice = {
  id: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  isTrusted: boolean;
  isCurrent: boolean;
  lastSeenAt: string;
  registeredAt: string;
  biometricCapable: boolean;
};

export type SignUpInput = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  password: string;
  /** Optional fields — defaults applied server-side */
  nickname?: string;
  phone?: string;
  gender?: string;
  country?: string;
  timezone?: string;
  preferredLanguage?: string;
  profilePhoto?: string | null;
  confirmPassword?: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
  securityPreferences?: Partial<SecurityPreferences>;
  notificationPreferences?: Record<string, boolean>;
  reminderPreferences?: Record<string, unknown>;
};

export type LoginInput = {
  identifier: string;
  password?: string;
  pin?: string;
  authMethod: AuthMethod;
};

export type RecoveryMethod = 'security_question' | 'backup_pin' | 'recovery_code' | 'biometric';

export type PasswordStrength = {
  score: number;
  label: 'weak' | 'fair' | 'good' | 'strong';
  checks: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
};

export type AuthState =
  | 'unknown'
  | 'unauthenticated'
  | 'guest'
  | 'authenticated'
  | 'locked'
  | 'setup_required'
  | 'session_recovery';

export type SecurityScore = {
  score: number;
  maxScore: number;
  level: 'low' | 'medium' | 'high' | 'excellent';
  recommendations: string[];
};
