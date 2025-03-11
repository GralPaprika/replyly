import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";

export class GetSecretaryPhoneNumber {
  constructor(private readonly repository: WhatsappRepository) {}

  async execute(secretaryId: string): Promise<string> {
    return await this.repository.getSecretaryPhoneNumber(secretaryId)
  }
}