export type Birthday = {
  id: string;
  contact_id: string;
  birth_date: string;
  reminder_days: number[] | null;
  created_at: string;
};

export type CreateBirthdayInput = {
  contact_id: string;
  birth_date: string;
  reminder_days?: number[];
};
