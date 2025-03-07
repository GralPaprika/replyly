import {AppComposition} from "@/composition/AppComposition";
import {NotificationRepository} from "@/lib/notifications/models/NotificationRepository";
import {NotificationRepositoryImpl} from "@/lib/notifications/repository/NotificationRepositoryImpl";
import {SendMessageToClientUseCase} from "@/lib/whatsapp/useCases/SendMessageToClientUseCase";
import {SendReminderNotificationUseCase} from "@/lib/notifications/usecase/SendReminderNotificationUseCase";
import {reminderNotificationRequestSchema} from "@/lib/notifications/models/ReminderNotificationRequest";
import {ValidateFunction} from "ajv";
import {IsReminderNotificationRequestDataUseCase} from "@/lib/notifications/usecase/IsReminderNotificationRequestDataUseCase";
import {
  IsSecretaryNotificationRequestDataUseCase
} from "@/lib/notifications/usecase/IsSecretaryNotificationRequestDataUseCase";
import {secretaryNotificationRequestSchema} from "@/lib/notifications/models/SecretaryNotificationRequest";
import {SendSecretaryNotificationUseCase} from "@/lib/notifications/usecase/SendSecretaryNotificationUseCase";

export class NotificationComposition {
  private readonly appCompositionRoot: AppComposition
  private notificationRepository!: NotificationRepository
  private sendMessageToClientUseCase!: SendMessageToClientUseCase
  private sendReminderNotificationUseCase!: SendReminderNotificationUseCase
  private sendSecretaryNotificationUseCase!: SendSecretaryNotificationUseCase
  private reminderRequestValidator!: ValidateFunction
  private secretaryRequestValidator!: ValidateFunction
  private isReminderNotificationRequestDataUseCase!: IsReminderNotificationRequestDataUseCase
  private isSecretaryNotificationRequestDataUseCase!: IsSecretaryNotificationRequestDataUseCase

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

  provideSendSecretaryNotificationUseCase() {
    return this.sendSecretaryNotificationUseCase ??= new SendSecretaryNotificationUseCase(
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

  private provideSecretaryRequestValidator(): ValidateFunction {
    return this.secretaryRequestValidator ??= this.appCompositionRoot.getAjv().compile(secretaryNotificationRequestSchema)
  }

  provideIsSecretaryNotificationRequestDataUseCase() {
    return this.isSecretaryNotificationRequestDataUseCase ??=
      new IsSecretaryNotificationRequestDataUseCase(this.provideSecretaryRequestValidator())
  }
}