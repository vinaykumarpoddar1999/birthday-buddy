import { STORAGE_BUCKETS } from '@/constants/app';
import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';

type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: Blob | ArrayBuffer,
  contentType: string,
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw handleApiError(error);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    throw handleApiError(error);
  }
}

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
