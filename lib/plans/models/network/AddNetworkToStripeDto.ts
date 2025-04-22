export interface AddNetworkToStripeDto {
  networkId: string;
}

export const addNetworkToStripeDtoSchema = {
  type: 'object',
  properties: {
    networkId: { type: 'string' },
  },
  required: ['networkId'],
  additionalProperties: false,
}