import { CreateNetworkDto } from "../models/network/CreateNetworkDto";
import {PlansRepository} from "../models/PlansRepository";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import {network} from "@/db/schema/network";
import {and, eq} from "drizzle-orm";
import {isFalse} from "@/lib/common/helpers/DatabaseFunctions";

export class PlansRepositoryImpl implements PlansRepository {
  constructor(private readonly db: PostgresJsDatabase) {}

  async createNetwork(data: CreateNetworkDto): Promise<{ id: string; }> {
    const result = await this.db
      .insert(network)
      .values(data)
      .returning({ id: network.id })
      .execute()

    return { id: result[0].id }
  }

  async updateNetworkIsRegisteredInStripeStatus(id: string, isRegistered: boolean): Promise<void> {
    await this.db
      .update(network)
      .set({ isRegisteredInStripe: isRegistered })
      .where(and(eq(network.id, id), isFalse(network.deleted)))
      .execute()
  }

  async getNetworkById(id: string): Promise<Network | null> {
    const result = await this.db
      .select()
      .from(network)
      .where(and(eq(network.id, id), isFalse(network.deleted)))
      .execute()

    if (result.length === 0) {
      return null
    }

    return result[0] as Network
  }
}