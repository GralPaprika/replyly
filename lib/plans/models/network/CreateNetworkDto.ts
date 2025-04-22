export interface CreateNetworkDto {
  name: string;
}

export const createNetworkDtoSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
}