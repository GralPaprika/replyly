import {ReminderNotificationRequest} from "@/lib/notifications/models/ReminderNotificationRequest";
import {NotificationComposition} from "@/composition/NotificationComposition";
import {HttpResponseCode} from "@/lib/common/models/HttpResponseCode";
import {NotificationSentResponse} from "@/lib/notifications/models/NotificationSentResponse";

const enum ErrorMessage {
  ReminderSent = 'Reminder sent',
  ErrorSendingReminder = 'Error sending reminder',
}

export class NotificationController {
  constructor(private readonly composition: NotificationComposition) {}

  async sendReminderNotification(request: ReminderNotificationRequest): Promise<NotificationSentResponse> {
    try {
      const { message, chatId: clientId, whatsappId } = request;
      await this.composition.provideSendReminderNotificationUseCase().execute(whatsappId, clientId, message);

      return {
        body: {message: ErrorMessage.ReminderSent},
        init: {status: HttpResponseCode.Ok},
      }
    } catch (e) {
      console.error(e);
      return {
        body: {error: ErrorMessage.ErrorSendingReminder},
        init: {status: HttpResponseCode.BadRequest},
      }
    }
  }

  isValidData(data: ReminderNotificationRequest): boolean {
    return this.composition.provideIsReminderNotificationRequestDataUseCase().execute(data);
  }
}