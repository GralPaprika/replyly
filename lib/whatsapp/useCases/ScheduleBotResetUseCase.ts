import { RESET_CONVERSATION_TIME_MINUTES } from "@/lib/common/consts";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class ScheduleBotResetUseCase {
  constructor(
    private readonly whatsappRepository: WhatsappRepository,
  ) {}

  async execute(conversationId: string): Promise<void> {
    await this.whatsappRepository.scheduleBotReset(conversationId, { minutes: RESET_CONVERSATION_TIME_MINUTES });
  }
}