import { WhatsappRepository } from "@/lib/whatsapp/models/WhatsappRepository";

export class GetWhatsappPhoneNumber {
  constructor(private readonly repository: WhatsappRepository) {}
  async execute(whatsappId: string): Promise<string> {
    return this.repository.getWhatsappPhoneNumber(whatsappId);
  }
}