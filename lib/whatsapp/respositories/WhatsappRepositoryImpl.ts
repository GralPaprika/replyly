import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import {whatsapp} from "@/db/schema/whatsapp";
import {and, eq} from "drizzle-orm";
import {businessLocations} from "@/db/schema/businessLocations";
import {businessPlan} from "@/db/schema/businessPlan";
import {isFalse, isTrue} from "@/lib/common/helpers/DatabaseFunctions";
import {networksPerBusiness} from "@/db/schema/networksPerBusiness";
import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {RepositoryException, WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {whatsappConversation} from "@/db/schema/whatsappConversation";
import {whatsappContacts} from "@/db/schema/whatsappContacts";

enum ErrorMessage {
  ConversationStatusNotFound = 'Conversation status not found',
}

export class WhatsappRepositoryImpl implements WhatsappRepository {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  getPlansByWhatsappId(whatsappId: string): Promise<{
    planId: string,
    startDate: Date,
    endDate: Date,
    messagesLimit: number | null
  }[]> {
    return this.db
      .select({
        planId: businessPlan.id,
        startDate: businessPlan.startDate,
        endDate: businessPlan.endDate,
        messagesLimit: businessPlan.limit,
      })
      .from(whatsapp)
      .innerJoin(
        businessLocations,
        and(eq(whatsapp.businessesLocationId, businessLocations.id), isFalse(businessLocations.deleted)),
      )
      .innerJoin(
        businessPlan,
        and(eq(businessLocations.businessId, businessPlan.businessId), isTrue(businessPlan.active)),
      )
      .innerJoin(
        networksPerBusiness,
        and(
          eq(networksPerBusiness.businessId, businessPlan.businessId),
          and(isTrue(networksPerBusiness.active), isFalse(networksPerBusiness.deleted)),
        ),
      )
      .where(and(eq(whatsapp.id, whatsappId), isFalse(whatsapp.deleted)))
      .execute()
  }

  async deactivateBusinessPlan(planId: string): Promise<void> {
    await this.db
      .update(businessPlan)
      .set({active: false})
      .where(eq(businessPlan.id, planId))
      .execute()
  }

  async getConversationStatus(conversationId: string): Promise<number> {
    const result = await this.db
      .select({
        status: whatsappConversation.conversationStatus,
      })
      .from(whatsappConversation)
      .where(and(eq(whatsappConversation.id, conversationId), isFalse(whatsapp.deleted)))
      .execute()

    if (result.length === 0)
      throw new RepositoryException(ErrorMessage.ConversationStatusNotFound.valueOf())

    return result[0].status
  }

  async updateConversationStatus(conversationId: string, status: ConversationStatus): Promise<void> {
    await this.db
      .update(whatsappConversation)
      .set({conversationStatus: status})
      .where(eq(whatsappConversation.id, conversationId))
      .execute()
  }

  async getBusinessLocationByWhatsappId(whatsappId: string): Promise<string> {
    return (await this.db
        .select({
          businessLocationId: businessLocations.id,
        })
        .from(whatsapp)
        .innerJoin(
          businessLocations,
          and(eq(whatsapp.businessesLocationId, businessLocations.id), isFalse(businessLocations.deleted)),
        )
        .where(and(eq(whatsapp.id, whatsappId), isFalse(whatsapp.deleted)))
        .execute()
    )[0].businessLocationId
  }

  async increaseMessageCountUsage(whatsappId: string, amount: number): Promise<void> {
    const plan = (await this.db
      .select({
        businessId: businessPlan.businessId,
        usage: businessPlan.usage,
      })
      .from(whatsapp)
      .innerJoin(
        businessLocations,
        and(eq(businessLocations.id, whatsapp.businessesLocationId), isFalse(businessLocations.deleted)),
      )
      .innerJoin(
        businessPlan,
        and(eq(businessPlan.businessId, businessLocations.businessId), isFalse(whatsapp.deleted)),
      )
      .where(eq(whatsapp.id, whatsappId))
      .execute())[0]

    await this.db
      .update(businessPlan)
      .set({usage: plan.usage + amount})
      .where(and(eq(businessPlan.businessId, plan.businessId), isTrue(businessPlan.active)))
      .execute()
  }

  async getConversationId(whatsappId: string, chatId: string): Promise<string> {
    return (await this.db
        .select({
          conversationId: whatsappConversation.id,
        })
        .from(whatsappConversation)
        .where(
          and(
            eq(whatsappConversation.whatsappId, whatsappId),
            eq(whatsappConversation.chatId, chatId),
            isFalse(whatsappConversation.deleted),
          ),
        )
        .execute()
    )[0].conversationId
  }

  async getBusinessHours(whatsappId: string): Promise<object> {
    return await this.db
      .select({
        businessHours: businessLocations.schedule,
      })
      .from(businessLocations)
      .innerJoin(whatsapp, eq(whatsapp.businessesLocationId, businessLocations.id))
      .where(eq(whatsapp.id, whatsappId))
      .execute()
  }

  async isNumberBlackListed(whatsappId: string, number: string): Promise<boolean> {
    const result = await this.db
      .select({})
      .from(whatsappContacts)
      .where(and(
        eq(whatsappContacts.whatsappId, number),
        eq(whatsappContacts.whatsappId, whatsappId),
      ))
      .execute()

    return result.length > 0
  }
}