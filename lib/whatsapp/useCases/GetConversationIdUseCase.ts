import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class GetConversationIdUseCase {

  constructor(private readonly whatsappRepository: WhatsappRepository) {}

  /**
   * Get the conversation id from the whatsapp id and chat id.
   * @param whatsappId
   * @param chatId
   * @returns conversation id
   */
  async execute(whatsappId: string, chatId: string): Promise<string> {
    const conversationId = await this.whatsappRepository.getConversationId(whatsappId, chatId);

    if (conversationId !== null) { // @ts-ignore
      return conversationId;
    }

    return await this.whatsappRepository.createConversation(whatsappId, chatId);
  }
}