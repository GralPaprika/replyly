import {NotificationRepository} from "@/lib/notifications/models/NotificationRepository";
import {SendMessageToClientUseCase} from "@/lib/whatsapp/useCases/SendMessageToClientUseCase";

export class SendReminderNotificationUseCase {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly sendMessageToClientUseCase: SendMessageToClientUseCase,
  ) {}

  async execute(whatsappId: string, clientId: string, message: string): Promise<void> {
    try {
      const {businessId, clientWhatsappId, ephemeralExpiration} = await this.repository.getChatInfo(whatsappId, clientId);

      if (await this.repository.hasReminderNotification(businessId)) {
        await this.sendMessageToClientUseCase.execute(
          whatsappId,
          clientWhatsappId,
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