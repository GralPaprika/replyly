import {AppComposition} from "@/composition/AppComposition";
import {NotificationRepository} from "@/lib/notifications/models/NotificationRepository";
import {NotificationRepositoryImpl} from "@/lib/notifications/repository/NotificationRepositoryImpl";
import {SendMessageToClientUseCase} from "@/lib/whatsapp/useCases/SendMessageToClientUseCase";
import {SendReminderNotificationUseCase} from "@/lib/notifications/usecase/SendReminderNotificationUseCase";
import {reminderNotificationRequestSchema} from "@/lib/notifications/models/ReminderNotificationRequest";
import {ValidateFunction} from "ajv";
import {IsReminderNotificationRequestDataUseCase} from "@/lib/notifications/usecase/IsReminderNotificationRequestDataUseCase";

export class NotificationComposition {
  private readonly appCompositionRoot: AppComposition
  private notificationRepository!: NotificationRepository
  private sendMessageToClientUseCase!: SendMessageToClientUseCase
  private sendReminderNotificationUseCase!: SendReminderNotificationUseCase
  private reminderRequestValidator!: ValidateFunction
  private isReminderNotificationRequestDataUseCase!: IsReminderNotificationRequestDataUseCase

  constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): NotificationComposition {
    return new NotificationComposition(AppComposition.getInstance())
  }

  provideNotificationRepository(): NotificationRepository {
    return this.notificationRepository ??= new NotificationRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  private provideSendMessageToClientUseCase(): SendMessageToClientUseCase {
    return this.sendMessageToClientUseCase ??= new SendMessageToClientUseCase()
  }

  provideSendReminderNotificationUseCase() {
    return this.sendReminderNotificationUseCase ??= new SendReminderNotificationUseCase(
      this.provideNotificationRepository(),
      this.provideSendMessageToClientUseCase(),
    )
  }

  private provideReminderRequestValidator(): ValidateFunction {
    return this.reminderRequestValidator ??= this.appCompositionRoot.getAjv().compile(reminderNotificationRequestSchema)
  }

  provideIsReminderNotificationRequestDataUseCase() {
    return this.isReminderNotificationRequestDataUseCase ??=
      new IsReminderNotificationRequestDataUseCase(this.provideReminderRequestValidator())
  }
}