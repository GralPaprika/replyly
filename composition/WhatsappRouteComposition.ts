import {AppComposition} from "@/composition/AppComposition";
import {HasActivePlanUseCase} from "@/lib/whatsapp/useCases/HasActivePlanUseCase";
import {DeactivatePlanUseCase} from "@/lib/whatsapp/useCases/DeactivatePlanUseCase";
import {GetConversationStatusUseCase} from "@/lib/whatsapp/useCases/GetConversationStatusUseCase";
import {UpdateConversationStatusUseCase} from "@/lib/whatsapp/useCases/UpdateConversationStatusUseCase";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {WhatsappRepositoryImpl} from "@/lib/whatsapp/respositories/WhatsappRepositoryImpl";
import {SendMessageToClientUseCase} from "@/lib/whatsapp/useCases/SendMessageToClientUseCase";
import {IncreaseMessageCountUsageUseCase} from "@/lib/whatsapp/useCases/IncreaseMessageCountUsageUseCase";
import {GetConversationIdUseCase} from "@/lib/whatsapp/useCases/GetConversationIdUseCase";
import {IsNumberBlackListedUseCase} from "@/lib/whatsapp/useCases/IsNumberBlackListedUseCase";
import {ScheduleBotResetUseCase} from "@/lib/whatsapp/useCases/ScheduleBotResetUseCase";
import {GetBestResponseUseCase} from "@/lib/whatsapp/useCases/GetBestResponseUseCase";
import {GetBestResponseForAudioUseCase} from "@/lib/whatsapp/useCases/GetBestResponseForAudioUseCase";
import {GetClientIdUseCase} from "@/lib/whatsapp/useCases/GetClientIdUseCase";
import {DecodeMediaMessageUseCase} from "@/lib/whatsapp/useCases/DecodeMediaMessageUseCase";
import {ReadReceivedMessageUseCase} from "@/lib/whatsapp/useCases/ReadReceivedMessageUseCase";
import {GetBusinessIdUseCase} from "@/lib/whatsapp/useCases/GetBusinessIdUseCase";
import {UpdateEphemeralUseCase} from "@/lib/whatsapp/useCases/UpdateEphemeralUseCase";
import {IsSecretaryUserUseCase} from "@/lib/whatsapp/useCases/IsSecretaryUserUseCase";
import {HasUserSecretaryPermissionsUseCase} from "@/lib/whatsapp/useCases/HasUserSecretaryPermissionsUseCase";
import {GetBestResponseFromSecretaryUseCase} from "@/lib/whatsapp/useCases/GetBestResponseFromSecretaryUseCase";
import {
  GetBestResponseFromSecretaryAudioUseCase
} from "@/lib/whatsapp/useCases/GetBestResponseFromSecretaryAudioUseCase";
import {GetUserIdUseCase} from "@/lib/whatsapp/useCases/GetUserIdUseCase";
import * as Minio from 'minio'

export class WhatsappRouteComposition {
  private readonly appCompositionRoot: AppComposition
  private whatsappRepository!: WhatsappRepository
  private hasActivePlanUseCase!: HasActivePlanUseCase
  private getConversationStatusUseCase!: GetConversationStatusUseCase
  private updateConversationStatusUseCase!: UpdateConversationStatusUseCase
  private sendMessageToClientUseCase!: SendMessageToClientUseCase
  private increaseMessageCountUseCase!: IncreaseMessageCountUsageUseCase
  private getConversationIdUseCase!: GetConversationIdUseCase
  private isNumberBlackListedUseCase!: IsNumberBlackListedUseCase
  private scheduleBotResetUseCase!: ScheduleBotResetUseCase
  private getBestResponseUseCase!: GetBestResponseUseCase
  private getBestResponseForAudioUseCase!: GetBestResponseForAudioUseCase
  private getDecodeMediaMessageUseCase!: DecodeMediaMessageUseCase
  private getClientIdUseCase!: GetClientIdUseCase
  private readReceivedMessageUseCase!: ReadReceivedMessageUseCase
  private getBusinessIdUseCase!: GetBusinessIdUseCase
  private updateEphemeralUseCase!: UpdateEphemeralUseCase
  private isSecretaryUserUseCase!: IsSecretaryUserUseCase
  private hasUserSecretaryPermissionsUseCase!: HasUserSecretaryPermissionsUseCase
  private getBestResponseFromSecretaryUseCase!: GetBestResponseFromSecretaryUseCase
  private getBestResponseFromSecretaryAudioUseCase!: GetBestResponseFromSecretaryAudioUseCase
  private getUserIdUseCase!: GetUserIdUseCase
  private minioClient!: Minio.Client

  constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): WhatsappRouteComposition {
    return new WhatsappRouteComposition(AppComposition.getInstance())
  }

  private provideWhatsappRepository(): WhatsappRepository {
    return this.whatsappRepository ??= new WhatsappRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  private provideMinioClient(): Minio.Client {
    return this.minioClient ??= new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || '',
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || ''
    })
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

  provideGetConversationStatusUseCase(): GetConversationStatusUseCase {
    return this.getConversationStatusUseCase ??= new GetConversationStatusUseCase(this.provideWhatsappRepository())
  }

  provideUpdateConversationStatusUseCase(): UpdateConversationStatusUseCase {
    return this.updateConversationStatusUseCase ??= new UpdateConversationStatusUseCase(this.provideWhatsappRepository())
  }

  provideSendMessageToClientUseCase(): SendMessageToClientUseCase {
    return this.sendMessageToClientUseCase ??= new SendMessageToClientUseCase()
  }

  provideIncreaseMessageCountUsageUseCase(): IncreaseMessageCountUsageUseCase {
    return this.increaseMessageCountUseCase ??= new IncreaseMessageCountUsageUseCase(this.provideWhatsappRepository())
  }

  provideGetConversationIdUseCase(): GetConversationIdUseCase {
    return this.getConversationIdUseCase ??= new GetConversationIdUseCase(this.provideWhatsappRepository())
  }

  provideIsNumberBlackListedUseCase(): IsNumberBlackListedUseCase {
    return this.isNumberBlackListedUseCase ??=
      new IsNumberBlackListedUseCase(this.provideWhatsappRepository())
  }

  provideScheduleBotResetUseCase(): ScheduleBotResetUseCase {
    return this.scheduleBotResetUseCase ??=
      new ScheduleBotResetUseCase(this.provideWhatsappRepository())
  }

  provideGetBestResponseUseCase() {
    return this.getBestResponseUseCase ??= new GetBestResponseUseCase()
  }

  provideGetDecodeMediaMessageUseCase() {
    return this.getDecodeMediaMessageUseCase ??= new DecodeMediaMessageUseCase()
  }

  provideGetBestResponseForAudioUseCase() {
    return this.getBestResponseForAudioUseCase ??= new GetBestResponseForAudioUseCase(
      this.provideGetDecodeMediaMessageUseCase(),
      this.provideMinioClient(),
    )
  }

  provideGetClientIdUseCase() {
    return this.getClientIdUseCase ??= new GetClientIdUseCase(this.provideWhatsappRepository())
  }

  provideReadReceivedMessageUseCase() {
    return this.readReceivedMessageUseCase ??= new ReadReceivedMessageUseCase()
  }

  provideGetBusinessIdUseCase() {
    return this.getBusinessIdUseCase ??= new GetBusinessIdUseCase(this.provideWhatsappRepository())
  }

  provideUpdateEphemeralUseCase() {
    return this.updateEphemeralUseCase ??= new UpdateEphemeralUseCase(this.provideWhatsappRepository())
  }

  provideIsSecretaryUserUseCase() {
    return this.isSecretaryUserUseCase ??= new IsSecretaryUserUseCase(this.provideWhatsappRepository())
  }

  provideHasUserSecretaryPermissionsUseCase() {
    return this.hasUserSecretaryPermissionsUseCase ??= new HasUserSecretaryPermissionsUseCase(this.provideWhatsappRepository())
  }

  provideGetBestResponseFromSecretaryUseCase() {
    return this.getBestResponseFromSecretaryUseCase ??= new GetBestResponseFromSecretaryUseCase(
      this.provideWhatsappRepository()
    )
  }

  provideGetBestResponseFromSecretaryAudioUseCase() {
    return this.getBestResponseFromSecretaryAudioUseCase ??= new GetBestResponseFromSecretaryAudioUseCase(
      this.provideWhatsappRepository(),
      this.provideGetDecodeMediaMessageUseCase(),
      this.provideMinioClient(),
    )
  }

  provideGetUserUseCase() {
    return this.getUserIdUseCase ??= new GetUserIdUseCase(this.provideWhatsappRepository())
  }
}