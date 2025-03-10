export interface UpdateUserBusinessDto {
  userId: string | null;
  phoneNumber: string;
  businessId: string;
}

export const updateUserBusinessDtoSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    phoneNumber: { type: 'string' },
    businessId: { type: 'string' },
  },
  required: [
    'phoneNumber',
    'businessId',
  ],
}