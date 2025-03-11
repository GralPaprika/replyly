export interface BotWebhookRequest {
  businessId: string,
  chatId: string,
  whatsappId: string,
  countryCode: string,
  message?: string,
}