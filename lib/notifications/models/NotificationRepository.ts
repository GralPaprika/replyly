import { ChatInfo } from "./ChatInfo";

export interface NotificationRepository {
  getChatInfo(whatsappId: string, clientId: string): Promise<ChatInfo>;
  hasReminderNotification(businessId: string): Promise<boolean>;
  increaseReminderCount(businessId: string): Promise<void>;
}