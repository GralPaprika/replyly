export interface WhatsappMessage {
  whatsappConversationId: string,
  content: string,
  sentAt: Date,
  whatsappMessageId: string,
  whapiChatId: string,
  status: number,
  source: number,
}