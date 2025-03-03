import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class UpdateEphemeralUseCase {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(whatsappId: string, clientId: string, expiration: number | null, secretary = false): Promise<void> {
    try {
      if (!secretary) {
        await this.repository.updateEphemeralExpiration(whatsappId, clientId, expiration);
      } else {
        await this.repository.updateEphemeralExpirationSecretary(whatsappId, clientId, expiration);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}