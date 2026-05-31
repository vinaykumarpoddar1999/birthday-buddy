export type { Database, Json } from './database';

export type ID = string;

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
