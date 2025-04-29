export interface CreatePlanDto {
  name: string;
  displayName: string;
  description: string;
  price: string;
  messagesLimit: number;
  notificationsLimit: number;
  regionId: string;
  currencyId: number;
}

export const createPlanDtoSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    displayName: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'string' },
    messagesLimit: { type: 'number' },
    notificationsLimit: { type: 'number' },
    regionId: { type: 'string' },
    currencyId: { type: 'number' },
  },
  required: ['name', 'displayName', 'description', 'price', 'messagesLimit', 'notificationsLimit', 'regionId', 'currencyId'],
  additionalProperties: false,
}