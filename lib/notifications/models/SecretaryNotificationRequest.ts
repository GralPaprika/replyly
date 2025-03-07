export interface SecretaryNotificationRequest {
  userId: string;
  secretaryId: string;
  message: string;
}

export const secretaryNotificationRequestSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    secretaryId: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['userId', 'secretaryId', 'message'],
  additionalProperties: false,
}