export interface BotSecretaryAudioRequest {
  userId: string;
  secretaryId: string;
  businessId: string;
  whatsappIds: string[];
  countryCode: string;
  voice: string;
}