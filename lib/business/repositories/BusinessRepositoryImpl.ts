import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import {businesses} from "@/db/schema/businesses";
import {businessPlan} from "@/db/schema/businessPlan";
import {plans} from "@/db/schema/plans";
import {and, eq, sql} from "drizzle-orm";
import {users} from "@/db/schema/users";
import {businessLocations} from "@/db/schema/businessLocations";
import {BusinessLocation} from "@/lib/business/models/BusinessLocation";
import {BusinessUser} from "@/lib/business/models/BusinessUser";
import {Business} from "@/lib/business/models/Business";
import {networksPerBusiness} from "@/db/schema/networksPerBusiness";
import { network } from "@/db/schema/network";
import {businessUsersLocations} from "@/db/schema/businessUsersLocations";
import {isFalse} from "@/lib/common/helpers/DatabaseFunctions";

export class BusinessRepositoryImpl implements BusinessRepository {
  constructor(private readonly db: PostgresJsDatabase) {}

  async createBusiness(business: Business): Promise<string> {
    const result = await this.db
      .insert(businesses)
      .values(business)
      .returning({ id: businesses.id })

    return result[0].id
  }

  async addPlan(businessId: string, planValue: number): Promise<void> {
    const planId = (await this.db
      .select({id: plans.id})
      .from(plans)
      .where(and(eq(plans.enumId, planValue), isFalse(plans.deleted)))
      .execute())[0].id

    const now = sql`now()`
    const nowPlusOneMonth = sql`now() + interval '1 month'`

    await this.db
      .insert(businessPlan)
      .values({
        businessId,
        planId,
        startDate: now,
        endDate: nowPlusOneMonth,
        active: true,
        limit: 1000,
      })
  }

  async addAdmin(user: BusinessUser): Promise<string> {
    const result = await this.db
      .insert(users)
      .values(user)
      .returning({ id: users.id })

    return result[0].id
  }

  async addLocation(location: BusinessLocation): Promise<string> {
    const result = await this.db
      .insert(businessLocations)
      .values(location)
      .returning({ id: businessLocations.id })

    return result[0].id
  }

  async addUserToLocation(locationId: string, userId: string): Promise<void> {
    await this.db.insert(businessUsersLocations).values({
      businessLocationId: locationId,
      businessUserId: userId,
    })
  }

  async addNetwork(businessId: string, networkName: string): Promise<void> {
    const networkId = (await this.db
      .select({id: network.id})
      .from(network)
      .where(and(eq(network.name, networkName), isFalse(network.deleted)))
      .execute()
    )[0].id

    await this.db.insert(networksPerBusiness).values({businessId, networkId})
  }
}
