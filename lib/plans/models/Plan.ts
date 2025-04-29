export interface Currency {
  id: number;
  name: string;
  symbol: string;
  code: string;
}

export interface Plan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: string;
  messagesLimit: number;
  notificationsLimit: number;
  regionId: string;
  currency: Currency;
  deleted: boolean;
}