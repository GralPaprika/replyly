export interface BotSecretaryTextRequest {
  userId: string;
  secretaryId: string;
  businessId: string;
  countryCode: string;
  whatsappIds: string[];
  message: string;
}