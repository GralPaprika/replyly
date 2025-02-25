export interface BusinessData {
  businessName: string;
  email: string;
  phoneNumber: string,
  firstName: string;
  lastName: string;
  secondLastName?: string;
  displayName: string;
  address: string;
  schedule?: string;
  password: string;
}

export const businessDataSchema = {
  type: 'object',
  properties: {
    businessName: { type: 'string' },
    email: { type: 'string' },
    phoneNumber: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    secondLastName: { type: 'string' },
    displayName: { type: 'string' },
    address: { type: 'string' },
    schedule: { type: 'string' },
    password: { type: 'string' },
  },
  required: [
    'businessName',
    'email',
    'phoneNumber',
    'firstName',
    'lastName',
    'displayName',
    'address',
    'password',
  ],
}