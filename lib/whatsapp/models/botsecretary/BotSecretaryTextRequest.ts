export interface BotSecretaryTextRequest {
  userId: string;
  secretaryId: string;
  businessId: string;
  whatsappIds: string[];
  message: string;
}