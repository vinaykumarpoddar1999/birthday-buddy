import { BaseRepository } from './base-repository';
import type { SubscriptionPlanRecord, SubscriptionRecord } from '@features/premium/types';

interface PlanRow {
  uuid: string;
  plan_key: string;
  name: string;
  price: number;
  currency: string;
  duration: string;
  savings: string | null;
  benefits: string;
  is_popular: number;
}

interface SubRow {
  uuid: string;
  plan_id: string;
  status: string;
  source: string;
  started_at: string;
  expires_at: string | null;
}

export class SubscriptionRepository extends BaseRepository {
  async listPlans(): Promise<SubscriptionPlanRecord[]> {
    const rows = await this.getAll<PlanRow>(
      `SELECT uuid, plan_key, name, price, currency, duration, savings, benefits, is_popular
       FROM subscription_plans WHERE ${this.notDeletedClause()} ORDER BY price ASC`,
    );
    return rows.map((r) => ({
      id: r.uuid,
      planKey: r.plan_key,
      name: r.name,
      price: r.price,
      currency: r.currency,
      duration: r.duration as SubscriptionPlanRecord['duration'],
      savings: r.savings ?? undefined,
      benefits: JSON.parse(r.benefits || '[]') as string[],
      isPopular: r.is_popular === 1,
    }));
  }

  async findPlanByKey(planKey: string): Promise<SubscriptionPlanRecord | null> {
    const row = await this.getFirst<PlanRow>(
      `SELECT uuid, plan_key, name, price, currency, duration, savings, benefits, is_popular
       FROM subscription_plans WHERE plan_key = ? AND ${this.notDeletedClause()} LIMIT 1`,
      [planKey],
    );
    if (!row) return null;
    return {
      id: row.uuid,
      planKey: row.plan_key,
      name: row.name,
      price: row.price,
      currency: row.currency,
      duration: row.duration as SubscriptionPlanRecord['duration'],
      savings: row.savings ?? undefined,
      benefits: JSON.parse(row.benefits || '[]') as string[],
      isPopular: row.is_popular === 1,
    };
  }

  async getActiveSubscription(): Promise<SubscriptionRecord | null> {
    const row = await this.getFirst<SubRow>(
      `SELECT uuid, plan_id, status, source, started_at, expires_at
       FROM subscriptions WHERE status = 'active' AND ${this.notDeletedClause()}
       ORDER BY started_at DESC LIMIT 1`,
    );
    if (!row) return null;
    return {
      id: row.uuid,
      planId: row.plan_id,
      status: row.status as SubscriptionRecord['status'],
      source: row.source,
      startedAt: row.started_at,
      expiresAt: row.expires_at,
    };
  }

  async insertSubscription(planId: string, source: string, expiresAt: string | null): Promise<string> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO subscriptions (
        uuid, created_at, updated_at, is_deleted, version, sync_status, device_id,
        plan_id, status, source, started_at, expires_at
      ) VALUES (?, ?, ?, 0, 1, 'local', ?, ?, 'active', ?, ?, ?)`,
      [uuid, now, now, this.deviceId, planId, source, now, expiresAt],
    );
    return uuid;
  }

  async expireAllActive(): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE subscriptions SET status = 'expired', updated_at = ? WHERE status = 'active'`,
      [now],
    );
  }

  async logHistory(planId: string, action: string, amount: number, currency: string): Promise<void> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO subscription_history (
        uuid, created_at, updated_at, is_deleted, version, sync_status, device_id,
        plan_id, action, source, amount, currency
      ) VALUES (?, ?, ?, 0, 1, 'local', ?, ?, ?, 'local', ?, ?)`,
      [uuid, now, now, this.deviceId, planId, action, amount, currency],
    );
  }
}

export const subscriptionRepository = new SubscriptionRepository();
