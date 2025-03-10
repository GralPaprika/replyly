import {BusinessData} from "@/lib/business/models/BusinessData";
import {BusinessLocation} from "@/lib/business/models/BusinessLocation";
import {BusinessUser} from "@/lib/business/models/BusinessUser";
import {SlimBusinessDto} from "@/lib/business/models/SlimBusinessDto";

export interface BusinessRepository {
  createBusiness(business: BusinessData): Promise<string>;
  addPlan(businessId: string, planValue: number): Promise<void>;
  addAdmin(user: BusinessUser): Promise<string>;
  addLocation(location: BusinessLocation): Promise<string>;
  addUserToLocation(locationId: string, userId: string): Promise<void>;
  addNetwork(businessId: string, network: string): Promise<void>;
  addWhatsapp(locationId: string): Promise<string>;
  getAll(): Promise<SlimBusinessDto[]>;
}