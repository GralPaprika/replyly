import {UpdateConversationStatusUseCase} from "@/lib/whatsapp/useCases/UpdateConversationStatusUseCase";
import {ConversationStatus} from "@/lib/common/models/ConversationStatus";
import {SchedulerRepository} from "@/lib/scheduler/SchedulerRepository";
import {RESET_CONVERSATION_TIME_MINUTES} from "@/lib/scheduler/const";

export class ScheduleBotResetUseCase {
  constructor(
    private readonly updateConversationStatusUseCase: UpdateConversationStatusUseCase,
    private readonly scheduleRepository: SchedulerRepository
  ) {}

  execute(conversationId: string): void {
    this.scheduleRepository.scheduleTask(conversationId, { minutes: RESET_CONVERSATION_TIME_MINUTES }, () => {
      this.updateConversationStatusUseCase.execute(conversationId, ConversationStatus.Idle)
        .then(() => { console.log('Conversation reset', conversationId) })
        .catch((error) => { console.error('Error resetting conversation', error) });
    });
  }
}