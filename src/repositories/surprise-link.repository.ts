import type {
  ExperienceAnalytics,
  ExperienceReaction,
  ExperienceReply,
  ReactionType,
  ReplyType,
  SurpriseExperience,
} from '@features/surprise-link/types';

import { BaseRepository } from './base-repository';

interface ExperienceRow {
  uuid: string;
  slug: string;
  share_link: string;
  short_url: string | null;
  occasion: string;
  recipient_type: string;
  template_id: string;
  experience_json: string;
  status: string;
  published_at: string | null;
  person_id: number | null;
  created_at: string;
  updated_at: string;
}

interface AnalyticsRow {
  uuid: string;
  experience_uuid: string;
  viewed: number;
  open_count: number;
  completion_rate: number;
  section_views_json: string;
  last_viewed_at: string | null;
}

export class SurpriseLinkRepository extends BaseRepository {
  async insert(experience: SurpriseExperience, personId: number | null): Promise<string> {
    const now = this.now();
    const uuid = experience.id || this.newUuid();
    await this.run(
      `INSERT INTO surprise_experiences (
        uuid, created_at, updated_at, person_id, slug, share_link, short_url,
        occasion, recipient_type, template_id, experience_json, status, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        experience.createdAt || now,
        now,
        personId,
        experience.slug,
        experience.shareLink,
        experience.shortUrl,
        experience.occasion,
        experience.recipientType,
        experience.templateId,
        JSON.stringify(experience),
        experience.status,
        experience.publishedAt ?? null,
      ],
    );
    await this.run(
      `INSERT INTO surprise_analytics (uuid, created_at, updated_at, experience_uuid, viewed, open_count, completion_rate, section_views_json)
       VALUES (?, ?, ?, ?, 0, 0, 0, '{}')`,
      [this.newUuid(), now, now, uuid],
    );
    return uuid;
  }

  async update(uuid: string, experience: SurpriseExperience): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE surprise_experiences SET
        updated_at = ?, experience_json = ?, status = ?, published_at = ?,
        share_link = ?, short_url = ?, slug = ?
       WHERE uuid = ? AND is_deleted = 0`,
      [
        now,
        JSON.stringify(experience),
        experience.status,
        experience.publishedAt ?? null,
        experience.shareLink,
        experience.shortUrl,
        experience.slug,
        uuid,
      ],
    );
  }

  async findByUuid(uuid: string): Promise<SurpriseExperience | null> {
    const row = await this.getFirst<ExperienceRow>(
      'SELECT * FROM surprise_experiences WHERE uuid = ? AND is_deleted = 0',
      [uuid],
    );
    return row ? this.parseExperience(row) : null;
  }

  async findBySlug(slug: string): Promise<SurpriseExperience | null> {
    const row = await this.getFirst<ExperienceRow>(
      'SELECT * FROM surprise_experiences WHERE slug = ? AND is_deleted = 0',
      [slug],
    );
    return row ? this.parseExperience(row) : null;
  }

  async findAll(limit = 50): Promise<SurpriseExperience[]> {
    const rows = await this.getAll<ExperienceRow>(
      'SELECT * FROM surprise_experiences WHERE is_deleted = 0 ORDER BY updated_at DESC LIMIT ?',
      [limit],
    );
    return rows.map((r) => this.parseExperience(r));
  }

  async findByPersonId(personId: number): Promise<SurpriseExperience[]> {
    const rows = await this.getAll<ExperienceRow>(
      'SELECT * FROM surprise_experiences WHERE person_id = ? AND is_deleted = 0 ORDER BY updated_at DESC',
      [personId],
    );
    return rows.map((r) => this.parseExperience(r));
  }

  async getAnalytics(experienceUuid: string): Promise<ExperienceAnalytics | null> {
    const row = await this.getFirst<AnalyticsRow>(
      'SELECT * FROM surprise_analytics WHERE experience_uuid = ? AND is_deleted = 0',
      [experienceUuid],
    );
    if (!row) return null;

    const reactions = await this.getReactions(experienceUuid);
    const replies = await this.getReplies(experienceUuid);

    return {
      experienceId: experienceUuid,
      viewed: row.viewed === 1,
      openCount: row.open_count,
      completionRate: row.completion_rate,
      reactions,
      replies,
      sectionViews: JSON.parse(row.section_views_json || '{}') as Record<string, number>,
      lastViewedAt: row.last_viewed_at ?? undefined,
    };
  }

