import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import {businessPlan} from "@/db/schema/businessPlan";
import {and, eq} from "drizzle-orm";
import {RepositoryException} from "@/lib/common/models/RepositoryException";
import {isFalse, isTrue} from "@/lib/common/helpers/DatabaseFunctions";
import {NotificationRepository} from "@/lib/notifications/models/NotificationRepository";
import {whatsappConversation} from "@/db/schema/whatsappConversation";
import {whatsapp} from "@/db/schema/whatsapp";
import {businessLocations} from "@/db/schema/businessLocations";
import {clients} from "@/db/schema/clients";
import {ChatInfo} from "@/lib/notifications/models/ChatInfo";

const enum ErrorMessage {
  ErrorGettingChatInfo = 'Error getting chat info',
  BusinessPlanNotFound = 'Business plan not found',
}

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly db: PostgresJsDatabase) {}

  async getChatInfo(whatsappId: string, clientId: string): Promise<ChatInfo> {
    const result = await this.db
      .select({
        businessId: businessLocations.businessId,
        clientWhatsappId: clients.whatsappId,
        ephemeralExpiration: whatsappConversation.ephemeralExpiration,
      })
      .from(whatsappConversation)
      .innerJoin(clients, and(eq(clients.id, whatsappConversation.clientId), isFalse(clients.deleted)))
      .innerJoin(whatsapp, and(eq(whatsapp.id, whatsappConversation.whatsappId), isFalse(whatsapp.deleted)))
      .innerJoin(businessLocations, and(eq(businessLocations.id, whatsapp.businessLocationId), isFalse(businessLocations.deleted)))
      .where(and(eq(whatsappConversation.whatsappId, whatsappId), eq(whatsappConversation.clientId, clientId)))
      .execute();

    if (result.length <= 0)
      throw new RepositoryException(ErrorMessage.ErrorGettingChatInfo);

    return result[0];
  }

  async hasReminderNotification(businessId: string): Promise<boolean> {
    const result = await this.db
      .select({
        reminderUsage: businessPlan.remindersUsage,
        reminderLimit: businessPlan.reminderLimit
      })
      .from(businessPlan)
      .where(and(eq(businessPlan.businessId, businessId), isTrue(businessPlan.active)))
      .execute();

    if (result.length <= 0)
      throw new RepositoryException(ErrorMessage.BusinessPlanNotFound);

    const { reminderUsage, reminderLimit } = result[0];

    return reminderUsage < (reminderLimit ?? Number.MAX_VALUE);
  }

  async increaseReminderCount(businessId: string): Promise<void> {
    const result = await this.db
      .select({
        reminderUsage: businessPlan.remindersUsage,
      })
      .from(businessPlan)
      .where(eq(businessPlan.businessId, businessId))
      .execute();

    if (result.length <= 0)
      throw new RepositoryException(ErrorMessage.BusinessPlanNotFound);

    const { reminderUsage } = result[0];

    await this.db
      .update(businessPlan)
      .set({ remindersUsage: reminderUsage + 1 })
      .where(and(eq(businessPlan.businessId, businessPlan.businessId), isTrue(businessPlan.active)))
      .execute();
  }
}