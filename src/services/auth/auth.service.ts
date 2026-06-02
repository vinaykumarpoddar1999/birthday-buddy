import type {
  AuthMethod,
  AuthUser,
  LoginInput,
  PasswordStrength,
  SecurityPreferences,
  SecurityScore,
  SignUpInput,
} from '@features/auth/types/auth.types';
import { userRepository } from '@/repositories/user.repository';
import { sessionRepository } from '@/repositories/session.repository';
import { userSecurityRepository } from '@/repositories/user-security.repository';
import {
  DEFAULT_SECURITY_PREFERENCES,
  securityPreferencesRepository,
} from '@/repositories/security-preferences.repository';
import { loginHistoryRepository } from '@/repositories/login-history.repository';
import { deviceRegistryRepository } from '@/repositories/device-registry.repository';
import { cryptoService } from './crypto.service';
import { sessionService } from './session.service';
import { biometricService } from './biometric.service';
import { secureAuthStorage } from './secure-auth-storage';
import { profileService, DEFAULT_USER_PROFILE } from '@/services/profile/profile.service';

export class AuthError extends Error {
  constructor(
    message: string,
    public code:
      | 'INVALID_CREDENTIALS'
      | 'ACCOUNT_LOCKED'
      | 'DUPLICATE_ACCOUNT'
      | 'VALIDATION_ERROR'
      | 'NOT_FOUND'
      | 'BIOMETRIC_FAILED'
      | 'NO_ACCOUNT',
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

const MIN_AGE = 13;

export class AuthService {
  evaluatePasswordStrength(password: string): PasswordStrength {
    const checks = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passed / 5) * 100);
    let label: PasswordStrength['label'] = 'weak';
    if (score >= 100) label = 'strong';
    else if (score >= 80) label = 'good';
    else if (score >= 60) label = 'fair';
    return { score, label, checks };
  }

  validateSignUp(input: SignUpInput): void {
    if (!input.fullName.trim()) throw new AuthError('Full name is required', 'VALIDATION_ERROR');
    if (!input.email.trim()) {
      throw new AuthError('Email is required', 'VALIDATION_ERROR');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new AuthError('Invalid email format', 'VALIDATION_ERROR');
    }
    if (!input.dateOfBirth.trim()) {
      throw new AuthError('Date of birth is required', 'VALIDATION_ERROR');
    }
    if (input.password.length < 8) {
      throw new AuthError('Password must be at least 8 characters', 'VALIDATION_ERROR');
    }
    const confirmPassword = input.confirmPassword ?? input.password;
    if (input.password !== confirmPassword) {
      throw new AuthError('Passwords do not match', 'VALIDATION_ERROR');
    }
    const age = this.calculateAge(input.dateOfBirth);
    if (age < MIN_AGE) throw new AuthError(`You must be at least ${MIN_AGE} years old`, 'VALIDATION_ERROR');
  }

