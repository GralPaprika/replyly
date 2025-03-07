import {ChatInfo} from "./ChatInfo";
import {SecretaryConversation} from "@/lib/notifications/models/SecretaryConversation";

export interface NotificationRepository {
  getChatInfo(whatsappId: string, clientId: string): Promise<ChatInfo>;
  getSecretaryConversationInfo(secretaryId: string, userId: string): Promise<SecretaryConversation>
  hasReminderNotification(businessId: string): Promise<boolean>;
  increaseReminderCount(businessId: string): Promise<void>;
}