import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import {whatsapp} from "@/db/schema/whatsapp";
import {and, eq, sql} from "drizzle-orm";
import {businessLocations} from "@/db/schema/businessLocations";
import {businessPlan} from "@/db/schema/businessPlan";
import {contains, isFalse, isTrue} from "@/lib/common/helpers/DatabaseFunctions";
import {networksPerBusiness} from "@/db/schema/networksPerBusiness";
import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {whatsappConversation} from "@/db/schema/whatsappConversation";
import {whatsappContacts} from "@/db/schema/whatsappContacts";
import {clients} from "@/db/schema/clients";
import DateFormatter from "date-and-time";
import {ScheduleTime} from "@/lib/common/models/ScheduleTime";
import {RepositoryException} from "@/lib/common/models/RepositoryException";
import {secretaries} from "@/db/schema/secretaries";
import {users} from "@/db/schema/users";
import {User} from "@/lib/whatsapp/models/User";
import {businessUsersLocations} from "@/db/schema/businessUsersLocations";
import {whatsappSecretaryConversation} from "@/db/schema/whatsappSecretaryConversation";
import {BusinessDto} from "@/lib/whatsapp/models/BusinessDto";

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
        and(eq(whatsapp.businessLocationId, businessLocations.id), isFalse(businessLocations.deleted)),
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
      .where(and(eq(whatsappConversation.id, conversationId), isFalse(whatsappConversation.deleted)))
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
          and(eq(whatsapp.businessLocationId, businessLocations.id), isFalse(businessLocations.deleted)),
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
        and(eq(businessLocations.id, whatsapp.businessLocationId), isFalse(businessLocations.deleted)),
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

  async getConversationId(whatsappId: string, clientId: string): Promise<string | null> {
    const result = await this.db
        .select({
          conversationId: whatsappConversation.id,
        })
        .from(whatsappConversation)
        .where(
          and(
            eq(whatsappConversation.whatsappId, whatsappId),
            eq(whatsappConversation.clientId, clientId),
            isFalse(whatsappConversation.deleted),
          ),
        )
        .execute()

    return result.length > 0 ? result[0].conversationId : null
  }

  async getBusinessHours(whatsappId: string): Promise<object> {
    return await this.db
      .select({
        businessHours: businessLocations.schedule,
      })
      .from(businessLocations)
      .innerJoin(whatsapp, eq(whatsapp.businessLocationId, businessLocations.id))
      .where(eq(whatsapp.id, whatsappId))
      .execute()
  }

  async isNumberBlackListed(whatsappId: string, contactId: string): Promise<boolean> {
    const result = await this.db
      .select({})
      .from(whatsappContacts)
      .where(and(
        eq(whatsappContacts.contactId, contactId),
        eq(whatsappContacts.whatsappId, whatsappId),
      ))
      .execute()

    return result.length > 0
  }

  async createConversation(whatsappId: string, clientId: string): Promise<string> {
    const result = await this.db
      .insert(whatsappConversation)
      .values({
        whatsappId,
        clientId,
        conversationStatus: ConversationStatus.MessageReceived,
      })
      .returning({ id: whatsappConversation.id })

    return result[0].id
  }

  async getClientId(whatsappChatId: string): Promise<string|null> {
    const result = await this.db
      .select({
        clientId: clients.id,
      })
      .from(clients)
      .where(
        and(
          eq(clients.remoteJid, whatsappChatId),
          isFalse(clients.deleted),
        ),
      )
      .execute()

    return result.length > 0 ? result[0].clientId : null
  }

  async createClient(whatsappChatId: string): Promise<string> {
    const result = await this.db
      .insert(clients)
      .values({
        remoteJid: whatsappChatId,
      })
      .returning({ id: clients.id })

    return result[0].id
  }

  async scheduleBotReset(id: string, time: ScheduleTime) {
    const resultJobId = await this.db
      .select({scheduledResetId: whatsappConversation.scheduledResetId})
      .from(whatsappConversation)
      .where(and(
        eq(whatsappConversation.id, id),
        isFalse(whatsappConversation.deleted),
      ))
      .execute()

    console.log('schedule job', resultJobId)

    if (!resultJobId.length) {
      return
    }

    if (resultJobId[0].scheduledResetId !== null) {
      const query = `SELECT cron.unschedule('${resultJobId[0].scheduledResetId}')`
      console.log(query)
      const result = await this.db.execute(sql.raw(query))
      if (!result || !result[0]['unschedule']) {
        throw new Error('Error unscheduling task')
      }
    }

    const querySchedule = this.getScheduleResetQuery(id, time)
    console.log('querySchedule', querySchedule)
    const result = await this.db.execute(sql.raw(querySchedule));

    console.log('schedule job - result', result)
    if (!result) {
      throw new Error('Error scheduling task')
    }

    await this.db.update(whatsappConversation)
      .set({scheduledResetId: id})
      .where(eq(whatsappConversation.id, id))
      .execute()
  }

  async getBusinessId(whatsappId: string): Promise<string> {
    const result = await this.db
      .select({
        businessId: businessLocations.businessId,
      })
      .from(whatsapp)
      .innerJoin(
        businessLocations,
        eq(whatsapp.businessLocationId, businessLocations.id)
      )
      .where(
        and(eq(whatsapp.id, whatsappId),
         and(
          isFalse(whatsapp.deleted),
          isFalse(businessLocations.deleted)
         ))
      )
      .execute()

    return result[0].businessId
  }

  async updateEphemeralExpiration(whatsappId: string, clientId: string, expiration: number | null): Promise<void> {
    await this.db
      .update(whatsappConversation)
      .set({ephemeralExpiration: expiration})
      .where(and(and(eq(whatsappConversation.whatsappId, whatsappId), eq(whatsappConversation.clientId, clientId)), isFalse(whatsappConversation.deleted)))
      .execute()
  }

  async updateEphemeralExpirationSecretary(secretaryId: string, userId: string, expiration: number | null): Promise<void> {
    const conversation = await this.db.select({ id: whatsappSecretaryConversation.id })
      .from(whatsappSecretaryConversation)
      .where(and(
        and(eq(whatsappSecretaryConversation.secretaryId, secretaryId), eq(whatsappSecretaryConversation.userId, userId)),
        isFalse(whatsappSecretaryConversation.deleted)
      ))
      .execute()

    if (conversation.length === 0) {
      const result = await this.db
        .insert(whatsappSecretaryConversation)
        .values({secretaryId, userId, ephemeralExpiration: expiration})
        .returning({ id: whatsappSecretaryConversation.id })

      if (result.length === 0) {
        throw new Error('Error updating ephemeral expiration')
      }

      return
    }

    await this.db
      .update(whatsappSecretaryConversation)
      .set({ephemeralExpiration: expiration})
      .where(eq(whatsappSecretaryConversation.id, conversation[0].id))
      .execute()
  }

  async isSecretaryUser(sessionId: string): Promise<boolean> {
    return (await this.db
      .select({ id: secretaries.id })
      .from(secretaries)
      .where(and(eq(secretaries.id, sessionId), isFalse(secretaries.deleted)))
      .execute()).length === 1
  }

  async getUserFromWhatsappJid(remoteUserJid: string): Promise<User | null> {
    let result;

    result = await this.db
      .select({
        id: users.id,
        role: users.roleId,
        businessId: users.businessId,
      })
      .from(users)
      .where(and(eq(users.whatsappJid, remoteUserJid), isFalse(users.deleted)))
      .execute()

    if (result.length > 0) {
      return result[0];
    }

    result = await this.db
      .select({
        id: users.id,
        role: users.roleId,
        businessId: users.businessId,
      })
      .from(users)
      .where(and(contains(users.phoneNumber, remoteUserJid), isFalse(users.deleted)))
      .execute()

    if (result.length > 0) {
      const user = result[0]
      await this.db.update(users)
        .set({whatsappJid: remoteUserJid})
        .where(eq(users.id, user.id))
        .execute()
      return user;
    }

    return null
  }

  async getBusinessWithWhatsappsFromUser(userId: string): Promise<BusinessDto> {
    const result = (await this.db
      .select({
        businessId: users.businessId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .execute());

    if (result.length === 0 || !result[0].businessId) {
      throw new Error('Business not found');
    }

    const whatsapps = (await this.db
      .select({
        whatsappId: whatsapp.businessLocationId,
      })
      .from(businessUsersLocations)
      .innerJoin(whatsapp, and(eq(whatsapp.businessLocationId, businessUsersLocations.businessLocationId), isFalse(whatsapp.deleted)))
      .where(and(eq(businessUsersLocations.businessUserId, userId), isFalse(businessUsersLocations.deleted)))
      .execute())
      .map((o) => o.whatsappId)

    return { id: result[0].businessId, whatsapps }
  }

  private getScheduleResetQuery(id: string, time: ScheduleTime) {
    return `SELECT cron.schedule('${id}', '${this.dateForCron(time)}', $$
      UPDATE public.whatsapp_conversation SET conversation_status = 0, scheduled_reset_id = null WHERE id = '${id}'; SELECT cron.unschedule('${id}');
    $$);`
  }

  private dateForCron(time: ScheduleTime): string {
    let date = new Date()
    date = DateFormatter.addSeconds(date, 0)
    date = DateFormatter.addMinutes(date, time.minutes || 0)
    date = DateFormatter.addHours(date, time.hours || 0)
    date = DateFormatter.addDays(date, time.dayOfMonth || 0)
    date = DateFormatter.addMonths(date, time.month || 0)
    date = new Date(DateFormatter.format(date, 'YYYY-MM-DDTHH:mm:ss', true))

    return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
  }
}