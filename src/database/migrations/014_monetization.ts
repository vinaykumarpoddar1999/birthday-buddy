import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration014Monetization: Migration = {
  version: 14,
  name: 'monetization',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        ${BASE_ENTITY_COLUMNS},
        plan_key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        price REAL NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'INR',
        duration TEXT NOT NULL DEFAULT 'monthly',
        savings TEXT,
        benefits TEXT NOT NULL DEFAULT '[]',
        is_popular INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        ${BASE_ENTITY_COLUMNS},
        plan_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        source TEXT NOT NULL DEFAULT 'local',
        started_at TEXT NOT NULL,
        expires_at TEXT,
        cancelled_at TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

      CREATE TABLE IF NOT EXISTS premium_features (
        ${BASE_ENTITY_COLUMNS},
        feature_key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'general'
      );

      CREATE TABLE IF NOT EXISTS referrals (
        ${BASE_ENTITY_COLUMNS},
        invitee_name TEXT,
        invite_date TEXT NOT NULL,
        joined_date TEXT,
        reward_earned TEXT,
        reward_status TEXT NOT NULL DEFAULT 'pending',
        referral_code TEXT NOT NULL,
        invite_source TEXT NOT NULL DEFAULT 'link'
      );

      CREATE TABLE IF NOT EXISTS referral_rewards (
        ${BASE_ENTITY_COLUMNS},
        milestone INTEGER NOT NULL,
        reward_type TEXT NOT NULL,
        reward_value TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS reward_history (
        ${BASE_ENTITY_COLUMNS},
        reward_type TEXT NOT NULL,
        reward_value TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'referral',
        status TEXT NOT NULL DEFAULT 'granted',
        granted_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS subscription_history (
        ${BASE_ENTITY_COLUMNS},
        plan_id TEXT NOT NULL,
        action TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'local',
        amount REAL NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'INR',
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS premium_usage_logs (
        ${BASE_ENTITY_COLUMNS},
        feature_key TEXT NOT NULL,
        used_at TEXT NOT NULL,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS promo_codes (
        ${BASE_ENTITY_COLUMNS},
        code TEXT NOT NULL UNIQUE,
        discount_percent INTEGER NOT NULL DEFAULT 0,
        plan_id TEXT,
        expires_at TEXT,
        max_uses INTEGER,
        used_count INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS referral_codes (
        ${BASE_ENTITY_COLUMNS},
        code TEXT NOT NULL UNIQUE,
        owner_label TEXT NOT NULL DEFAULT 'You'
      );
    `);

    const now = new Date().toISOString();
    const plans = [
      {
        key: 'monthly',
        name: 'Monthly',
        price: 199,
        duration: 'monthly',
        savings: null,
        popular: 0,
        benefits: JSON.stringify(['Unlimited AI wishes', 'Premium templates', 'HD exports']),
      },
      {
        key: 'yearly',
        name: 'Yearly',
        price: 499,
        duration: 'yearly',
        savings: 'Save 79%',
        popular: 1,
        benefits: JSON.stringify(['Everything in Premium', 'Best value', 'Priority support']),
      },
      {
        key: 'lifetime',
        name: 'Lifetime',
        price: 2499,
        duration: 'lifetime',
        savings: 'One-time',
        popular: 0,
        benefits: JSON.stringify(['Lifetime access', 'All future features', 'No renewal']),
      },
    ];

    for (const plan of plans) {
      await db.runAsync(
        `INSERT OR IGNORE INTO subscription_plans (
          uuid, created_at, updated_at, is_deleted, version, sync_status, device_id,
          plan_key, name, price, currency, duration, savings, benefits, is_popular
        ) VALUES (?, ?, ?, 0, 1, 'local', 'seed', ?, ?, ?, 'INR', ?, ?, ?, ?)`,
        [
          `plan-${plan.key}`,
          now,
          now,
          plan.key,
          plan.name,
          plan.price,
          plan.duration,
          plan.savings,
          plan.benefits,
          plan.popular,
        ],
      );
    }

    const features = [
      ['ai_wishes', 'Unlimited AI Wishes', 'Generate wishes without limits', 'ai'],
      ['premium_cards', 'Premium Cards', '500+ premium card templates', 'cards'],
      ['surprise_templates', 'Premium Surprise Templates', 'Exclusive surprise link designs', 'surprise'],
      ['memory_timeline', 'Memory Timeline', 'Beautiful memory timelines', 'memories'],
      ['hd_exports', 'HD Exports', 'Download cards in HD without watermarks', 'export'],
      ['unlimited_contacts', 'Unlimited Contacts', 'Add unlimited people', 'people'],
    ];

    for (const [key, name, desc, cat] of features) {
      await db.runAsync(
        `INSERT OR IGNORE INTO premium_features (
          uuid, created_at, updated_at, is_deleted, version, sync_status, device_id,
          feature_key, name, description, category
        ) VALUES (?, ?, ?, 0, 1, 'local', 'seed', ?, ?, ?, ?)`,
        [`feat-${key}`, now, now, key, name, desc, cat],
      );
    }

    const rewards = [
      [1, 'premium_days', '7', '7 days Premium when 1 friend joins'],
      [3, 'premium_months', '1', '1 month Premium when 3 friends join'],
      [5, 'premium_months', '12', '12 months Premium when 5 friends join'],
    ];

    for (const [milestone, type, value, desc] of rewards) {
      await db.runAsync(
        `INSERT OR IGNORE INTO referral_rewards (
          uuid, created_at, updated_at, is_deleted, version, sync_status, device_id,
          milestone, reward_type, reward_value, description
        ) VALUES (?, ?, ?, 0, 1, 'local', 'seed', ?, ?, ?, ?)`,
        [`reward-${milestone}`, now, now, milestone, type, value, desc],
      );
    }
  },
};
