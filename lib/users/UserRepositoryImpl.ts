import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import { users } from "@/db/schema/users";
import {and, eq} from "drizzle-orm";
import {UserRepository} from "@/lib/users/models/UserRepository";
import {FindUserDto} from "@/lib/users/models/FindUserDto";
import {UserSchema} from "@/lib/users/models/UserSchema";
import {businessUsersLocations} from "@/db/schema/businessUsersLocations";
import { businessLocations } from "@/db/schema/businessLocations";
import {isFalse} from "@/lib/common/helpers/DatabaseFunctions";

enum ErrorMessages {
  FailedToCreateUser = 'Failed to create user',
  FailedToUpdateUser = 'Failed to update user',
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PostgresJsDatabase) {}

  async getUserByPhone(phone: string): Promise<FindUserDto | null> {
    const result = await this.db
      .select({id: users.id, businessId: users.businessId})
      .from(users)
      .where(eq(users.phoneNumber, phone))
      .execute();

    if (result.length === 0)
      return null

    return { id: result[0].id, businessId: result[0].businessId ?? '' }
  }

  async createUser(user: UserSchema): Promise<string> {
    const result = await this.db
      .insert(users)
      .values(user)
      .returning({ id: users.id })

    if (result.length === 0)
      throw new Error(ErrorMessages.FailedToCreateUser)

    const userBusinessLocations = (await this.db
      .select({id: businessLocations.id})
      .from(businessLocations)
      .where(and(eq(businessLocations.businessId, user.businessId), isFalse(businessLocations.deleted)))
      .execute())
      .map(location =>
        ({ businessUserId: result[0].id, businessLocationId: location.id })
      )

    await this.db
      .insert(businessUsersLocations)
      .values(userBusinessLocations)

    return result[0].id
  }

  async updateUserBusiness(userId: string, businessId: string): Promise<string> {
    const result = await this.db
      .update(users)
      .set({businessId})
      .where(eq(users.id, userId))
      .returning({ id: users.id })

    if (result.length === 0)
      throw new Error(ErrorMessages.FailedToUpdateUser)

    await this.db
      .delete(businessUsersLocations)
      .where(eq(businessUsersLocations.businessUserId, userId))

    const userBusinessLocations = (await this.db
      .select({id: businessLocations.id})
      .from(businessLocations)
      .where(and(eq(businessLocations.businessId, businessId), isFalse(businessLocations.deleted)))
      .execute())
      .map(location =>
        ({ businessUserId: result[0].id, businessLocationId: location.id })
      )

    await this.db
      .insert(businessUsersLocations)
      .values(userBusinessLocations)

    return result[0].id
  }
}