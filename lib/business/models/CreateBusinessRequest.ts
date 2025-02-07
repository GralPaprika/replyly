export interface CreateBusinessRequest {
  businessName: string;
  email: string;
  phoneNumber: string,
  firstName: string;
  lastName: string;
  secondLastName?: string;
  displayName: string;
  address: string;
  schedule: string;
}