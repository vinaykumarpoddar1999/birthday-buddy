export type GreetingCard = {
  id: string;
  template_id: string | null;
  contact_id: string;
  image_url: string | null;
  created_at: string;
};

export type CreateCardParams = {
  contactId: string;
  templateId?: string;
  message?: string;
};
