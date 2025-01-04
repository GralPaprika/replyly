import {AppComposition} from "@/composition/AppComposition";
import {HasActivePlanUseCase} from "@/lib/whatsapp/useCases/HasActivePlanUseCase";
import {GetMessageSourceUseCase} from "@/lib/whatsapp/useCases/GetMessageSourceUseCase";
import {DeactivatePlanUseCase} from "@/lib/whatsapp/useCases/DeactivatePlanUseCase";
import {GetConversationStatusUseCase} from "@/lib/whatsapp/useCases/GetConversationStatusUseCase";
import {StringToMessageStatusMapper} from "@/lib/whatsapp/mappers/StringToMessageStatusMapper";
import {UpdateMessageStatusUseCase} from "@/lib/whatsapp/useCases/UpdateMessageStatusUseCase";
import {UpdateConversationStatusUseCase} from "@/lib/whatsapp/useCases/UpdateConversationStatusUseCase";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {WhatsappRepositoryImpl} from "@/lib/whatsapp/respositories/WhatsappRepositoryImpl";
import {GetBusinessLocationUseCase} from "@/lib/whatsapp/useCases/GetBusinessLocationUseCase";

import {SendMessageToClientUseCase} from "@/lib/whatsapp/useCases/SendMessageToClientUseCase";
import {
  SentMessageResponseSchemaToWhatsappMessageMapper,
} from "@/lib/whatsapp/mappers/SentMessageResponseSchemaToWhatsappMessageMapper";
import {SaveSentMessageUseCase} from "@/lib/whatsapp/useCases/SaveSentMessageUseCase";
import {IncreaseMessageCountUsageUseCase} from "@/lib/whatsapp/useCases/IncreaseMessageCountUsageUseCase";
import {GetConversationIdUseCase} from "@/lib/whatsapp/useCases/GetConversationIdUseCase";
import {IsTimeWithinLocationBusinessHoursUseCase} from "@/lib/whatsapp/useCases/IsTimeWithinLocationBusinessHoursUseCase";
import {IsNumberBlackListedUseCase} from "@/lib/whatsapp/useCases/IsNumberBlackListedUseCase";

export class WhatsappRouteComposition {
  private readonly appCompositionRoot: AppComposition
  private whatsappRepository!: WhatsappRepository
  private hasActivePlanUseCase!: HasActivePlanUseCase
  private getMessageSourceUseCase!: GetMessageSourceUseCase
  private getConversationStatusUseCase!: GetConversationStatusUseCase
  private stringToMessageStatusMapper!: StringToMessageStatusMapper
  private updateMessageStatusUseCase!: UpdateMessageStatusUseCase
  private updateConversationStatusUseCase!: UpdateConversationStatusUseCase
  private getBusinessLocationUseCase!: GetBusinessLocationUseCase
  private sendMessageToClientUseCase!: SendMessageToClientUseCase
  private sentMessageResponseSchemaToWhatsappMessageMapper!: SentMessageResponseSchemaToWhatsappMessageMapper
  private saveSentMessageUseCase!: SaveSentMessageUseCase
  private increaseMessageCountUseCase!: IncreaseMessageCountUsageUseCase
  private getConversationIdUseCase!: GetConversationIdUseCase
  private timeWithinLocationBusinessHoursUseCase!: IsTimeWithinLocationBusinessHoursUseCase
  private isNumberBlackListedUseCase!: IsNumberBlackListedUseCase

  constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): WhatsappRouteComposition {
    return new WhatsappRouteComposition(AppComposition.getInstance())
  }

  private provideWhatsappRepository(): WhatsappRepository {
    return this.whatsappRepository ??= new WhatsappRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  private provideDeactivatePlanUseCase(): DeactivatePlanUseCase {
    return new DeactivatePlanUseCase(this.provideWhatsappRepository())
  }

  provideHasActivePlanUseCase(): HasActivePlanUseCase {
    return this.hasActivePlanUseCase ??=
      new HasActivePlanUseCase(
        this.provideWhatsappRepository(),
        this.provideDeactivatePlanUseCase()
      )
  }

  provideGetMessageSourceUseCase() {
    return this.getMessageSourceUseCase ??= new GetMessageSourceUseCase(this.provideWhatsappRepository())
  }

  provideGetConversationStatusUseCase(): GetConversationStatusUseCase {
    return this.getConversationStatusUseCase ??= new GetConversationStatusUseCase(this.provideWhatsappRepository())
  }

  provideStringToMessageStatusMapper(): StringToMessageStatusMapper {
    return this.stringToMessageStatusMapper ??= new StringToMessageStatusMapper()
  }

  provideUpdateMessageStatusUseCase(): UpdateMessageStatusUseCase {
    return this.updateMessageStatusUseCase ??= new UpdateMessageStatusUseCase(this.provideWhatsappRepository())
  }

  provideUpdateConversationStatusUseCase(): UpdateConversationStatusUseCase {
    return this.updateConversationStatusUseCase ??= new UpdateConversationStatusUseCase(this.provideWhatsappRepository())
  }

  provideGetBusinessLocationUseCase(): GetBusinessLocationUseCase {
    return this.getBusinessLocationUseCase ??= new GetBusinessLocationUseCase(this.provideWhatsappRepository())
  }

  provideSendMessageToClientUseCase(): SendMessageToClientUseCase {
    return this.sendMessageToClientUseCase ??= new SendMessageToClientUseCase(this.provideWhatsappRepository())
  }

  private provideSentMessageResponseSchemaToWhatsappMessageMapper(): SentMessageResponseSchemaToWhatsappMessageMapper {
    return this.sentMessageResponseSchemaToWhatsappMessageMapper ??= new SentMessageResponseSchemaToWhatsappMessageMapper()
  }

  provideSaveSentMessageUseCase(): SaveSentMessageUseCase {
    return this.saveSentMessageUseCase ??=
      new SaveSentMessageUseCase(
        this.provideWhatsappRepository(),
        this.provideSentMessageResponseSchemaToWhatsappMessageMapper()
      )
  }

  provideIncreaseMessageCountUsageUseCase(): IncreaseMessageCountUsageUseCase {
    return this.increaseMessageCountUseCase ??= new IncreaseMessageCountUsageUseCase(this.provideWhatsappRepository())
  }

  provideGetConversationIdUseCase(): GetConversationIdUseCase {
    return this.getConversationIdUseCase ??= new GetConversationIdUseCase(this.provideWhatsappRepository())
  }

  provideTimeWithinLocationBusinessHoursUseCase() {
    return this.timeWithinLocationBusinessHoursUseCase ??=
      new IsTimeWithinLocationBusinessHoursUseCase(this.provideWhatsappRepository())
  }

  provideIsNumberBlackListedUseCase(): IsNumberBlackListedUseCase {
    return this.isNumberBlackListedUseCase ??=
      new IsNumberBlackListedUseCase(this.provideWhatsappRepository())
  }
}