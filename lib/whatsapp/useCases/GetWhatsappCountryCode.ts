import { WhatsappRepository } from "@/lib/whatsapp/models/WhatsappRepository";

export class GetWhatsappCountryCode {
  constructor(private readonly repository: WhatsappRepository) {}
  async execute(whatsappId: string): Promise<string> {
    return this.repository.getWhatsappCountryCode(whatsappId);
  }
}