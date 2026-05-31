export type Subscription = {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  expires_at: string | null;
  created_at: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: unknown;
};

export type PurchaseRecord = {
  id: string;
  user_id: string;
  product_id: string;
  platform: string;
  purchased_at: string;
};
