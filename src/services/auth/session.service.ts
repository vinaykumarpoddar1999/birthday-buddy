import type { AuthMethod, AuthSession, AuthUser } from '@features/auth/types/auth.types';
import { sessionRepository } from '@/repositories/session.repository';
import { secureAuthStorage } from './secure-auth-storage';
import { cryptoService } from './crypto.service';
import { biometricService } from './biometric.service';

export class SessionService {
  async createSession(user: AuthUser, authMethod: AuthMethod): Promise<AuthSession> {
    const token = await cryptoService.generateToken();
    const tokenHash = await cryptoService.hashSessionToken(token);
    const deviceInfo = biometricService.getDeviceInfo();

    const session = await sessionRepository.create({
      userUuid: user.id,
      tokenHash,
      deviceName: deviceInfo.deviceName,
      platform: deviceInfo.platform,
      authMethod,
    });

    await secureAuthStorage.setSessionToken(token);
    await secureAuthStorage.setSessionUserId(user.id);
    await secureAuthStorage.setSessionId(session.id);

    return session;
  }

  async validateSession(): Promise<{
    valid: boolean;
    userId: string | null;
    session: AuthSession | null;
  }> {
    const token = await secureAuthStorage.getSessionToken();
    const userId = await secureAuthStorage.getSessionUserId();
    const sessionId = await secureAuthStorage.getSessionId();

    if (!token || !userId || !sessionId) {
      return { valid: false, userId: null, session: null };
    }

    const tokenHash = await cryptoService.hashSessionToken(token);
    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (!session || !session.isActive || session.userId !== userId || session.id !== sessionId) {
      return { valid: false, userId: null, session: null };
    }

    await sessionRepository.updateActivity(session.id);
    return { valid: true, userId, session };
  }

  async refreshSession(): Promise<void> {
    const sessionId = await secureAuthStorage.getSessionId();
    if (sessionId) {
      await sessionRepository.updateActivity(sessionId);
    }
  }

  async invalidateCurrentSession(): Promise<void> {
    const sessionId = await secureAuthStorage.getSessionId();
    if (sessionId) {
      await sessionRepository.invalidate(sessionId);
    }
    await secureAuthStorage.clearSession();
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    await sessionRepository.invalidateAllForUser(userId);
    await secureAuthStorage.clearSession();
  }

  async recoverSession(userId: string): Promise<AuthSession | null> {
    const sessions = await sessionRepository.findActiveByUser(userId);
    const active = sessions[0];
    if (!active) return null;

    const token = await cryptoService.generateToken();
    const tokenHash = await cryptoService.hashSessionToken(token);
    await sessionRepository.invalidate(active.id);

    const deviceInfo = biometricService.getDeviceInfo();
    const newSession = await sessionRepository.create({
      userUuid: userId,
      tokenHash,
      deviceName: deviceInfo.deviceName,
      platform: deviceInfo.platform,
      authMethod: active.authMethod,
    });

    await secureAuthStorage.setSessionToken(token);
    await secureAuthStorage.setSessionUserId(userId);
    await secureAuthStorage.setSessionId(newSession.id);

    return newSession;
  }
}

export const sessionService = new SessionService();
