import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class GetClientIdUseCase {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(whatsappChatId: string): Promise<string> {
    const clientId = await this.repository.getClientId(whatsappChatId);

    if (!clientId) {
      return await this.repository.createClient(whatsappChatId);
    }

    return clientId;
  }
}