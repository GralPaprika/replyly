import {NotificationRepository} from "@/lib/notifications/models/NotificationRepository";
import {SendMessageToClientUseCase} from "@/lib/whatsapp/useCases/SendMessageToClientUseCase";

export class SendSecretaryNotificationUseCase {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly sendMessageToClientUseCase: SendMessageToClientUseCase,
  ) {}

  async execute(secretaryId: string, userId: string, message: string): Promise<void> {
    try {
      const {businessId, userWhatsappId, ephemeralExpiration} =
        await this.repository.getSecretaryConversationInfo(secretaryId, userId);

      if (await this.repository.hasReminderNotification(businessId)) {
        await this.sendMessageToClientUseCase.execute(
          secretaryId,
          userWhatsappId,
          message,
          ephemeralExpiration ?? undefined
        );

        await this.repository.increaseReminderCount(businessId);
      }

    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}