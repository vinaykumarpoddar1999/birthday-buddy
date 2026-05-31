export type Memory = {
  id: string;
  contact_id: string;
  caption: string | null;
  image_url: string | null;
  created_at: string;
};

export type CreateMemoryInput = {
  contact_id: string;
  caption?: string;
  image_url?: string;
};
