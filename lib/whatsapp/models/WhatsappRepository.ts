import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {ScheduleTime} from "@/lib/common/models/ScheduleTime";
import {User} from "@/lib/whatsapp/models/User";
import {BusinessDto} from "@/lib/whatsapp/models/BusinessDto";

export interface WhatsappRepository {
  /**
   * Get the plans of a business related to a specific whatsapp channel.
   * @param whatsappId
   * @returns {Promise<{
   *   plandId: string,
   *   startDate: Date,
   *   endDate: Date,
   *   messagesLimit: number | null
   * }[]>}
   */
  getPlansByWhatsappId(whatsappId: string): Promise<{
    planId: string,
    startDate: Date,
    endDate: Date,
    messagesLimit: number | null
  }[]>

  /**
   * Deactivates a plan for a business
   * @param planId
   */
  deactivateBusinessPlan(planId: string): Promise<void>

  /**
   * Get the status of a conversation.
   * @param conversationId
   * @returns {Promise<number>} number indicating the status of the conversation
   * @throws RepositoryException if the conversation status is not found
   */
  getConversationStatus(conversationId: string): Promise<number>

  /**
   * Updates the status of a whatsapp conversation
   * @param conversationId {string}
   * @param status {ConversationStatus}
   */
  updateConversationStatus(conversationId: string, status: ConversationStatus): Promise<void>

  /**
   * Retrieves the business location associated with a whatsapp channel
   * @param whatsappId {string}
   */
  getBusinessLocationByWhatsappId(whatsappId: string): Promise<string>

  /**
   * Increases the message count usage of a whatsapp channel.
   * @param whatsappId Whatsapp channel ID
   * @param amount Amount to increase the message count usage.
   */
  increaseMessageCountUsage(whatsappId: string, amount: number): Promise<void>

  getConversationId(whatsappId: string, chatId: string): Promise<string | null>

  getWhatsappPhoneNumber(whatsappId: string): Promise<string>

  getBusinessHours(businessLocationId: string): Promise<object>

  isNumberBlackListed(whatsappId:string, contactId: string): Promise<boolean>

  createConversation(whatsappId: string, chatId: string): Promise<string>;

  getClientId(whatsappChatId: string): Promise<string|null>;

  createClient(whatsappChatId: string): Promise<string>;

  scheduleBotReset(id: string, time: ScheduleTime): Promise<void>;

  getBusinessId(whatsappId: string): Promise<string>;

  updateEphemeralExpiration(whatsappId: string, clientId: string, expiration: number | null): Promise<void>;

  updateEphemeralExpirationSecretary(secretaryId: string, userId: string, expiration: number | null): Promise<void>;

  isSecretaryUser(remoteUserId: string): Promise<boolean>;

  getSecretaryPhoneNumber(secretaryId: string): Promise<string>;

  getUserFromWhatsappJid(remoteUserJid: string): Promise<User | null>;

  getBusinessWithWhatsappsFromUser(userId: string): Promise<BusinessDto>;
}