  private calculateAge(dob: string): number {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  async hasAccount(): Promise<boolean> {
    return userRepository.hasAnyUser();
  }

  async signUp(input: SignUpInput): Promise<{ user: AuthUser; recoveryCode: string }> {
    this.validateSignUp(input);

    if (input.email) {
      const existing = await userRepository.findByEmail(input.email);
      if (existing) throw new AuthError('An account with this email already exists', 'DUPLICATE_ACCOUNT');
    }
    if (input.phone) {
      const existing = await userRepository.findByPhone(input.phone);
      if (existing) throw new AuthError('An account with this phone number already exists', 'DUPLICATE_ACCOUNT');
    }

    const now = new Date().toISOString();
    const user = await userRepository.create({
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
      fullName: input.fullName.trim(),
      nickname: input.nickname?.trim() || input.fullName.trim(),
      profilePhoto: input.profilePhoto ?? null,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender ?? 'other',
      country: input.country ?? '',
      timezone: input.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      preferredLanguage: input.preferredLanguage ?? 'english',
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
    });

    const passwordSalt = await cryptoService.generateSalt();
    const passwordHash = await cryptoService.hashSecret(input.password, passwordSalt);
    await userSecurityRepository.create(user.id, passwordHash, passwordSalt);

    const recoveryCode = await cryptoService.generateRecoveryCode();
    const recoverySalt = await cryptoService.generateSalt();
    const recoveryHash = await cryptoService.hashSecret(recoveryCode, recoverySalt);
    await userSecurityRepository.setRecoveryData(user.id, {
      recoveryCodeHash: recoveryHash,
      recoveryCodeSalt: recoverySalt,
    });

    const prefs: Partial<SecurityPreferences> = {
      biometricEnabled: false,
      appLockEnabled: false,
      pinEnabled: false,
      pinLength: 0,
      lockOnBackground: false,
      lockOnRestart: false,
      securitySetupCompleted: true,
      onboardingCompleted: true,
      ...input.securityPreferences,
    };
    await securityPreferencesRepository.create(user.id, prefs);

    await profileService.saveBundle({
      profile: {
        ...DEFAULT_USER_PROFILE,
        fullName: user.fullName,
        email: user.email ?? '',
        phone: user.phone ?? '',
        birthday: user.dateOfBirth,
        gender: (user.gender as 'male' | 'female' | 'other') ?? 'other',
        location: user.country,
        profileImage: user.profilePhoto,
        preferences: input.nickname ?? user.nickname,
        joinedAt: now,
      },
      language: (user.preferredLanguage as 'english') ?? 'english',
    });

    const authMethod: AuthMethod = input.email ? 'email_password' : 'phone_password';
    await this.completeLogin(user, authMethod);

    return { user, recoveryCode };
  }

  async login(input: LoginInput): Promise<AuthUser> {
    const user = await this.resolveUser(input.identifier);
    if (!user) throw new AuthError('Account not found', 'NOT_FOUND');

    const lockStatus = await userSecurityRepository.isLocked(user.id);
    if (lockStatus.locked) {
      throw new AuthError('Account temporarily locked. Try again later.', 'ACCOUNT_LOCKED');
    }

    const security = await userSecurityRepository.findByUserUuid(user.id);
    if (!security) throw new AuthError('Security configuration not found', 'NOT_FOUND');

    const prefs = await securityPreferencesRepository.findByUserUuid(user.id, security.pinLength ?? 0);

    let authenticated = false;

    if (prefs?.combinedAuthRequired && prefs.combinedAuthMethods.length >= 2) {
      authenticated = await this.verifyCombinedAuth(user.id, security, input, prefs.combinedAuthMethods);
      if (!authenticated) {
        const attempts = await userSecurityRepository.incrementFailedAttempts(user.id);
        const deviceInfo = biometricService.getDeviceInfo();
        await loginHistoryRepository.record({
          userUuid: user.id,
          deviceName: deviceInfo.deviceName,
          authMethod: 'combined',
          success: false,
          failureReason: 'Combined auth failed',
        });
        const delayMs = Math.min(attempts * 500, 5000);
        await new Promise((r) => setTimeout(r, delayMs));
        throw new AuthError('Additional verification required', 'INVALID_CREDENTIALS');
      }
      await userSecurityRepository.resetFailedAttempts(user.id);
      return this.completeLogin(user, 'combined');
    }

    switch (input.authMethod) {
      case 'email_password':
      case 'phone_password':
        if (!input.password) throw new AuthError('Password is required', 'VALIDATION_ERROR');
        if (!security.passwordHash || !security.passwordSalt) {
          throw new AuthError('Password not configured', 'VALIDATION_ERROR');
        }
        authenticated = await cryptoService.verifySecret(
          input.password,
          security.passwordSalt,
          security.passwordHash,
        );
        break;

      case 'pin_4':
      case 'pin_6':
        if (!input.pin) throw new AuthError('PIN is required', 'VALIDATION_ERROR');
        if (!security.pinHash || !security.pinSalt) {
          throw new AuthError('PIN not configured', 'VALIDATION_ERROR');
        }
        authenticated = await cryptoService.verifyPin(input.pin, security.pinSalt, security.pinHash);
        break;

      case 'fingerprint':
      case 'face_id':
      case 'biometric':
      case 'device_passcode': {
        const result = await biometricService.authenticate('Unlock BirthdayBuddy');
        authenticated = result.success;
        if (!result.success) throw new AuthError(result.error ?? 'Biometric authentication failed', 'BIOMETRIC_FAILED');
        break;
      }

      default:
        if (input.password && security.passwordHash && security.passwordSalt) {
          authenticated = await cryptoService.verifySecret(
            input.password,
            security.passwordSalt,
            security.passwordHash,
          );
        }
    }

    const deviceInfo = biometricService.getDeviceInfo();

    if (!authenticated) {
      const attempts = await userSecurityRepository.incrementFailedAttempts(user.id);
      await loginHistoryRepository.record({
        userUuid: user.id,
        deviceName: deviceInfo.deviceName,
        authMethod: input.authMethod,
        success: false,
        failureReason: 'Invalid credentials',
      });
      const delayMs = Math.min(attempts * 500, 5000);
      await new Promise((r) => setTimeout(r, delayMs));
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    await userSecurityRepository.resetFailedAttempts(user.id);
    return this.completeLogin(user, input.authMethod);
  }

  private async completeLogin(user: AuthUser, authMethod: AuthMethod): Promise<AuthUser> {
    await sessionService.createSession(user, authMethod);
    await userRepository.updateLastLogin(user.id);

    const caps = await biometricService.getCapabilities();
    const deviceInfo = biometricService.getDeviceInfo();
    await deviceRegistryRepository.register({
      userUuid: user.id,
      deviceName: deviceInfo.deviceName,
      platform: deviceInfo.platform,
      osVersion: deviceInfo.osVersion,
      appVersion: deviceInfo.appVersion,
      biometricCapable: caps.hasHardware && caps.isEnrolled,
    });

    await loginHistoryRepository.record({
      userUuid: user.id,
      deviceName: deviceInfo.deviceName,
      authMethod,
      success: true,
    });

    return user;
  }

  private async verifyCombinedAuth(
    _userId: string,
    security: NonNullable<Awaited<ReturnType<typeof userSecurityRepository.findByUserUuid>>>,
    input: LoginInput,
    methods: AuthMethod[],
  ): Promise<boolean> {
    const checks = await Promise.all(
      methods.map(async (method) => {
        const attempt: LoginInput = { ...input, authMethod: method };
        switch (method) {
          case 'email_password':
          case 'phone_password':
            if (!attempt.password || !security.passwordHash || !security.passwordSalt) return false;
            return cryptoService.verifySecret(attempt.password, security.passwordSalt, security.passwordHash);
          case 'pin_4':
          case 'pin_6':
            if (!attempt.pin || !security.pinHash || !security.pinSalt) return false;
            return cryptoService.verifyPin(attempt.pin, security.pinSalt, security.pinHash);
          case 'fingerprint':
          case 'face_id':
          case 'biometric':
          case 'device_passcode': {
            const result = await biometricService.authenticate('Verify your identity');
            return result.success;
          }
          default:
            return false;
        }
      }),
    );
    return checks.every(Boolean);
  }

  private async resolveUser(identifier: string): Promise<AuthUser | null> {
    const trimmed = identifier.trim();
    if (trimmed.includes('@')) return userRepository.findByEmail(trimmed);
    if (/^\+?\d[\d\s-]{8,}$/.test(trimmed)) return userRepository.findByPhone(trimmed);
    return userRepository.findByEmail(trimmed) ?? userRepository.findByPhone(trimmed);
  }

  async logout(): Promise<void> {
    const userId = await secureAuthStorage.getSessionUserId();
    const sessionId = await secureAuthStorage.getSessionId();
    if (userId) {
      await loginHistoryRepository.recordLogout(userId, sessionId ?? undefined);
    }
    await sessionService.invalidateCurrentSession();
    await secureAuthStorage.clearBiometricToken();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { valid, userId } = await sessionService.validateSession();
    if (!valid || !userId) return null;
    return userRepository.findByUuid(userId);
  }

  async getSecurityPreferences(userId: string): Promise<SecurityPreferences> {
    const security = await userSecurityRepository.findByUserUuid(userId);
    const prefs = await securityPreferencesRepository.findByUserUuid(userId, security?.pinLength ?? 0);
    return prefs ?? DEFAULT_SECURITY_PREFERENCES;
  }

  async updateSecurityPreferences(userId: string, updates: Partial<SecurityPreferences>): Promise<void> {
    await securityPreferencesRepository.update(userId, updates);
  }

  async setupPin(userId: string, pin: string, length: 4 | 6): Promise<void> {
    if (pin.length !== length || !/^\d+$/.test(pin)) {
      throw new AuthError(`PIN must be ${length} digits`, 'VALIDATION_ERROR');
    }
    const salt = await cryptoService.generateSalt();
    const hash = await cryptoService.hashPin(pin, salt);
    await userSecurityRepository.updatePin(userId, hash, salt, length);
    await securityPreferencesRepository.update(userId, {
      pinEnabled: true,
      pinLength: length,
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const security = await userSecurityRepository.findByUserUuid(userId);
    if (!security?.passwordHash || !security.passwordSalt) {
      throw new AuthError('Password not configured', 'NOT_FOUND');
    }
    const valid = await cryptoService.verifySecret(currentPassword, security.passwordSalt, security.passwordHash);
    if (!valid) throw new AuthError('Current password is incorrect', 'INVALID_CREDENTIALS');

    if (newPassword.length < 8) {
      throw new AuthError('New password must be at least 8 characters', 'VALIDATION_ERROR');
    }

    const salt = await cryptoService.generateSalt();
    const hash = await cryptoService.hashSecret(newPassword, salt);
    await userSecurityRepository.updatePassword(userId, hash, salt);
  }

  async recoverWithCode(userId: string, code: string, newPassword: string): Promise<void> {
    const security = await userSecurityRepository.findByUserUuid(userId);
    if (!security?.recoveryCodeHash || !security.recoveryCodeSalt) {
      throw new AuthError('Recovery not configured', 'NOT_FOUND');
    }
    const valid = await cryptoService.verifySecret(code, security.recoveryCodeSalt, security.recoveryCodeHash);
    if (!valid) throw new AuthError('Invalid recovery code', 'INVALID_CREDENTIALS');

    if (newPassword.length < 8) {
      throw new AuthError('Password must be at least 8 characters', 'VALIDATION_ERROR');
    }

    const salt = await cryptoService.generateSalt();
    const hash = await cryptoService.hashSecret(newPassword, salt);
    await userSecurityRepository.updatePassword(userId, hash, salt);
    await userSecurityRepository.resetFailedAttempts(userId);
  }

  calculateSecurityScore(prefs: SecurityPreferences, hasPin: boolean, hasBiometric: boolean): SecurityScore {
    let score = 20;
    const recommendations: string[] = [];

    if (hasPin) score += 15;
    else recommendations.push('Set up a PIN for quick secure access');

    if (prefs.biometricEnabled || hasBiometric) score += 20;
    else recommendations.push('Enable biometric authentication');

    if (prefs.appLockEnabled) score += 15;
    else recommendations.push('Enable app lock for background protection');

    if (prefs.devicePasscodeEnabled) score += 10;
    if (prefs.combinedAuthRequired) score += 10;
    if (prefs.autoLockTimer !== 'never') score += 10;
    else recommendations.push('Set an auto-lock timer');

    let level: SecurityScore['level'] = 'low';
    if (score >= 85) level = 'excellent';
    else if (score >= 65) level = 'high';
    else if (score >= 45) level = 'medium';

    return { score, maxScore: 100, level, recommendations };
  }

  async deleteAccount(userId: string): Promise<void> {
    await sessionService.invalidateAllSessions(userId);
    await userRepository.softDelete(userId);
    await secureAuthStorage.clearAll();
  }

  async wipeAllAuthData(): Promise<void> {
    await sessionRepository.hardDeleteAll();
    await loginHistoryRepository.hardDeleteAll();
    await deviceRegistryRepository.hardDeleteAll();
    await securityPreferencesRepository.hardDeleteAll();
    await userSecurityRepository.hardDeleteAll();
    await userRepository.hardDeleteAll();
    await secureAuthStorage.clearAll();
  }
}

export const authService = new AuthService();
