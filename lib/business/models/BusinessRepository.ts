import {BusinessSchema} from "@/lib/business/models/BusinessSchema";
import {BusinessLocation} from "@/lib/business/models/BusinessLocation";
import {BusinessUser} from "@/lib/business/models/BusinessUser";

export interface BusinessRepository {
  createBusiness(business: BusinessSchema): Promise<string>;
  addPlan(businessId: string, planValue: number): Promise<void>;
  addAdmin(user: BusinessUser): Promise<string>;
  addLocation(location: BusinessLocation): Promise<string>;
  addUserToLocation(locationId: string, userId: string): Promise<void>;
  addNetwork(businessId: string, network: string): Promise<void>;
}