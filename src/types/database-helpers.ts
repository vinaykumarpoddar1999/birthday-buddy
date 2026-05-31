import type { Json } from './database';

/** Supabase v2 requires Relationships on each table for insert/select inference */
export type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type { Json };
