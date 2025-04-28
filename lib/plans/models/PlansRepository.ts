import {CreateNetworkDto} from "@/lib/plans/models/network/CreateNetworkDto";
import {CreatePlanDto} from "@/lib/plans/models/CreatePlanDto";
import {Plan} from "@/lib/plans/models/Plan";

export interface PlansRepository {
  createNetwork(data: CreateNetworkDto): Promise<{ id: string }>;
  updateNetworkIsRegisteredInStripeStatus(id: string, isRegistered: boolean): Promise<void>;
  getNetworkById(id: string): Promise<Network | null>;
  createPlan(data: CreatePlanDto): Promise<{ id: string }>;
  getPlanById(id: string): Promise<Plan | null>;
}