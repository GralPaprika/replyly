export interface ReminderNotificationRequest {
  chatId: string;
  whatsappId: string;
  message: string;
}

export const reminderNotificationRequestSchema = {
  type: 'object',
  properties: {
    chatId: { type: 'string' },
    whatsappId: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['message', 'chatId', 'whatsappId'],
  additionalProperties: false,
}