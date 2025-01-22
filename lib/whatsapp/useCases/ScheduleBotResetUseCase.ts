import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {UpdateConversationStatusUseCase} from "@/lib/whatsapp/useCases/UpdateConversationStatusUseCase";
import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {SchedulerRepository, ScheduleTime} from "@/lib/scheduler/SchedulerRepository";

export class ScheduleBotResetUseCase {
  constructor(
    private readonly updateConversationStatusUseCase: UpdateConversationStatusUseCase,
    private readonly scheduleRepository: SchedulerRepository
  ) {}

  execute(conversationId: string): void {
    this.scheduleRepository.scheduleTask(conversationId, { minutes: 30 }, async () => {
      console.log('Resetting conversation', conversationId);
      await this.updateConversationStatusUseCase.execute(conversationId, ConversationStatus.Idle);
    });
  }
}