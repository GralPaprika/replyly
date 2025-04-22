import {CreateNetworkDto} from "@/lib/plans/models/network/CreateNetworkDto";

export interface PlansRepository {
  createNetwork(data: CreateNetworkDto): Promise<{ id: string }>;
  updateNetworkIsRegisteredInStripeStatus(id: string, isRegistered: boolean): Promise<void>;
  getNetworkById(id: string): Promise<Network | null>;
}