  async recordView(experienceUuid: string, sectionId?: string): Promise<void> {
    const now = this.now();
    const analytics = await this.getFirst<AnalyticsRow>(
      'SELECT * FROM surprise_analytics WHERE experience_uuid = ?',
      [experienceUuid],
    );
    if (!analytics) return;

    const sectionViews = JSON.parse(analytics.section_views_json || '{}') as Record<string, number>;
    if (sectionId) {
      sectionViews[sectionId] = (sectionViews[sectionId] ?? 0) + 1;
    }

    await this.run(
      `UPDATE surprise_analytics SET viewed = 1, open_count = open_count + 1,
        last_viewed_at = ?, section_views_json = ?, updated_at = ?
       WHERE experience_uuid = ?`,
      [now, JSON.stringify(sectionViews), now, experienceUuid],
    );
  }

  async updateCompletionRate(experienceUuid: string, rate: number): Promise<void> {
    await this.run(
      'UPDATE surprise_analytics SET completion_rate = ?, updated_at = ? WHERE experience_uuid = ?',
      [rate, this.now(), experienceUuid],
    );
  }

  async addReaction(experienceUuid: string, type: ReactionType): Promise<ExperienceReaction> {
    const now = this.now();
    const uuid = this.newUuid();
    await this.run(
      'INSERT INTO surprise_reactions (uuid, experience_uuid, reaction_type, created_at) VALUES (?, ?, ?, ?)',
      [uuid, experienceUuid, type, now],
    );
    return { id: uuid, experienceId: experienceUuid, type, createdAt: now };
  }

  async addReply(
    experienceUuid: string,
    type: ReplyType,
    content: string,
    mediaUri?: string,
  ): Promise<ExperienceReply> {
    const now = this.now();
    const uuid = this.newUuid();
    await this.run(
      'INSERT INTO surprise_replies (uuid, experience_uuid, reply_type, content, media_uri, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [uuid, experienceUuid, type, content, mediaUri ?? null, now],
    );
    return { id: uuid, experienceId: experienceUuid, type, content, mediaUri, createdAt: now };
  }

  async getReactions(experienceUuid: string): Promise<ExperienceReaction[]> {
    const rows = await this.getAll<{ uuid: string; reaction_type: string; created_at: string }>(
      'SELECT uuid, reaction_type, created_at FROM surprise_reactions WHERE experience_uuid = ? ORDER BY created_at DESC',
      [experienceUuid],
    );
    return rows.map((r) => ({
      id: r.uuid,
      experienceId: experienceUuid,
      type: r.reaction_type as ReactionType,
      createdAt: r.created_at,
    }));
  }

  async getReplies(experienceUuid: string): Promise<ExperienceReply[]> {
    const rows = await this.getAll<{
      uuid: string;
      reply_type: string;
      content: string;
      media_uri: string | null;
      created_at: string;
    }>(
      'SELECT uuid, reply_type, content, media_uri, created_at FROM surprise_replies WHERE experience_uuid = ? ORDER BY created_at DESC',
      [experienceUuid],
    );
    return rows.map((r) => ({
      id: r.uuid,
      experienceId: experienceUuid,
      type: r.reply_type as ReplyType,
      content: r.content,
      mediaUri: r.media_uri ?? undefined,
      createdAt: r.created_at,
    }));
  }

  async countPublished(): Promise<number> {
    const row = await this.getFirst<{ count: number }>(
      "SELECT COUNT(*) as count FROM surprise_experiences WHERE status = 'published' AND is_deleted = 0",
    );
    return row?.count ?? 0;
  }

  private parseExperience(row: ExperienceRow): SurpriseExperience {
    try {
      const parsed = JSON.parse(row.experience_json) as SurpriseExperience;
      return { ...parsed, id: row.uuid, slug: row.slug };
    } catch {
      return {
        id: row.uuid,
        slug: row.slug,
        shareLink: row.share_link,
        shortUrl: row.short_url ?? '',
        occasion: row.occasion as SurpriseExperience['occasion'],
        recipientType: row.recipient_type as SurpriseExperience['recipientType'],
        templateId: row.template_id,
        personalization: {
          senderName: '',
          recipientName: '',
          nickname: '',
          relationship: '',
          occasionDate: '',
          location: '',
          specialDate: '',
          hero: { welcomeMessage: '', openingAnimation: 'gift_box' },
          questions: [],
        },
        modules: [],
        theme: {
          id: 'birthday_celebration',
          primaryColor: '#7C3AED',
          secondaryColor: '#EC4899',
          backgroundColor: '#FDF4FF',
          textColor: '#4C1D95',
          accentColor: '#FBBF24',
        },
        effects: [],
        music: { autoPlay: false, volume: 0.7, loop: true },
        interactive: { features: [] },
        status: row.status as 'draft' | 'published',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        publishedAt: row.published_at ?? undefined,
      };
    }
  }
}

export const surpriseLinkRepository = new SurpriseLinkRepository();
