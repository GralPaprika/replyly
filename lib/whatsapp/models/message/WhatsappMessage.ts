export interface WhatsappMessage {
  whatsappConversationId: string,
  content: string,
  sentAt: Date,
  whapiMessageId: string,
  whapiChatId: string,
  status: number,
  source: number,
}