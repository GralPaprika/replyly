import { CreateNetworkDto } from "../models/network/CreateNetworkDto";
import {PlansRepository} from "../models/PlansRepository";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import {network} from "@/db/schema/network";
import {and, eq} from "drizzle-orm";
import {isFalse} from "@/lib/common/helpers/DatabaseFunctions";
import {CreatePlanDto} from "@/lib/plans/models/CreatePlanDto";
import {plans} from "@/db/schema/plans";
import {Plan} from "@/lib/plans/models/Plan";
import {currencies} from "@/db/schema/currencies";

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

  async createPlan(data: CreatePlanDto): Promise<{ id: string; }> {
    const result = await this.db
      .insert(plans)
      .values(data)
      .returning({ id: plans.id })
      .execute()

    return { id: result[0].id }
  }

  async getPlanById(id: string): Promise<Plan | null> {
    const result = await this.db
      .select({
        id: plans.id,
        name: plans.name,
        displayName: plans.displayName,
        description: plans.description,
        price: plans.price,
        currency: {
          id: currencies.id,
          name: currencies.name,
          symbol: currencies.symbol,
          code: currencies.code,
        },
        messagesLimit: plans.messagesLimit,
        notificationsLimit: plans.notificationsLimit,
        regionId: plans.regionId,
        deleted: plans.deleted,
        createdAt: plans.createdAt,
        currencyName: currencies.name,
      })
      .from(plans)
      .innerJoin(currencies, and(eq(plans.currencyId, currencies.id), isFalse(currencies.deleted)))
      .where(and(eq(plans.id, id), isFalse(plans.deleted)))
      .execute()

    if (result.length === 0) {
      return null
    }

    return result[0] as Plan
  }
}