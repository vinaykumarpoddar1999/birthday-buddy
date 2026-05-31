export type GiftSuggestion = {
  id: string;
  contactId: string;
  suggestions: string[];
  createdAt: string;
};

export type SuggestGiftsParams = {
  contactId: string;
  contactName: string;
  age?: number;
  interests?: string;
};
