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
import {IsTimeWithinLocationBusinessHoursUseCase} from "@/lib/whatsapp/useCases/IsTimeWithinLocationBusinessHoursUseCase";
import {IsNumberBlackListedUseCase} from "@/lib/whatsapp/useCases/IsNumberBlackListedUseCase";
import {ScheduleBotResetUseCase} from "@/lib/whatsapp/useCases/ScheduleBotResetUseCase";
import {SchedulerRepository} from "@/lib/scheduler/SchedulerRepository";
import {SchedulerRepositoryImpl} from "@/lib/scheduler/SchedulerRepositoryImpl";
import {GetBestResponseUseCase} from "@/lib/whatsapp/useCases/GetBestResponseUseCase";

export class WhatsappRouteComposition {
  private readonly appCompositionRoot: AppComposition
  private whatsappRepository!: WhatsappRepository
  private hasActivePlanUseCase!: HasActivePlanUseCase
  private getConversationStatusUseCase!: GetConversationStatusUseCase
  private updateConversationStatusUseCase!: UpdateConversationStatusUseCase
  private sendMessageToClientUseCase!: SendMessageToClientUseCase
  private increaseMessageCountUseCase!: IncreaseMessageCountUsageUseCase
  private getConversationIdUseCase!: GetConversationIdUseCase
  private timeWithinLocationBusinessHoursUseCase!: IsTimeWithinLocationBusinessHoursUseCase
  private isNumberBlackListedUseCase!: IsNumberBlackListedUseCase
  private scheduleBotResetUseCase!: ScheduleBotResetUseCase
  private getBestResponseUseCase!: GetBestResponseUseCase

  constructor(appCompositionRoot: AppComposition) {
    this.appCompositionRoot = appCompositionRoot
  }

  static provideInstance(): WhatsappRouteComposition {
    return new WhatsappRouteComposition(AppComposition.getInstance())
  }

  private provideWhatsappRepository(): WhatsappRepository {
    return this.whatsappRepository ??= new WhatsappRepositoryImpl(this.appCompositionRoot.getDatabase())
  }

  private provideSchedulerRepository(): SchedulerRepository {
    return this.appCompositionRoot.provideSchedulerRepository()
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

  provideTimeWithinLocationBusinessHoursUseCase() {
    return this.timeWithinLocationBusinessHoursUseCase ??=
      new IsTimeWithinLocationBusinessHoursUseCase(this.provideWhatsappRepository())
  }

  provideIsNumberBlackListedUseCase(): IsNumberBlackListedUseCase {
    return this.isNumberBlackListedUseCase ??=
      new IsNumberBlackListedUseCase(this.provideWhatsappRepository())
  }

  provideScheduleBotResetUseCase(): ScheduleBotResetUseCase {
    return this.scheduleBotResetUseCase ??=
      new ScheduleBotResetUseCase(this.provideUpdateConversationStatusUseCase(), this.provideSchedulerRepository())
  }

  provideGetBestResponseUseCase() {
    return this.getBestResponseUseCase ??= new GetBestResponseUseCase()
  }
}