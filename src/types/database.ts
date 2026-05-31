import type { TableDef } from './database-helpers';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<
        {
          id: string;
          email: string;
          name: string | null;
          avatar: string | null;
          created_at: string;
        },
        {
          id: string;
          email: string;
          name?: string | null;
          avatar?: string | null;
          created_at?: string;
        },
        Partial<{
          id: string;
          email: string;
          name?: string | null;
          avatar?: string | null;
          created_at?: string;
        }>
      >;
      contacts: TableDef<
        {
          id: string;
          user_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          dob: string | null;
          relationship: string | null;
          notes: string | null;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          dob?: string | null;
          relationship?: string | null;
          notes?: string | null;
          created_at?: string;
        },
        Partial<{
          id?: string;
          user_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          dob?: string | null;
          relationship?: string | null;
          notes?: string | null;
          created_at?: string;
        }>
      >;
      birthdays: TableDef<
        {
          id: string;
          contact_id: string;
          birth_date: string;
          reminder_days: number[] | null;
          created_at: string;
        },
        {
          id?: string;
          contact_id: string;
          birth_date: string;
          reminder_days?: number[] | null;
          created_at?: string;
        },
        Partial<{
          id?: string;
          contact_id: string;
          birth_date: string;
          reminder_days?: number[] | null;
          created_at?: string;
        }>
      >;
      wishes: TableDef<
        {
          id: string;
          contact_id: string;
          generated_text: string;
          tone: string | null;
          language: string | null;
          created_at: string;
        },
        {
          id?: string;
          contact_id: string;
          generated_text: string;
          tone?: string | null;
          language?: string | null;
          created_at?: string;
        },
        Partial<{
          id?: string;
          contact_id: string;
          generated_text: string;
          tone?: string | null;
          language?: string | null;
          created_at?: string;
        }>
      >;
      cards: TableDef<
        {
          id: string;
          template_id: string | null;
          contact_id: string;
          image_url: string | null;
          created_at: string;
        },
        {
          id?: string;
          template_id?: string | null;
          contact_id: string;
          image_url?: string | null;
          created_at?: string;
        },
        Partial<{
          id?: string;
          template_id?: string | null;
          contact_id: string;
          image_url?: string | null;
          created_at?: string;
        }>
      >;
      memories: TableDef<
        {
          id: string;
          contact_id: string;
          caption: string | null;
          image_url: string | null;
          created_at: string;
        },
        {
          id?: string;
          contact_id: string;
          caption?: string | null;
          image_url?: string | null;
          created_at?: string;
        },
        Partial<{
          id?: string;
          contact_id: string;
          caption?: string | null;
          image_url?: string | null;
          created_at?: string;
        }>
      >;
      referrals: TableDef<
        {
          id: string;
          referrer: string;
          referred: string;
          status: string;
          created_at: string;
        },
        {
          id?: string;
          referrer: string;
          referred: string;
          status?: string;
          created_at?: string;
        },
        Partial<{
          id?: string;
          referrer: string;
          referred: string;
          status?: string;
          created_at?: string;
        }>
      >;
      subscriptions: TableDef<
        {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          expires_at: string | null;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          plan: string;
          status: string;
          expires_at?: string | null;
          created_at?: string;
        },
        Partial<{
          id?: string;
          user_id: string;
          plan: string;
          status: string;
          expires_at?: string | null;
          created_at?: string;
        }>
      >;
      subscription_plans: TableDef<
        {
          id: string;
          name: string;
          price: number;
          interval: string;
          features: Json;
        },
        {
          id?: string;
          name: string;
          price: number;
          interval: string;
          features?: Json;
        },
        Partial<{
          id?: string;
          name: string;
          price: number;
          interval: string;
          features?: Json;
        }>
      >;
      purchase_history: TableDef<
        {
          id: string;
          user_id: string;
          product_id: string;
          platform: string;
          purchased_at: string;
        },
        {
          id?: string;
          user_id: string;
          product_id: string;
          platform: string;
          purchased_at?: string;
        },
        Partial<{
          id?: string;
          user_id: string;
          product_id: string;
          platform: string;
          purchased_at?: string;
        }>
      >;
      referral_codes: TableDef<
        {
          id: string;
          user_id: string;
          code: string;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          code: string;
          created_at?: string;
        },
        Partial<{
          id?: string;
          user_id: string;
          code: string;
          created_at?: string;
        }>
      >;
      referral_rewards: TableDef<
        {
          id: string;
          user_id: string;
          reward_type: string;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          reward_type: string;
          created_at?: string;
        },
        Partial<{
          id?: string;
          user_id: string;
          reward_type: string;
          created_at?: string;
        }>
      >;
      device_tokens: TableDef<
        {
          id: string;
          user_id: string;
          token: string;
          platform: string;
          created_at: string;
        },
        {
          id?: string;
          user_id: string;
          token: string;
          platform: string;
          created_at?: string;
        },
        Partial<{
          id?: string;
          user_id: string;
          token: string;
          platform: string;
          created_at?: string;
        }>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
