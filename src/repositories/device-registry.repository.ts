import { BaseRepository } from './base-repository';
import type { TrustedDevice } from '@features/auth/types/auth.types';

interface DeviceRow {
  uuid: string;
  user_uuid: string;
  device_id: string;
  device_name: string;
  platform: string;
  os_version: string;
  app_version: string;
  is_trusted: number;
  is_current: number;
  last_seen_at: string;
  registered_at: string;
  biometric_capable: number;
}

export class DeviceRegistryRepository extends BaseRepository {
  private mapRow(row: DeviceRow): TrustedDevice {
    return {
      id: row.uuid,
      deviceId: row.device_id,
      deviceName: row.device_name,
      platform: row.platform,
      isTrusted: row.is_trusted === 1,
      isCurrent: row.is_current === 1,
      lastSeenAt: row.last_seen_at,
      registeredAt: row.registered_at,
      biometricCapable: row.biometric_capable === 1,
    };
  }

  async register(input: {
    userUuid: string;
    deviceName: string;
    platform: string;
    osVersion: string;
    appVersion: string;
    biometricCapable: boolean;
  }): Promise<void> {
    const existing = await this.getFirst<DeviceRow>(
      `SELECT * FROM device_registry WHERE user_uuid = ? AND device_id = ? AND ${this.notDeletedClause()}`,
      [input.userUuid, this.deviceId],
    );

    const now = this.now();

    if (existing) {
      await this.run(
        `UPDATE device_registry SET last_seen_at = ?, is_current = 1, device_name = ?, updated_at = ? WHERE uuid = ?`,
        [now, input.deviceName, now, existing.uuid],
      );
      await this.run(
        `UPDATE device_registry SET is_current = 0, updated_at = ? WHERE user_uuid = ? AND device_id != ?`,
        [now, input.userUuid, this.deviceId],
      );
      return;
    }

    const uuid = this.newUuid();
    await this.run(
      `UPDATE device_registry SET is_current = 0, updated_at = ? WHERE user_uuid = ?`,
      [now, input.userUuid],
    );
    await this.run(
      `INSERT INTO device_registry (
        uuid, created_at, updated_at, device_id, sync_status,
        user_uuid, device_name, platform, os_version, app_version,
        is_trusted, is_current, last_seen_at, registered_at, biometric_capable
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        input.userUuid,
        input.deviceName,
        input.platform,
        input.osVersion,
        input.appVersion,
        now,
        now,
        input.biometricCapable ? 1 : 0,
      ],
    );
  }

  async getTrustedDevices(userUuid: string): Promise<TrustedDevice[]> {
    const rows = await this.getAll<DeviceRow>(
      `SELECT * FROM device_registry WHERE user_uuid = ? AND ${this.notDeletedClause()} ORDER BY is_current DESC, last_seen_at DESC`,
      [userUuid],
    );
    return rows.map((r) => this.mapRow(r));
  }

  async updateLastSeen(userUuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE device_registry SET last_seen_at = ?, updated_at = ? WHERE user_uuid = ? AND device_id = ?`,
      [now, now, userUuid, this.deviceId],
    );
  }

  async hardDeleteAll(): Promise<void> {
    await this.run(`DELETE FROM device_registry`);
  }
}

export const deviceRegistryRepository = new DeviceRegistryRepository();
