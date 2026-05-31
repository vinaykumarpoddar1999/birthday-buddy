export type Contact = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  dob: string | null;
  relationship: string | null;
  notes: string | null;
  created_at: string;
};

export type CreateContactInput = Omit<Contact, 'id' | 'created_at'>;

export type UpdateContactInput = Partial<CreateContactInput> & { id: string };
