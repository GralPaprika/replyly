import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class UpdateEphemeralUseCase {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(whatsappId: string, clientId: string, expiration: number | null): Promise<void> {
    try {
      await this.repository.updateEphemeralExpiration(whatsappId, clientId, expiration);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}