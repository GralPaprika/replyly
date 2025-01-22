import {AppComposition} from "@/composition/AppComposition";
import {HasActivePlanUseCase} from "@/lib/whatsapp/useCases/HasActivePlanUseCase";
import {GetMessageSourceUseCase} from "@/lib/whatsapp/useCases/GetMessageSourceUseCase";
import {DeactivatePlanUseCase} from "@/lib/whatsapp/useCases/DeactivatePlanUseCase";
import {
  WhatsappWebhookSchemaToWhatsappMessageMapper,
} from "@/lib/whatsapp/mappers/WhatsappWebhookSchemaToWhatsappMessageMapper";
import {SaveReceivedMessageUseCase} from "@/lib/whatsapp/useCases/SaveReceivedMessageUseCase";
import {GetConversationStatusUseCase} from "@/lib/whatsapp/useCases/GetConversationStatusUseCase";
import {StringToMessageStatusMapper} from "@/lib/whatsapp/mappers/StringToMessageStatusMapper";
import {UpdateMessageStatusUseCase} from "@/lib/whatsapp/useCases/UpdateMessageStatusUseCase";
import {UpdateConversationStatusUseCase} from "@/lib/whatsapp/useCases/UpdateConversationStatusUseCase";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {WhatsappRepositoryImpl} from "@/lib/whatsapp/respositories/WhatsappRepositoryImpl";
import {RagRepository} from "@/lib/ai/models/RagRepository";
import {RagRepositoryImpl} from "@/lib/ai/repository/RagRepositoryImpl";
import {GetBusinessLocationUseCase} from "@/lib/whatsapp/useCases/GetBusinessLocationUseCase";
import {GetBestResponsesToClientRequestUseCase} from "@/lib/ai/useCases/GetBestResponsesToClientRequestUseCase";
import {SendMessageToClientUseCase} from "@/lib/whatsapp/useCases/SendMessageToClientUseCase";
import {
  SentMessageResponseSchemaToWhatsappMessageMapper,
} from "@/lib/whatsapp/mappers/SentMessageResponseSchemaToWhatsappMessageMapper";
import {SaveSentMessageUseCase} from "@/lib/whatsapp/useCases/SaveSentMessageUseCase";
import {IncreaseMessageCountUsageUseCase} from "@/lib/whatsapp/useCases/IncreaseMessageCountUsageUseCase";
import {GetConversationIdUseCase} from "@/lib/whatsapp/useCases/GetConversationIdUseCase";
import {SaveResponsesUseCase} from "@/lib/ai/useCases/SaveResponsesUseCase";
import {IsTimeWithinLocationBusinessHoursUseCase} from "@/lib/whatsapp/useCases/IsTimeWithinLocationBusinessHoursUseCase";
import {GetRAGResponseUseCase} from "@/lib/ai/useCases/GetRAGResponseUseCase";
import {IsNumberBlackListedUseCase} from "@/lib/whatsapp/useCases/IsNumberBlackListedUseCase";

export class WhatsappRouteComposition {
  private readonly appCompositionRoot: AppComposition
  private whatsappRepository!: WhatsappRepository
  private ragRepository!: RagRepository
  private hasActivePlanUseCase!: HasActivePlanUseCase
  private getMessageSourceUseCase!: GetMessageSourceUseCase
  private saveReceivedMessageUseCase!: SaveReceivedMessageUseCase
  private whatsappWebhookSchemaToWhatsappMessageMapper!: WhatsappWebhookSchemaToWhatsappMessageMapper
  private getConversationStatusUseCase!: GetConversationStatusUseCase
  private stringToMessageStatusMapper!: StringToMessageStatusMapper
  private updateMessageStatusUseCase!: UpdateMessageStatusUseCase
  private updateConversationStatusUseCase!: UpdateConversationStatusUseCase
  private getBusinessLocationUseCase!: GetBusinessLocationUseCase
  private getBestResponsesToClientRequestUseCase!: GetBestResponsesToClientRequestUseCase
  private sendMessageToClientUseCase!: SendMessageToClientUseCase
  private sentMessageResponseSchemaToWhatsappMessageMapper!: SentMessageResponseSchemaToWhatsappMessageMapper
  private saveSentMessageUseCase!: SaveSentMessageUseCase
  private increaseMessageCountUseCase!: IncreaseMessageCountUsageUseCase
  private getConversationIdUseCase!: GetConversationIdUseCase
  private saveResponsesUseCase!: SaveResponsesUseCase
  private timeWithinLocationBusinessHoursUseCase!: IsTimeWithinLocationBusinessHoursUseCase
  private getRAGResponseUseCase!: GetRAGResponseUseCase
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

  private provideWhatsappWebhookSchemaToWhatsappMessageMapper(): WhatsappWebhookSchemaToWhatsappMessageMapper {
    return this.whatsappWebhookSchemaToWhatsappMessageMapper ??= new WhatsappWebhookSchemaToWhatsappMessageMapper()
  }

  provideSaveReceivedMessageUseCase(): SaveReceivedMessageUseCase {
    return this.saveReceivedMessageUseCase ??=
      new SaveReceivedMessageUseCase(
        this.provideWhatsappRepository(),
        this.provideWhatsappWebhookSchemaToWhatsappMessageMapper()
      )
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

  private async provideRagRepository(): Promise<RagRepository> {
    return this.ragRepository ??= new RagRepositoryImpl(await this.appCompositionRoot.getVectorStore())
  }

  async provideGetBestResponsesToClientRequestUseCase(): Promise<GetBestResponsesToClientRequestUseCase> {
    return this.getBestResponsesToClientRequestUseCase ??=
      new GetBestResponsesToClientRequestUseCase(
        await this.provideRagRepository(),
        this.provideWhatsappRepository(),
      )
  }

  async provideSaveResponsesUseCase(): Promise<SaveResponsesUseCase> {
    return this.saveResponsesUseCase ??=
      new SaveResponsesUseCase(await this.provideRagRepository())
  }

  provideTimeWithinLocationBusinessHoursUseCase() {
    return this.timeWithinLocationBusinessHoursUseCase ??=
      new IsTimeWithinLocationBusinessHoursUseCase(this.provideWhatsappRepository())
  }

  async provideGetRAGResponseUseCase(): Promise<GetRAGResponseUseCase> {
    return this.getRAGResponseUseCase ??=
      new GetRAGResponseUseCase(await this.provideRagRepository())
  }

  provideIsNumberBlackListedUseCase(): IsNumberBlackListedUseCase {
    return this.isNumberBlackListedUseCase ??=
      new IsNumberBlackListedUseCase(this.provideWhatsappRepository())
  }
}