export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  metadata: {
    messagesLimit: number;
    notificationsLimit: number;
    regionId: string;
  };
  default_price_data: {
    currency: string;
    amount: number;
    recurring: {
      interval: string;
      interval_count: number;
    }
  }
}