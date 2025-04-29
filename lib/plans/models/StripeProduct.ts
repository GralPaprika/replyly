export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  metadata: {
    messagesLimit: number;
    notificationsLimit: number;
    regionId: string;
    replylyName: string;
  };
  default_price_data: {
    currency: string;
    unit_amount: number;
    recurring: {
      interval: string;
      interval_count: number;
    }
  }
}