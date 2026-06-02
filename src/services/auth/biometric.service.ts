import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';

export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

export class BiometricService {
  async getCapabilities(): Promise<{
    hasHardware: boolean;
    isEnrolled: boolean;
    supportedTypes: LocalAuthentication.AuthenticationType[];
    biometricType: BiometricType;
  }> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: BiometricType = 'none';
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'facial';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'fingerprint';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'iris';
    }

    return { hasHardware, isEnrolled, supportedTypes, biometricType };
  }

  async authenticate(promptMessage = 'Authenticate to continue'): Promise<{
    success: boolean;
    error?: string;
  }> {
    const caps = await this.getCapabilities();
    if (!caps.hasHardware || !caps.isEnrolled) {
      return { success: false, error: 'Biometrics not available on this device' };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) return { success: true };
    return {
      success: false,
      error: result.error ?? 'Authentication failed',
    };
  }

  async authenticateWithDevicePasscode(promptMessage = 'Enter device passcode'): Promise<{
    success: boolean;
    error?: string;
  }> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    if (result.success) return { success: true };
    return { success: false, error: result.error ?? 'Authentication failed' };
  }

  getDeviceInfo(): { deviceName: string; platform: string; osVersion: string; appVersion: string } {
    return {
      deviceName: Constants.deviceName ?? `${Platform.OS} Device`,
      platform: Platform.OS,
      osVersion: String(Platform.Version),
      appVersion: Constants.expoConfig?.version ?? '1.0.0',
    };
  }
}

export const biometricService = new BiometricService();
