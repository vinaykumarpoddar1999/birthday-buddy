export type Wish = {
  id: string;
  contact_id: string;
  generated_text: string;
  tone: string | null;
  language: string | null;
  created_at: string;
};

export type GenerateWishParams = {
  contactId: string;
  contactName: string;
  tone?: string;
  language?: string;
};
