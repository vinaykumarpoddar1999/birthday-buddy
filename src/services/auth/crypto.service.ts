import * as Crypto from 'expo-crypto';

const HASH_ITERATIONS = 100_000;
const SALT_BYTES = 32;

export class CryptoService {
  async generateSalt(): Promise<string> {
    const bytes = await Crypto.getRandomBytesAsync(SALT_BYTES);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async generateToken(): Promise<string> {
    return Crypto.randomUUID();
  }

  async generateRecoveryCode(): Promise<string> {
    const bytes = await Crypto.getRandomBytesAsync(6);
    const num = Array.from(bytes).reduce((acc, b) => acc * 256 + b, 0);
    return String(num % 1_000_000_000).padStart(9, '0');
  }

  async hashSecret(secret: string, salt: string): Promise<string> {
    let digest = `${salt}:${secret}`;
    for (let i = 0; i < HASH_ITERATIONS; i++) {
      digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${digest}:${i}`);
    }
    return digest;
  }

  async verifySecret(secret: string, salt: string, expectedHash: string): Promise<boolean> {
    const computed = await this.hashSecret(secret, salt);
    return constantTimeCompare(computed, expectedHash);
  }

  async hashPin(pin: string, salt: string): Promise<string> {
    return this.hashSecret(pin, salt);
  }

  async verifyPin(pin: string, salt: string, expectedHash: string): Promise<boolean> {
    return this.verifySecret(pin, salt, expectedHash);
  }

  async hashSessionToken(token: string): Promise<string> {
    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, token);
  }
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const cryptoService = new CryptoService();
