export interface CreatePlanDto {
  name: string;
  description: string;
  price: string;
  messagesLimit: number;
  notificationsLimit: number;
  regionId: string;
  enumId: number;
}

export const createPlanDtoSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'string' },
    messagesLimit: { type: 'number' },
    notificationsLimit: { type: 'number' },
    regionId: { type: 'string' },
    enumId: { type: 'number' },
  },
  required: ['name', 'description', 'price', 'messagesLimit', 'notificationsLimit', 'regionId', 'enumId'],
  additionalProperties: false,
}